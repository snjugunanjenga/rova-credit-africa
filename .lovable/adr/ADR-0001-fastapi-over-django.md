# ADR-0001: FastAPI over Django for the API service

- **Status:** Accepted
- **Date:** 2026-04-24
- **Deciders:** Engineering Lead, Backend Lead

## Context
We need a Python web framework for the RovaCredit API. Candidates: FastAPI, Django (+DRF), Flask.

## Decision
Use **FastAPI** as the primary API framework.

## Rationale
- Async-first model fits high-concurrency lead capture and outbound WhatsApp/MoMo I/O.
- Pydantic v2 validation matches our typed contract approach.
- Auto-generated OpenAPI feeds the typed TS client used by the React 19 SPA.
- Smaller surface area than Django; we do not need Django admin (we build our own).

## Consequences
- We assemble auth, ORM (SQLAlchemy 2.x), migrations (Alembic), admin from best-of-breed parts.
- Junior Python devs may need ramp time on async patterns.
- No batteries-included admin — explicit decision; our admin is a first-class product.
