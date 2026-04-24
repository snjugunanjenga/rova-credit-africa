# Testing Implementation Plan

## Test stack
- Backend unit/integration: pytest + FastAPI test client.
- Frontend/unit: React Testing Library + Vitest.
- End-to-end: Playwright.
- Operational checks: synthetic probes + monitoring alerts.

## Mandatory coverage by domain
1. Eligibility decisions: approved / amendment / rejected.
2. Device stage verification: IMEI, DP proof, provider enrollment sync.
3. KYC checks: required evidence, validation errors, retries.
4. Agreement flow: send, acknowledge, and completion safeguards.
5. Role access: Owner, Developer, Analyst, Marketer, Partner permissions.

## Phase-level quality gates
- Phase 1: auth and persistence tests green.
- Phase 2: onboarding state machine + integration adapters green.
- Phase 3: portal and queue workflows green in Playwright.
- Phase 4: chaos/failure-path and security checks green.
- Phase 5: pre-prod and prod smoke suites green.

## CI policy
- PRs fail on test regressions.
- Coverage cannot decrease for touched modules.
- E2E smoke suite required before deploy job unlocks.
