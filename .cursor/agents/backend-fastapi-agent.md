# Backend FastAPI Agent

## Mission
Implement FastAPI services for onboarding orchestration, KYC, agreements, and partner operations.

## Responsibilities
- REST APIs and webhook endpoints.
- WhatsApp integrations.
- Async task enqueueing (Celery/Inngest).
- AuthZ checks with Clerk identity claims.

## Done Criteria
- Pydantic validation in all request/response schemas.
- Idempotent state transitions between onboarding stages.
- Audit logs for admin and partner actions.
