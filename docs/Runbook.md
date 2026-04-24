# Runbook

## 1. Common Operational Checks
- API health endpoint status.
- Worker queue depth and processing lag.
- Integration callback success rate.

## 2. Incident: CRB Integration Failure
1. Confirm provider status and error rates.
2. Pause automatic transitions from Stage 1.
3. Trigger retry jobs for impacted applications.
4. Notify operations and update status page.

## 3. Incident: Device Enrollment Failure
1. Inspect Knox/PayJoy webhook logs.
2. Requeue enrollment tasks with backoff.
3. Route unresolved cases to admin exception queue.

## 4. Incident: WhatsApp Delivery Degradation
1. Verify provider response codes.
2. Switch to fallback templates/channels.
3. Retry signed agreement prompts.

## 5. Recovery Validation
- Confirm stage transitions resume.
- Validate no duplicate transitions were created.
- Record incident summary and action items.
