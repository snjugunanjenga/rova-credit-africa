# ADR-0005: Vercel for frontend, Google Cloud Run for backend

- **Status:** Accepted
- **Date:** 2026-04-24

## Context
We need to host (a) a React 19 SPA and (b) a Python FastAPI service plus Celery workers. cPanel was suggested for legacy continuity.

## Decision
- **Vercel** hosts the React 19 SPA (primary).
- **Google Cloud Run** hosts FastAPI and Celery workers (separate services, same project).
- **cPanel** kept only as a static fallback host for the marketing landing page if Vercel is unavailable.

## Rationale
- Vercel: best-in-class edge CDN, instant rollbacks, preview-per-PR, free TLS, and tight Git integration.
- Cloud Run: scales to zero, pay-per-request, Private VPC egress to Cloud SQL, fits our Python container.
- Co-locating data plane (Cloud SQL, Redis, Workers) inside one GCP project simplifies networking, IAM, and billing.
- cPanel cannot host our Python or build pipeline; relegated to "static fallback only".

## Consequences
- Two vendors on the critical path (Vercel + GCP). Status pages monitored; cutover plan documented in `Runbook.md`.
- Cross-origin requests SPA → API are first-party (custom domain `api.rovacredit.africa`); CORS allow-list narrow.
- cPanel deploy is manual, infrequent, and explicitly non-dynamic.
