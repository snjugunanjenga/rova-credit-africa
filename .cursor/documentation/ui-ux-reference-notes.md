# UI/UX Reference Notes (Screenshot + MVP URLs)

This document captures the visual direction and interaction patterns to apply to the RovaCredit UI refresh.

## Sources reviewed
- User-provided screenshots (hero, product cards, footer, logo mark).
- MVP URL: `https://rova-credit-fintech.vercel.app/`
- Live site: `https://rovacredit.com/`

## Brand color system (reference extraction)

The following color family appears consistently in the MVP/live CSS and screenshots:

### Primary brand colors
- Deep Indigo/Navy: `#0F1720` (dark base / text contrast layer)
- Brand Purple: `#663DF2` (primary action color)
- Purple Accent: `#8C52FF` (hover, glow, emphasis)
- CTA Green: `#20C56C` (positive CTA, apply actions)
- Green Accent: `#37D98C` (secondary success accents)
- Signal Amber: `#FDB022` (highlights, warning/info badges)
- White: `#FFFFFF` (text and high-contrast UI foreground)

### Suggested semantic mapping for this codebase
- `--primary`: `#663DF2`
- `--primary-glow`: `#8C52FF`
- `--success`: `#20C56C`
- `--success-foreground`: `#FFFFFF`
- `--warning`: `#FDB022`
- `--sidebar`: `#1B2030` (or `#0F1720` depending on contrast target)
- `--background`: `#F7F8FC`
- `--foreground`: `#0F1720`

## Visual language notes from screenshot and MVP

1. **Hero area**
   - Strong purple gradient backdrop with soft radial lighting.
   - Left side: high-impact headline and short value proposition.
   - Right side: interactive calculator card with elevated glass effect.
   - Primary CTA uses bright green for high conversion contrast.

2. **Product cards**
   - Clean white cards over light neutral background.
   - Financing breakdown appears directly below asset price.
   - CTA button shape is rounded-pill and uses purple family.
   - Specs represented as compact pills/chips.

3. **Footer**
   - Multi-column layout:
     - Brand and mission text
     - Quick links
     - Support links
     - Contact details
   - Utility row for trust badges (0% APR, secure payments, shipping, warranty).
   - Final row with legal links and copyright.

4. **Floating quick actions**
   - Sticky/floating action in bottom-right (scroll-to-top style).
   - WhatsApp support remains prominent and persistent.

5. **Typography and spacing**
   - Bold display typography for hero and section headings.
   - Generous vertical spacing between sections.
   - Rounded corners and soft shadows; no harsh borders.

## Logo notes (Rova_credit_logo)

Current UI still uses an icon placeholder in header. Replace with company logo system:

### Required assets
- `src/assets/brand/rova-credit-logo.svg` (full lockup: icon + wordmark)
- `src/assets/brand/rova-credit-mark.svg` (icon only for compact contexts)
- Optional raster fallback:
  - `src/assets/brand/rova-credit-logo.png`
  - `src/assets/brand/rova-credit-mark.png`

### Placement rules
- Header (desktop): full lockup.
- Header (mobile): icon mark + short wordmark or icon-only at small widths.
- Footer: full lockup with reduced opacity-safe contrast.
- Browser icon: use brand mark for favicon/app icon.

## Page context notes for this repository

Based on current route structure:
- `/` Home: strongest visual upgrade target (hero, calculator block, featured devices, social proof).
- `/marketplace`: filter bar + cards should match screenshot card language.
- `/marketplace/$id`: strengthen product detail hierarchy and financing CTA.
- `/partners`: keep multi-step form, improve clarity and mobile spacing.
- `/about`: align narrative blocks with cleaner premium visual rhythm.
- `/contact`: increase trust signals and simplify contact form hierarchy.
- `/legal/*`: keep readable, minimize visual noise, ensure accessibility contrast.
- `/admin/*`: separate visual identity from marketing site but keep brand consistency.

## UX constraints and accessibility
- Keep CTA contrast at WCAG AA minimum (text-to-background).
- Preserve keyboard navigation in filters, forms, and modals.
- Maintain touch-friendly controls (44px minimum interactive targets).
- Avoid visual-only status indicators; add text labels for state.
