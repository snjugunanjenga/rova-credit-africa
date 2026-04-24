# RovaCredit Africa — Observability

**Status:** v1.0
**Owner:** SRE
**Last updated:** 2026-04-24

---

## 1. Pillars

| Pillar | Tooling |
|---|---|
| Logs | Google Cloud Logging (structured JSON) |
| Metrics | Cloud Monitoring (managed Prometheus) |
| Traces | Cloud Trace (OpenTelemetry SDK) |
| Errors | Sentry (FE + BE) |
| Synthetic | Cloud Monitoring uptime checks |
| Real-user monitoring | Sentry Replay (sampled, PII-scrubbed) |
| Audit | `audit_events` table → daily export to immutable bucket |

## 2. Logging conventions

All API logs are structured JSON with these required fields:

```json
{
  "ts": "2026-04-24T09:14:22.123Z",
  "severity": "INFO",
  "service": "api",
  "env": "prod",
  "request_id": "req_01HZX...",
  "trace_id": "...",
  "user_id": "user_2c...",
  "route": "POST /v1/leads",
  "msg": "lead.created",
  "lead_ref": "RC-7F3A"
}
```

Forbidden in logs: phone numbers, names, ID numbers, full geolocation (round to 0.01° if needed). CI grep check enforces.

## 3. Metrics

Standard application metrics emitted via OTel:

- `http.server.request.duration` (histogram, by route + status)
- `http.server.requests` (counter)
- `db.client.operation.duration` (histogram)
- `celery.task.duration` (histogram, by task name + status)
- `inngest.step.duration` (gauge)
- `business.lead.created` (counter, by tier + source)
- `business.partner.approved` (counter)
- `business.repayment.due` (gauge)

## 4. SLOs

| Service | SLI | Target |
|---|---|---|
| Marketplace browse | Availability of `GET /v1/products` | 99.9% / 30d |
| Lead capture | Success rate of `POST /v1/leads` | 99.5% / 30d |
| Lead capture | Latency p95 of `POST /v1/leads` | < 350 ms / 30d |
| WhatsApp receipt | Delivered within 60s | 95% / 7d |
| Partner approval | Decision within 48h | 90% / 30d |
| DSR fulfilment | Closed within 30d | 100% / quarter |

Error budgets tracked monthly; budget burn >2x triggers a freeze on non-critical changes.

## 5. Alert routing

| Alert | Channel | Severity |
|---|---|---|
| SLO burn rate (1h fast burn) | PagerDuty | Sev1 |
| SLO burn rate (6h slow burn) | PagerDuty | Sev2 |
| Backup missed | PagerDuty | Sev2 |
| Sentry new issue (Critical) | PagerDuty | Sev2 |
| Sentry new issue (High) | Slack `#bugs` | Sev3 |
| Cost anomaly (>30% MoM) | Slack `#finance` | Sev3 |
| Security finding (Critical) | PagerDuty + #security | Sev1 |

## 6. Dashboards

Provisioned via Terraform, lives in `/infra/observability/`.

- **Service Health** — RPS, error rate, latency p50/p95/p99 per service.
- **Business** — leads per hour, conversion funnel, repayment rate.
- **Workers** — Celery queue depth, task durations, DLQ count.
- **Inngest** — step success, retries, mean duration.
- **DB** — connections, slow queries, replication lag.
- **Cost** — daily spend by service.

## 7. Tracing

OpenTelemetry auto-instrumentation for FastAPI, SQLAlchemy, httpx, Celery.
Trace headers propagated end-to-end: SPA (`traceparent`) → API → workers → external calls.

Sampling: 10% baseline, 100% for `POST /v1/leads`, 100% for any 5xx.

## 8. Retention

| Data | Retention |
|---|---|
| Logs (hot) | 30 days |
| Logs (cold export) | 1 year |
| Metrics | 13 months |
| Traces | 30 days |
| Sentry events | 90 days |
| Audit events (DB) | 7 years |

## 9. Postmortem template

Stored in `/docs/postmortems/YYYY-MM-DD-slug.md`. Sections: Summary, Timeline, Impact, Root cause, Detection, Response, Lessons (what went well / what didn't), Action items (owner + due date). Blameless. Reviewed weekly.
