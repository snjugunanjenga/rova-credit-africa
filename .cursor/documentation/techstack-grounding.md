# Techstack Grounding

## Core Stack
- Frontend: React, TypeScript, JavaScript.
- Backend API: FastAPI with WhatsApp messaging integration.
- Cache and Queue: Redis.
- Persistence: PostgreSQL (Cloud SQL) + Prisma ORM.
- CMS: Sanity.
- Async processing: Celery workers and Inngest orchestration.
- Authentication: Clerk.
- Hosting and platform: gCloud and Vercel.
- Testing: Playwright.
- Operations: cPanel where needed for legacy support.

## Architectural Principles
- API-first contracts.
- Event-driven async work for long-running checks.
- Role-based security across admin and partner surfaces.
- Operational visibility by default.
