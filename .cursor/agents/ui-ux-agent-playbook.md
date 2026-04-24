# UI/UX Agent Playbook

## Mission
Execute the Rova UI refresh across public, partner, legal, and admin surfaces with high visual consistency and zero funnel regression.

## Agent responsibilities
- Frontend React Agent: implements layout, components, and page updates.
- Product Architect Agent: validates UX intent and PRD alignment.
- QA/Observability Agent: validates behavior regression and accessibility.
- Growth/Ops Agent: validates conversion CTA emphasis and partner messaging.

## Working model
1. Pull page acceptance criteria from `.cursor/epics/ui-ux-epics.md`.
2. Execute by phase from `.cursor/phases/ui-refresh-phases.md`.
3. Use page prompts from `.cursor/prompts/ui-page-prompts.md`.
4. Attach screenshot evidence for desktop + mobile views per major page.

## Mandatory checks before completion
- Core routes render without layout breakage.
- CTA buttons remain functional and discoverable.
- Keyboard nav and focus states pass manual checks.
- Color contrast passes WCAG AA for major text/actions.
- Playwright smoke tests pass for home -> marketplace -> apply paths.
