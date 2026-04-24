# Security

## Identity and Access
- Clerk for authentication with mandatory MFA for admins.
- Role-based authorization at endpoint and service layers.
- Session hardening and token rotation policies.

## Data Protection
- TLS for all in-transit data.
- Encryption at rest for PostgreSQL and object storage.
- PII classification and masking in logs and analytics exports.

## Application Security
- Input validation with strict schemas.
- Upload malware scanning and content-type verification.
- Rate limiting and anti-automation controls for critical endpoints.

## Operational Security
- Secret management via platform vaults.
- Periodic key rotation and credential revocation workflows.
- Security incident runbook with escalation matrix.
