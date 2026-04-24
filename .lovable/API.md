# RovaCredit Africa — API Contract

**Status:** v1.0 sketch (FastAPI implementation will publish full OpenAPI at `/openapi.json`)
**Owner:** Backend
**Last updated:** 2026-04-24

---

## 1. Conventions

- Base URL: `https://api.rovacredit.africa`
- Versioning: URL prefix `/v1/`. Breaking change → `/v2/`.
- Auth: `Authorization: Bearer <Clerk JWT>` (verified against Clerk JWKS).
- Content-Type: `application/json; charset=utf-8`.
- Idempotency: write endpoints accept `Idempotency-Key` header (UUID).
- Pagination: cursor-based — `?cursor=...&limit=50` returns `{ data: [...], next_cursor: "..." }`.
- Time: ISO-8601 UTC.
- Money: integer minor units + currency code (`{ "amount": 48000000, "currency": "UGX" }` = UGX 48,000.00 if minor=cents-equivalent, or store as plain UGX whole units — to be locked in `ADR-0008`).

## 2. Error envelope

```json
{
  "error": {
    "code": "lead.invalid_phone",
    "message": "Phone number must be a valid Ugandan or Kenyan MSISDN.",
    "request_id": "req_01HZX...",
    "details": [{ "field": "phone", "issue": "format" }]
  }
}
```

Status mapping: 400 validation, 401 missing/invalid token, 403 role denied, 404 not found, 409 conflict (idempotency / unique), 422 business-rule, 429 rate limit, 5xx server.

## 3. Resource map

| Resource | Endpoints |
|---|---|
| Health | `GET /v1/health` |
| Me | `GET /v1/me` |
| Products | `GET /v1/products` · `GET /v1/products/{id}` · `GET /v1/products/{id}/recommendations` |
| Leads | `POST /v1/leads` (public, rate-limited) · `GET /v1/leads` (admin) · `GET /v1/leads/{id}` · `PATCH /v1/leads/{id}` · `POST /v1/leads/{id}/notes` |
| Eligibility | `POST /v1/eligibility/preview` (public) |
| Geocode | `POST /v1/geocode/reverse` (proxy to Google Maps; rate-limited) |
| Partners | `POST /v1/partners/apply` (public) · `GET /v1/partners` (admin) · `POST /v1/partners/{id}/approve` |
| Agreements | `GET /v1/agreements/partner/v1` · `POST /v1/agreements/sign` |
| Webhooks | `POST /v1/webhooks/whatsapp` · `POST /v1/webhooks/clerk` · `POST /v1/webhooks/inngest` |
| DSR | `POST /v1/dsr/request` · `GET /v1/dsr/{id}` (admin) |
| Admin users | `GET /v1/admin/users` · `POST /v1/admin/users/{id}/roles` |
| Admin audit | `GET /v1/admin/audit?entity=lead&entity_id=...` |
| Analytics | `POST /v1/events` (client beacon, batched) |

## 4. Selected schemas

### POST /v1/leads (request)

```json
{
  "product_id": "uuid",
  "name": "Christine Namugga",
  "phone": "+256772123456",
  "location": {
    "latitude": 0.3476,
    "longitude": 32.6126,
    "label": "Ntinda, Kampala"
  },
  "eligibility": {
    "income_band": "300k-600k",
    "employment_type": "Self-employed",
    "repayment_cadence": "Weekly"
  },
  "consent": {
    "dppa_kenya_dpa_accepted": true,
    "marketing_opt_in": false
  },
  "source": "web"
}
```

### POST /v1/leads (response 201)

```json
{
  "id": "uuid",
  "lead_ref": "RC-7F3A",
  "status": "new",
  "tier": "B",
  "down_payment_pct": 0.10,
  "computed_down_payment": 48000,
  "whatsapp_handoff_url": "https://wa.me/254727291121?text=...",
  "created_at": "2026-04-24T09:14:22Z"
}
```

### POST /v1/eligibility/preview

Stateless. Returns `tier`, `down_payment_pct`, `repayment_plan` for given inputs. No row written.

## 5. Rate limits

| Endpoint | Anon | Authenticated |
|---|---|---|
| `POST /v1/leads` | 5 / 15 min / IP | 30 / 15 min / user |
| `POST /v1/eligibility/preview` | 30 / min / IP | 120 / min / user |
| `POST /v1/geocode/reverse` | 10 / min / IP | 60 / min / user |
| Other reads | 60 / min | 600 / min |

Enforced at API gateway (Cloud Armor + FastAPI middleware fallback).

## 6. Webhooks consumed

- **WhatsApp**: `POST /v1/webhooks/whatsapp` — Meta signature header verified; events: `messages`, `statuses`. Inbound "STOP" → consent revoked.
- **Clerk**: `POST /v1/webhooks/clerk` — events: `user.created`, `user.updated`, `user.deleted` → mirror into `profiles`.
- **Inngest**: `POST /v1/webhooks/inngest` — internal callbacks for steps requiring API mutation.

## 7. OpenAPI

FastAPI auto-generates `/openapi.json` and `/docs` (Swagger UI). The CI pipeline regenerates the typed TS client into `frontend/src/api/` on every backend release; PR opened against frontend repo.

## 8. Backwards-compatibility rules

- Adding optional fields → safe.
- Adding new endpoints → safe.
- Removing fields, renaming, narrowing types → breaking; requires `/v2`.
- Deprecation: 90-day window with `Deprecation` + `Sunset` headers and changelog entry.
