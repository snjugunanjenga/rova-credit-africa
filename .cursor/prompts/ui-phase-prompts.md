# Laser-Focused Prompts for UI Phases

## U0 Prompt (Brand Baseline)
"Use `.cursor/documentation/ui-ux-reference-notes.md` and implement only Phase U0 from `.cursor/phases/ui-refresh-phases.md`. Define and apply color tokens, spacing scale, and typography primitives in shared styles. Do not change route content yet. Return token diff and contrast notes."

## U1 Prompt (Layout + Navigation)
"Execute Phase U1 from `.cursor/phases/ui-refresh-phases.md`: update SiteShell, Header, Footer, and shared CTA/card primitives. Integrate `rova-credit-logo` assets in header/footer and ensure mobile navigation quality. Return changed files and screenshots for desktop/mobile header/footer."

## U2 Prompt (Public Pages)
"Execute Phase U2 from `.cursor/phases/ui-refresh-phases.md` on `/`, `/marketplace`, `/marketplace/$id`, `/partners`, `/about`, and `/contact`. Apply the approved purple-green palette and premium card language while preserving existing business logic and form behavior. Return per-page before/after notes and regression risks."

## U3 Prompt (Legal + Admin)
"Execute Phase U3 from `.cursor/phases/ui-refresh-phases.md` by aligning `/legal/*` and `/admin/*` with updated brand primitives without harming readability or operational usability. Keep legal content calm and admin surfaces workflow-first. Return accessibility notes and component changes."

## U4 Prompt (QA + Launch)
"Execute Phase U4 from `.cursor/phases/ui-refresh-phases.md`: run Playwright checks, validate CTA journeys, perform accessibility checks (focus, contrast, keyboard), and produce a launch readiness checklist with unresolved issues list."
