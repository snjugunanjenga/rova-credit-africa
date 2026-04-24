# Admin Operations and Role Model

## Roles

### Owner
- Full administrative control.
- Manages policy, risk thresholds, and role assignment.
- Final approver for sensitive overrides.

### Developers
- Maintain integrations, APIs, and background jobs.
- Access technical diagnostics and feature flags.
- No authority for business policy overrides unless delegated.

### Analyst
- Reviews conversion metrics and risk indicators.
- Manages reporting and anomaly detection.
- Can recommend, but not enforce, policy changes.

### Marketers
- Operate partner engagement and communication campaigns.
- Manage WhatsApp templates and lifecycle nudges.
- Analyze funnel drop-off and activation rates.

## Admin Work Queues
- Eligibility exceptions.
- Device enrollment failures.
- KYC mismatch reviews.
- Agreement pending and activation retries.

## Permission Principles
- Least privilege by default.
- Sensitive actions require explicit grants and audit logs.
- Role changes require owner approval.
