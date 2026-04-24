# RovaCredit Africa — Testing Strategy

**Status:** v1.0
**Owner:** QA / Engineering
**Last updated:** 2026-04-24

---

## 1. Test pyramid

```text
              /\
             /  \   E2E (Playwright)        ~50 scenarios
            /----\
           /      \  Integration (pytest + httpx, vitest + msw)   ~300 tests
          /--------\
         /          \  Unit (pytest, vitest)                       ~1500 tests
        /------------\
```

Targets: Unit ≥ 70% coverage backend, ≥ 60% frontend; integration covers every API endpoint at least once; E2E covers every P0 user story.

## 2. Tools

| Layer | Tool |
|---|---|
| Backend unit/integration | pytest, pytest-asyncio, httpx, factory-boy |
| Backend DB tests | testcontainers-python (real Postgres 16 in CI) |
| Frontend unit | vitest, @testing-library/react |
| Frontend network mocking | msw |
| E2E | Playwright (Chromium + WebKit) |
| Load | k6 (Grafana k6 cloud or self-hosted) |
| Security | Semgrep, pip-audit, npm audit, OWASP ZAP baseline scan |
| Visual regression | Playwright screenshots + reg-cli (optional) |

## 3. P0 E2E scenarios

1. Anonymous user submits a lead end-to-end → row in DB → WhatsApp deep link generated.
2. Eligibility preview returns Tier B for income 300k-600k + Self-employed + Weekly.
3. Partner completes 3-step onboarding and signs agreement v1.0.
4. Admin owner invites a user and grants `analyst` role.
5. Analyst exports leads CSV — file downloads with watermark.
6. DSR access request → admin fulfils → user receives export link.
7. Marketplace filter by brand persists in URL and across reload.
8. Cookie banner: rejecting analytics blocks the analytics beacon.

## 4. Load test plan

| Scenario | Target | Pass criteria |
|---|---|---|
| `GET /v1/products` | 200 RPS sustained | p95 < 200ms, 0 errors |
| `POST /v1/eligibility/preview` | 100 RPS sustained | p95 < 150ms |
| `POST /v1/leads` | 30 RPS sustained | p95 < 350ms, < 0.1% error |
| Mixed prod-shape | 50 RPS for 30 min | No SLO breach |

Run before each major release in staging.

## 5. CI gates

| Stage | Blocks merge? |
|---|---|
| Lint (ruff, eslint) | yes |
| Type-check (mypy, tsc) | yes |
| Unit | yes |
| Integration | yes |
| Playwright smoke (5 critical) | yes |
| Playwright full | only on `main` |
| Security scan (Critical/High) | yes |
| Coverage threshold | yes |
| Bundle size budget (frontend) | yes |

## 6. Test data

- Faker-driven factories for non-PII fields.
- Static fixture set of 48 products (Samsung, Tecno, Infinix, iPhone, Xiaomi).
- Synthetic Ugandan + Kenyan phone numbers reserved range only.
- No production data ever copied to dev/staging.

## 7. Environments for testing

| Env | Purpose |
|---|---|
| Local | Unit + integration with testcontainers Postgres |
| CI ephemeral | Per-PR Postgres + Redis containers |
| Dev | Always-on, reset weekly, seeded |
| Staging | Production-shape, used for E2E + load |
| Prod | Synthetic monitoring only (read endpoints) |

## 8. Bug bar

- Sev1/Sev2 bugs block release.
- Sev3 may ship with a tracked ticket and workaround.
- Any regression that breaks a P0 E2E scenario is automatically Sev1.
