# Epic Story Map

## Epic 1 - Intake and Eligibility
- E1-S1: Build client intake form/API contracts.

- E1-S2: Add CRB adapter with async result handling.
- E1-S3: Persist decision reasoning and risk tier.
- E1-S4: Route amendment/rejection outcomes to partner workflows.

## Epic 2 - Device and Payment
- E2-S1: IMEI capture + validation rules.
- E2-S2: DP proof upload and verification metadata.
- E2-S3: Provider sync for Knox/PayJoy and relock scheduling.
- E2-S4: Reconciliation job for enrollment mismatches.

## Epic 3 - KYC and Client Verification
- E3-S1: ID front/back upload handling.
- E3-S2: Selfie and unboxing evidence capture.
- E3-S3: Validation policy engine for minimum proof set.
- E3-S4: Escalation queue for mismatch reviews.

## Epic 4 - Agreement and Activation
- E4-S1: Agreement template dispatch over WhatsApp.
- E4-S2: Acknowledgement receipt capture and timestamping.
- E4-S3: Final enrollment verification gate.
- E4-S4: Fallback transition from Stage 4 to Stage 3 when needed.

## Epic 5 - Admin Governance
- E5-S1: Owner approval and override workflow.
- E5-S2: Developer diagnostics and integration health console.
- E5-S3: Analyst risk/conversion insights.
- E5-S4: Marketer campaign controls and engagement metrics.

## Epic 6 - Partner Performance
- E6-S1: Partner onboarding and KYC.
- E6-S2: Partner dashboard for pipeline status.
- E6-S3: Partner scorecard (approval rate, fallout, fraud signals).
- E6-S4: Notifications and SLA nudges for pending actions.

## Epic 7 - Security and Compliance
- E7-S1: Clerk RBAC enforcement across APIs/UI.
- E7-S2: AES-256 protected storage for sensitive identifiers.
- E7-S3: Audit event model and immutable trail strategy.
- E7-S4: Data retention/deletion compliance automation.

## Epic 8 - Observability and Quality
- E8-S1: Sentry + trace correlation setup.
- E8-S2: Cloud Monitoring alert policies.
- E8-S3: Playwright critical user journey suite.
- E8-S4: Release checklist and production smoke automation.
