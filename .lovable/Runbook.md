# RovaCredit Africa — Operations Runbook

**Status:** v1.0
**Owner:** SRE / On-call
**Last updated:** 2026-04-24

---

## 1. On-call

- Rotation: weekly, Mon 09:00 EAT → Mon 09:00 EAT.
- Tool: PagerDuty (Sev1/Sev2) + Slack `#ops-alerts` (Sev3+).
- Backup on-call paged after 10 min unack.
- Compensation: per-shift stipend + comp time for Sev1 work outside hours.

## 2. Severity definitions

| Sev | Definition | Response time |
|---|---|---|
| Sev1 | Customer-facing outage; data at risk; security incident | Page immediately, war room within 15 min |
| Sev2 | Major feature broken; significant degraded performance | Page within business hours; ack within 30 min |
| Sev3 | Minor bug; workaround exists | Ticket; resolve within 1 sprint |
| Sev4 | Cosmetic | Backlog |

## 3. Common operations

### 3.1 Deploy rollback

```bash
# Cloud Run: route 100% to previous revision
gcloud run services update-traffic api \
  --region europe-west1 \
  --to-revisions <previous-rev>=100
```

Vercel: `vercel rollback <deployment-url>` or via dashboard "Promote to Production".

### 3.2 Database migration failed mid-deploy

1. Stop traffic to new revision (rollback above).
2. Inspect Alembic state: `alembic current`, `alembic history`.
3. If forward-incompatible, run `alembic downgrade -1`.
4. Open incident; coordinate fix forward in next deploy.

### 3.3 Restore from backup

```bash
gcloud sql backups list --instance=rc-prod
gcloud sql backups restore <BACKUP_ID> \
  --restore-instance=rc-prod-restore \
  --backup-instance=rc-prod
```

Always restore into a NEW instance first; promote only after data verification.

### 3.4 Rotate a secret

1. Generate new value in source (vendor portal / `openssl rand`).
2. `gcloud secrets versions add <name> --data-file=-`
3. Force Cloud Run revision: `gcloud run services update api --update-secrets ...`
4. Verify new value in use; revoke old version after 24h.
5. Log rotation in `secrets_inventory.csv`.

### 3.5 Drain a Celery worker

```bash
celery -A app.worker control shutdown -d worker@<pod>
```

Cloud Run: set `min-instances=0` then redeploy with new image.

## 4. Incident playbooks

### 4.1 API 5xx spike

1. Check Sentry — group dominant error.
2. Check Cloud Run metrics — CPU, memory, instance count.
3. Check Cloud SQL — connections, slow queries, CPU.
4. If DB: read replica or scale instance vertically.
5. If app code: rollback (3.1).
6. Communicate in `#status` and update statuspage if customer-impacting.

### 4.2 WhatsApp send failures

1. Check Meta Business Manager for template status.
2. Check phone number quality rating; if "Low", pause non-essential sends.
3. Inspect Celery DLQ for stuck tasks; replay after fix.

### 4.3 Clerk JWT verification failing globally

1. Check JWKS endpoint reachability from Cloud Run.
2. Verify cached JWKS has not been wiped; force refresh.
3. Check Clerk status page.
4. As last resort, enable read-only public marketplace by toggling feature flag `auth_required`.

### 4.4 Lead SLA breach (`lead-sla`)

A lead in `pending_review` >48h triggers Inngest escalation. Manual playbook:
1. Open `/admin/leads/$id`.
2. Read notes; contact partner via WhatsApp.
3. Reassign or mark `stale` with reason.

### 4.5 DSR overdue (`dsr-overdue`)

Any DSR open >25 days surfaces in `#compliance`. DPO must:
1. Confirm subject identity.
2. Run export script `scripts/dsr_export.py --subject <id>` (admin-only).
3. Deliver via secure link (24h expiry, single-use).
4. Mark DSR fulfilled in `/admin/dsr`.

### 4.6 Suspected security incident

1. Page Security Lead.
2. Preserve evidence — do NOT shut down compromised resources before snapshot.
3. Rotate any exposed credentials (3.4) immediately.
4. Notify DPO; assess regulator notification clock (72h, see `Compliance.md`).
5. Engage external IR firm if scope unclear.

## 5. Health checks & monitors

| Monitor | Threshold | Action |
|---|---|---|
| API uptime probe | 2 consecutive failures | Sev1 page |
| API p95 latency | >500ms 5 min | Sev2 page |
| Celery queue depth | >1000 | Sev2 alert |
| Inngest failed runs | >5 in 5 min | Sev2 alert |
| Cloud SQL CPU | >80% 10 min | Sev3 alert |
| WhatsApp quality rating | drops below "High" | Sev2 alert |
| Sentry error rate | 2x baseline | Sev3 alert |
| Backup completion | missed daily | Sev2 alert |

## 6. Disaster Recovery test (quarterly)

1. Provision `rc-dr` Cloud SQL from latest backup.
2. Stand up `api-dr` Cloud Run pointed at `rc-dr`.
3. Run DR Playwright suite.
4. Document RTO/RPO actual vs target; file gaps.
5. Tear down within 24h.

## 7. Useful queries (read-only, anonymised)

```sql
-- Leads in pipeline by tier today
SELECT eligibility_tier, COUNT(*) FROM leads
WHERE created_at >= now() - interval '1 day'
GROUP BY 1 ORDER BY 1;

-- Partners with no lead in 14 days
SELECT p.id, p.business_name FROM partners p
LEFT JOIN leads l ON l.partner_id = p.id AND l.created_at > now() - interval '14 days'
WHERE p.status = 'approved' AND l.id IS NULL;
```
