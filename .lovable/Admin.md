# RovaCredit Africa — Admin Command Center

**Status:** v1.0
**Owner:** Operations + Engineering
**Last updated:** 2026-04-24

---

## 1. Roles

| Role | Description |
|---|---|
| `admin_owner` | Founder / CEO. Full access. Cannot be revoked except by another owner. |
| `developer` | Engineering. Read all, mutate products + system, no PII export. |
| `analyst` | Operations. Manage leads, partners, run reports, export. |
| `marketer` | Growth. Read leads (masked), edit campaigns, no partner mutations. |

Roles live in `user_roles` (separate from `profiles`). Membership is checked via the `has_role(uid, role)` SECURITY DEFINER function — never read role from the JWT directly.

## 2. Permissions matrix

| Capability | admin_owner | developer | analyst | marketer |
|---|:-:|:-:|:-:|:-:|
| Manage users & roles | ✓ | | | |
| Products: read | ✓ | ✓ | ✓ | ✓ |
| Products: create/edit/delete | ✓ | ✓ | | |
| Leads: read (full PII) | ✓ | | ✓ | |
| Leads: read (masked) | ✓ | ✓ | ✓ | ✓ |
| Leads: assign / status change | ✓ | | ✓ | ✓ |
| Leads: export CSV | ✓ | | ✓ | |
| Partners: approve / suspend | ✓ | | ✓ | |
| Partners: read agreements | ✓ | | ✓ | |
| Analytics dashboards | ✓ | ✓ | ✓ | ✓ |
| System diagnostics | ✓ | ✓ | | |
| Audit log: read | ✓ | ✓ | ✓ | |
| Audit log: export | ✓ | | | |
| Secrets / config (via GCP) | ✓ | ✓ | | |
| DSR fulfilment (export/delete user data) | ✓ | | ✓ | |

PII masking rule: phone shown as `+256•••••1234`, ID number shown as `••••••6789`.

## 3. Screens

| Screen | Path | Notes |
|---|---|---|
| Overview | `/admin` | KPI tiles: leads/day, conversion, partners active, repayment rate |
| Products | `/admin/products` | CRUD + JSONB specs editor + image management |
| Leads | `/admin/leads` | Pipeline view, filters (tier, location, partner, source), export, WhatsApp follow-up |
| Lead detail | `/admin/leads/$id` | Full timeline, agreement snapshot, status changes, notes |
| Partners | `/admin/partners` | Approval queue, performance, agreement viewer |
| Users & Roles | `/admin/users` | Invite, assign role, suspend |
| Analytics | `/admin/analytics` | Charts (Cube.js / Metabase embed) |
| System | `/admin/system` | Job queues, error rates, recent deploys, feature flags |
| Audit log | `/admin/audit` | Append-only events; filter by actor / entity / time |
| DSR | `/admin/dsr` | Data subject requests with status + exporter |

## 4. Audit log

Every admin write action emits an `audit_event`:

```json
{
  "actor_id": "user_2c...",
  "actor_role": "analyst",
  "action": "lead.status.change",
  "entity": "lead",
  "entity_id": "uuid",
  "before": { "status": "new" },
  "after":  { "status": "contacted" },
  "ip": "41.x.x.x",
  "user_agent": "...",
  "ts": "2026-05-01T09:14:22Z"
}
```

- Append-only table, retention 7 years.
- Streamed daily to Cloud Storage cold bucket.
- Critical actions (role grant, DSR fulfil, secret rotate) also page #ops Slack.

## 5. Operational runbook references

- Lead stuck "pending_review" >48h → see `Runbook.md#lead-sla`.
- Partner agreement signature mismatch → see `Runbook.md#partner-dispute`.
- DSR turnaround > 25 days → see `Runbook.md#dsr-overdue`.

## 6. Hard rules

- No admin screen ever exposes raw national ID, raw card numbers, or raw MoMo PINs.
- All exports are watermarked with the actor's email + timestamp.
- All admin sessions force MFA via Clerk.
- Session inactivity timeout: 30 minutes.
- No admin route is accessible without a server-verified role check; client-side guards are advisory only.
