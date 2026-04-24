# Approved Techstack Grounding (v1.0)

## 1) Application Layers

### Frontend (Client + Merchant Portal)
- Framework: React 19 with TypeScript.
- Styling/UI: Tailwind CSS, shadcn/ui, Lucide React, Framer Motion.
- State: TanStack Query for caching onboarding and loan states.
- Deployment: Vercel edge network optimized for East Africa latency.

### Backend API (Core Logic)
- Framework: FastAPI (Python 3.11+).
- API style: RESTful architecture with OpenAPI docs at `/docs`.
- Messaging integration: WhatsApp Business API (Twilio or Meta provider abstraction).

### Database and Persistence
- Primary DB: PostgreSQL on GCP Cloud SQL.
- ORM: Prisma for typed models and migration management.
- CMS: Sanity CMS for editable pricing/marketing content.

### Real-time and Queueing
- Cache/Broker: Redis.
- Queue workers: Celery for long-running operations (CRB checks, interest accrual, device lock commands).

## 2) Platform and Tooling

### Identity and Security
- Auth: Clerk (JWT, MFA, session controls).
- Data encryption: AES-256 for NIN and sensitive PII at rest.
- Transport security: HTTPS + TLS 1.3 everywhere.

### Orchestration and Infrastructure
- Cloud provider: Google Cloud Platform.
- Compute: Docker services on Compute Engine.
- Event workflows: Inngest for event-driven retries and timers.
- Legacy ops: cPanel only for DNS/email/static legacy assets.

### DevOps and Quality
- CI/CD: GitHub Actions.
- E2E tests: Playwright.
- Monitoring: Sentry + Google Cloud Monitoring.

## 3) Why this stack fits East Africa
- Handles high webhook concurrency for MTN MoMo and Airtel Money flows.
- Enables near-real-time device lock/unlock enforcement.
- Optimized frontend delivery on variable 3G/4G networks.
- Preserves strict relational auditability for lending/compliance controls.

## 4) Required Environment Variables
- `DATABASE_URL` (Cloud SQL connection)
- `REDIS_URL` (Memorystore or VM Redis)
- `CLERK_SECRET_KEY` (auth verification)
- `WHATSAPP_API_KEY` (messaging provider)
- `DEVICE_SDK_TOKEN` (lock/unlock integration)
