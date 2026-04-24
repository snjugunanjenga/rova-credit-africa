# ADR-0006: Locker.io for human-held secrets; GSM for runtime; GitHub Secrets for CI

- **Status:** Accepted
- **Date:** 2026-04-24

## Context
Three distinct secret consumers exist: running services, CI pipelines, and humans. Conflating them creates leakage risk and audit gaps.

## Decision
- **Google Secret Manager (GSM):** runtime secrets consumed by Cloud Run / Celery / Inngest handlers.
- **GitHub Secrets + OIDC:** CI/CD; no static long-lived service-account keys — Workload Identity Federation only.
- **Locker.io (self-hosted in our GCP project):** team password vault for human-held credentials (Clerk dashboard, Vercel, GCP console, vendor portals, break-glass admin).

## Rationale
- Each tool is purpose-built; using GSM for human passwords is awkward and using a password manager for runtime secrets bypasses IAM.
- Locker.io is open-source, self-hostable, and supports SSO + MFA — keeps human secrets under our compliance perimeter.
- GitHub OIDC eliminates the most common credential-leak vector (long-lived deploy keys).

## Consequences
- Three rotation cadences to track — captured in `secrets_inventory.csv`, reviewed monthly.
- Onboarding a new engineer: provision Clerk + Locker.io group memberships; no keys handed out by chat.
- Off-boarding: revoke Locker.io membership + Clerk org membership; no scattered secrets to chase.
