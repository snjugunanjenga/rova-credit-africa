# Tech Stack

## Application Layers

Frontend (React, TypeScript, JavaScript)
-> Backend API (FastAPI + WhatsApp integration)
-> Redis (cache + queue)
-> PostgreSQL (Cloud SQL), Sanity CMS, Prisma
-> Background Workers (async processing)

## Platform and Tooling
- Auth: Clerk
- Workers/Orchestration: Celery, Inngest
- Infra: gCloud, Vercel
- Testing: Playwright
- Ops surface: cPanel (where legacy workflows require it)

## Why This Stack
- Fast iteration on UI and APIs with strong typing.
- Reliable async processing for CRB, device enrollment, and messaging.
- Scalable relational model with robust query support.
- Operational flexibility across modern and legacy environments.
