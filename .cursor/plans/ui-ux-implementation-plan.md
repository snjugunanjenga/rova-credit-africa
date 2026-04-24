# UI/UX Implementation Plan (Rova Credit Africa)

## Goal
Upgrade the product UI to match the approved Rova visual direction from screenshot + MVP references, while preserving conversion performance, accessibility, and mobile-first behavior.

## Inputs
- `.cursor/documentation/ui-ux-reference-notes.md`
- `docs/PRD.md`, `docs/Plan.md`, `docs/workflow.md`
- Existing routes in `src/routes/*`

## Design system update scope
1. Introduce/normalize brand tokens to the purple-green-amber palette.
2. Replace header/footer identity placeholders with official logo assets.
3. Standardize CTA hierarchy and card language across public pages.
4. Align component states (hover/focus/disabled/loading/error) to one visual spec.

## Token strategy (v1)
- Primary: `#663DF2`
- Primary hover/glow: `#8C52FF`
- Success CTA: `#20C56C`
- Success accent: `#37D98C`
- Warning/highlight: `#FDB022`
- Dark base: `#0F1720`
- Light base: `#F7F8FC`

## Route-by-route implementation

### 1) Home (`/`)
- Rebuild hero to match premium gradient and high-contrast CTA pattern.
- Add/upgrade finance calculator card treatment.
- Re-style product preview cards to match marketplace cards.
- Refine section flow: trust badges, steps, partner network, testimonials, FAQ CTA.

### 2) Marketplace (`/marketplace`)
- Improve sticky filter bar with mobile-first controls.
- Normalize product card spacing, chip styles, and CTA buttons.
- Add visual hierarchy for pricing + repayment details.

### 3) Product detail (`/marketplace/$id`)
- Increase readability of financing block and CTAs.
- Improve media container and detail accordion spacing.
- Improve recommendation row visual continuity.

### 4) Partners (`/partners`)
- Keep current multi-step flow but improve progress indicator clarity.
- Improve form typography, step spacing, and touch targets.
- Add stronger trust/context blocks before agreement signing.

### 5) About (`/about`)
- Rework storytelling rhythm to match premium marketing style.
- Harmonize leadership and partner cards with updated component tokens.

### 6) Contact (`/contact`)
- Increase trust context (response time, channels, office clarity).
- Improve form scannability and validation state appearance.

### 7) Legal (`/legal/*`)
- Preserve high readability and low visual distraction.
- Ensure consistent legal nav hierarchy and accessible contrast.

### 8) Admin (`/admin/*`)
- Keep separate operational style but align key brand primitives (logo, accents, state colors).
- Avoid marketing-heavy visuals in admin workflow surfaces.

## Logo implementation plan

## Required asset intake
- `src/assets/brand/rova-credit-logo.svg` (full lockup)
- `src/assets/brand/rova-credit-mark.svg` (icon)

## Integration points
- `src/components/site/Header.tsx`
- `src/components/site/Footer.tsx`
- `src/routes/__root.tsx` (favicon metadata if set there)

## Behavior
- Desktop header: full lockup.
- Mobile header: icon mark + compact wordmark.
- Footer: full lockup with dark-background contrast-safe variant.

## Execution phases
- Follow `.cursor/phases/ui-refresh-phases.md`.
- Execute stories from `.cursor/epics/ui-ux-epics.md`.
- Use prompts from `.cursor/prompts/ui-phase-prompts.md` and `.cursor/prompts/ui-page-prompts.md`.

## Testing and quality gates
- Visual regression: key pages at mobile + desktop breakpoints.
- Playwright E2E: primary CTA paths remain functional.
- Accessibility checks: heading order, color contrast, focus states, keyboard nav.
- Performance checks: no major LCP regression on home/marketplace.
