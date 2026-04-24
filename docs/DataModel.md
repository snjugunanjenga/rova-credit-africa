# Data Model

## Core Entities

### User
- `id`, `clerk_id`, `role`, `status`, `created_at`

### Partner
- `id`, `name`, `contact_phone`, `risk_tier`, `status`, `created_at`

### ClientApplication
- `id`, `partner_id`, `client_name`, `phone_256`, `id_number`, `asset_model`, `stage`, `stage_status`, `created_at`

### EligibilityCheck
- `id`, `application_id`, `crb_provider`, `score`, `decision`, `reason`, `checked_at`

### DeviceEnrollment
- `id`, `application_id`, `imei`, `dp_amount`, `dp_proof_url`, `knox_status`, `payjoy_status`, `goupil_relock_time`

### KycEvidence
- `id`, `application_id`, `id_front_url`, `id_back_url`, `selfie_url`, `unboxing_url`, `verification_status`

### Agreement
- `id`, `application_id`, `delivery_channel`, `sent_at`, `signed_at`, `acknowledged_at`, `status`

### AuditEvent
- `id`, `actor_user_id`, `application_id`, `event_type`, `payload_json`, `created_at`

## Relationships
- One Partner to many ClientApplications.
- One ClientApplication to one EligibilityCheck, one DeviceEnrollment, one KycEvidence, one Agreement.
- One User to many AuditEvents.
