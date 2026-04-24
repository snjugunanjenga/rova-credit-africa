# Agent Operating Model (Build -> Deploy)

## Squad model
- Product Architect: own decomposition, acceptance criteria, scope control.
- Frontend React Agent: partner/admin UX implementation + accessibility.
- Backend FastAPI Agent: domain APIs, workflows, integrations.
- Data Platform Agent: schema, migrations, Redis/Celery topology, retention.
- QA/Observability Agent: test harnesses, telemetry, release gates.
- Growth/Ops Agent: partner adoption metrics, messaging operations.

## Handoff protocol per phase
1. Product Architect defines story acceptance criteria.
2. Backend/Data agents implement contracts and persistence.
3. Frontend agent integrates UI against stable API contracts.
4. QA agent validates with unit/integration/E2E suites.
5. Observability + runbook checks complete before deployment.

## Deployment ownership
- Backend/Data/QA agents co-own GCP release checklist.
- Frontend agent owns Vercel release and client smoke checks.
- Product Architect signs scope completion against PRD goals.
