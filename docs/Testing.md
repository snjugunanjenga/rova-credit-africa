# Testing Strategy

## Test Pyramid
- Unit tests: domain rules, state transitions, validators.
- Integration tests: DB access, Redis queues, external adapters.
- E2E tests: full onboarding in Playwright.

## Critical Scenarios
1. Approved onboarding from Stage 1 to Complete.
2. Approved with amendment path and asset downgrade.
3. Rejection flow with partner notifications.
4. Enrollment failure fallback from Stage 4 back to Stage 3.
5. Role-based access restrictions for admin and partner users.

## Quality Gates
- Required passing CI checks before merge.
- Regression suite on all onboarding workflow changes.
- Contract tests for external integration adapters.
