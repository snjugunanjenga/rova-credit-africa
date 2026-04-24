# RovaCredit Africa — Security

**Status:** v1.0
**Owner:** Security / DPO
**Last updated:** 2026-04-24

---

## 1. Threat model (STRIDE)

| Component | Top threats | Mitigations |
|---|---|---|
| React SPA | XSS, supply-chain (npm) | CSP, Trusted Types, dependabot, signed lockfile, no inline scripts |
| Clerk auth | Token theft, session fixation | httpOnly+SameSite cookies, MFA enforced for admin, rotate JWKS keys |
| FastAPI | Injection, SSRF, auth bypass | Pydantic validation, parameterised SQL (SQLAlchemy), allow-list for outbound HTTP, `require_role` dep on every admin route |
| Cloud SQL | Data exfil, weak creds | Private IP only, IAM auth, no public access, CMEK encryption, daily backup + PITR |
| Redis | Open port, replay | VPC-internal only, AUTH password from Secret Manager, TLS in transit |
| Celery worker | Task injection | Signed task payloads, allow-list of registered task names |
| Inngest | Webhook spoof | HMAC signature verification on every event |
| WhatsApp webhook | Spoof / replay | Meta signature header verified, timestamp window 5 min |
| GCP project | Privilege escalation | Org policies, least-privilege IAM, no `Owner` to humans, break-glass account in Locker.io |

## 2. Authentication & authorization

- **Customers**: Clerk email/phone OTP + Google OAuth.
- **Admins**: Clerk + MFA mandatory, IP allow-list optional.
- **Service-to-service**: Workload Identity Federation; no static service account keys.
- **API**: every request → JWT verified via cached Clerk JWKS → `current_user` dependency → `require_role(...)` for protected routes.
- **Database**: roles stored in `user_roles` table; checked via `has_role(uid, role)` SECURITY DEFINER function. Never trust a JWT claim for role.

## 3. Secrets management

| Secret | Where stored | Rotation |
|---|---|---|
| Cloud SQL password | Google Secret Manager | 90 days, automated |
| Clerk webhook secret | Google Secret Manager | 180 days |
| WhatsApp permanent token | Google Secret Manager | 60 days |
| Google Maps API key | Google Secret Manager (HTTP referrer + IP restricted) | 180 days |
| Inngest signing key | Google Secret Manager | 180 days |
| GitHub Actions deploy creds | OIDC → no static keys | n/a |
| Vendor portal logins (Clerk dashboard, Vercel, GCP console) | Locker.io team vault | 180 days, MFA-protected |

Rotation tracked in a `secrets_inventory.csv` reviewed monthly.

## 4. Data classification

| Class | Examples | Handling |
|---|---|---|
| **Restricted** | National ID, MoMo PIN (never stored), bank account | Encrypted at rest (CMEK + app-level AES-GCM), masked in UI, never logged |
| **Confidential** | Phone, address, lead notes, repayment history | Encrypted at rest, RBAC, audit on read |
| **Internal** | Admin emails, internal docs | RBAC |
| **Public** | Marketing copy, marketplace catalog | None |

Logs MUST NOT contain Restricted or Confidential data. CI grep check enforces.

## 5. Network security

```text
Internet ──► Cloudflare-equivalent (Vercel edge)
        ──► Cloud Run (TLS 1.3 only, HSTS, OWASP-tuned)
                │
                └─── Serverless VPC Connector ───► VPC (10.x.x.x)
                                                       ├─ Cloud SQL (Private IP)
                                                       ├─ Memorystore Redis
                                                       └─ Internal services
```

- No public IPs on data plane.
- Egress allow-list: WhatsApp, Maps, Inngest, Sentry, Clerk JWKS only.

## 6. Audit & monitoring

- Audit log table (append-only, 7-year retention).
- Cloud Audit Logs streamed to a separate immutable bucket.
- Sentry for FE + BE error tracking; PII scrubbing rules enabled.
- Alert routes: Sev1 → PagerDuty + Slack; Sev2 → Slack; Sev3+ → ticket only.

## 7. Vulnerability management

- Dependabot weekly.
- `pip-audit` and `npm audit` in CI; Critical/High blocks merge.
- Annual third-party pen test (M7 + yearly).
- Bug bounty (Phase 3): hosted on Intigriti or HackerOne.

## 8. Backup & DR

- Cloud SQL automated daily backup, 35-day retention, PITR to second.
- Weekly restore drill in dev environment.
- DR target: RPO 5 min, RTO 1 hour. Cross-region restore documented in `Runbook.md`.

## 9. Compliance touchpoints

- Uganda DPPA 2019 — see `Compliance.md`.
- Kenya DPA 2019 — see `Compliance.md`.
- ISO 27001 alignment (path, not certified at MVP).
- PCI-DSS scope review when card payments added (post-MVP).
