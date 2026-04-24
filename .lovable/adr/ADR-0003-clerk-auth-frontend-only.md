# ADR-0003: Clerk auth — frontend SDK only; backend verifies JWT via JWKS

- **Status:** Accepted
- **Date:** 2026-04-24

## Context
Clerk provides a polished auth UX (email/phone OTP, social, MFA) but its server SDK for some frameworks (notably TanStack Start under Lovable's preview proxy) has known incompatibilities, redirecting to `localhost` rather than the proxied host.

## Decision
- Use **`@clerk/react` (frontend SDK only)** in the SPA.
- The FastAPI backend does **not** use any Clerk server SDK. It validates the Clerk-issued JWT independently using Clerk's public **JWKS** endpoint (cached, 5-min TTL).
- All RBAC decisions are made server-side from the verified `sub` against our own `user_roles` table.

## Rationale
- Eliminates platform-specific SSR breakage.
- Decouples our backend from a vendor SDK; if we ever migrate auth providers, only JWT verification logic changes.
- Roles in our DB (not in Clerk metadata) keep RBAC under our compliance and audit control.

## Consequences
- We own the Clerk webhook handler that mirrors `user.created/updated/deleted` into `profiles`.
- We must monitor JWKS rotation and cache invalidation.
- MFA enforcement for admins is configured in the Clerk dashboard, not in code.
