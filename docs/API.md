# API Specification (Draft)

## Authentication
- All endpoints require Clerk JWT.
- Admin-only endpoints validate role claims.

## Partner Endpoints
- `POST /api/v1/partners`
- `GET /api/v1/partners/{partnerId}`
- `POST /api/v1/applications`
- `GET /api/v1/applications/{applicationId}`
- `POST /api/v1/applications/{applicationId}/stage/device`
- `POST /api/v1/applications/{applicationId}/stage/kyc`

## Onboarding Stage Endpoints
- `POST /api/v1/applications/{id}/eligibility/check`
- `POST /api/v1/applications/{id}/agreement/send`
- `POST /api/v1/applications/{id}/agreement/acknowledge`
- `POST /api/v1/applications/{id}/complete`

## Admin Endpoints
- `GET /api/v1/admin/queues`
- `POST /api/v1/admin/applications/{id}/override`
- `GET /api/v1/admin/analytics/funnel`
- `GET /api/v1/admin/analytics/risk`

## Webhooks
- `POST /api/v1/webhooks/crb`
- `POST /api/v1/webhooks/payjoy`
- `POST /api/v1/webhooks/whatsapp`

## API Standards
- JSON request/response.
- Trace ID in headers for observability.
- Idempotency key required for mutating endpoints with retriable behavior.
