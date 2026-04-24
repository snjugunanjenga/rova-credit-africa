# Onboarding Flows

## A. Client Financing Onboarding Workflow Overview
The onboarding flow consists of four stages:
1. Eligibility Screening
2. Device Stage
3. Client Checks
4. Agreement and Release

### Stage 1: Eligibility Screening
Purpose: Prevent fraud and reduce NPL risk.

Inputs:
- Client Name (string)
- Phone Number (256 format)
- ID Number (integer)
- Asset Model (dropdown)

Logic:
- Execute CRB check via API.
- Score risk and affordability.

Outcomes:
- Approved -> Proceed to Stage 2.
- Approved with Amendment -> downgrade asset and re-confirm.
- Rejected -> terminate application.

### Stage 2: Device Stage
Purpose: Bind payment and physical asset.

Inputs:
- IMEI number
- Asset make/model
- Photo evidence: IMEI and downpayment proof

Backend Actions:
- Calculate and verify downpayment.
- Upload device to Knox/PayJoy.
- Set relock time via Goupil.

Exit Criteria:
- Device enrollment and payment evidence validated.

### Stage 3: Client Checks (KYC and Setup)
Purpose: Confirm identity, possession, and communications readiness.

Rules:
- SIM card must be in purchased device.
- WhatsApp must be installed and configured.
- Device must have active data/bundles.

Required Uploads:
- ID front and back
- Client selfie
- Unboxing photo with client and device

Exit Criteria:
- KYC evidence complete and validated.

### Stage 4: Agreement and Release
Purpose: Execute legal acceptance and final activation.

Actions:
- Back office sends agreement via WhatsApp.
- Client submits onboarding acknowledgement.
- Verify enrollment status before completion.

Fallback:
- If enrollment check fails, return to Stage 3 while retaining existing data.

Completion:
- Mark application as Complete.

---

## B. Partner Onboarding Flow
Partners are phone sellers operating on behalf of the business.

### Partner Registration
1. Partner submits business profile, contacts, and payout details.
2. Admin Owner or Analyst validates partner legitimacy.
3. System creates partner account with scoped permissions.

### Partner Activation
1. Partner receives onboarding checklist in portal and WhatsApp.
2. Partner completes compliance forms and required training.
3. Platform enables application submission permissions.

### Partner Daily Operation
1. Create and track client applications.
2. Upload stage evidence and resolve exceptions.
3. Monitor conversion funnel and pending actions.

### Partner Risk Controls
- Fraud score and rejection rates monitored per partner.
- Elevated-risk partners routed to stricter review queues.

---

## C. Admin Staff Onboarding Flow
Admin roles: Owner, Developers, Analyst, Marketers.

### Common Admin Setup
1. Invite user with Clerk identity.
2. Assign role and environment access.
3. Enforce MFA and policy acknowledgement.

### Owner Onboarding
- Configure business rules, approval limits, and escalation paths.
- Manage role assignments and audit reviews.

### Developers Onboarding
- Access developer console, API keys, and integration sandboxes.
- Follow deployment and incident response runbooks.

### Analyst Onboarding
- Access reporting datasets and BI dashboards.
- Configure risk and conversion monitoring views.

### Marketers Onboarding
- Access messaging templates and campaign workflows.
- Track activation and retention funnel performance.
