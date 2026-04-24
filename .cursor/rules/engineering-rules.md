# Engineering Rules

## Delivery Rules
- Every user-facing workflow must have API, data model, and test documentation.
- Stage transitions must be explicit and auditable.
- All privileged actions require role checks.

## Security Rules
- Encrypt PII in transit and at rest.
- Minimize sensitive data in logs.
- Validate all uploads and external callbacks.

## Ops Rules
- Define rollback before deploying breaking changes.
- Add observability hooks for new endpoints and workers.
