# MappedFair build plan v0.1.0

Status: proposed and staged for review.

## Phase 0 — Scope and data authority

- Select MVP workflows and explicit non-goals.
- Identify official or licensed venue/map sources and their update owner.
- Define freshness display, accessibility constraints, route confidence, privacy rules, and group-ledger semantics.
- Ratify ADR-001 and the synchronization contract questions.

**Exit:** accepted product scope, sourced dataset plan, privacy model, and acceptance criteria.

## Phase 1 — Foundation

- React + TypeScript + Vite npm workspace, Tailwind plugin, and clean app composition shell.
- Feature/domain/application/infrastructure boundaries documented in code.
- CI performs dependency install, lint, typecheck, and production build.
- Add behavioral tests with each first domain slice; avoid tests that only mirror scaffolding.

**Exit:** clean install and all CI checks pass from a fresh checkout; no provider credentials required.

## Phase 2 — Offline data and itinerary slice

- Introduce a small, licensed venue dataset with provenance and freshness metadata.
- Define local entity schemas and IndexedDB adapter behind ports.
- Implement venue browsing plus itinerary and notes with local persistence.
- Test persistence, reload recovery, empty/error states, and export/import if accepted.

**Exit:** user can complete the defined itinerary flow offline and recover locally saved state.

## Phase 3 — Accessibility and navigation

- Define supported mobility/accessibility preferences and route constraints.
- Validate routing inputs and provenance before displaying accessible route claims.
- Implement map/list alternatives and readable degraded-data behavior.

**Exit:** acceptance tests cover route constraints, missing data, staleness, and no-route outcomes.

## Phase 4 — Group coordination

- Ratify roles, invitation, event ownership, and ledger semantics.
- Implement idempotent group events and conflict presentation.
- Keep payment execution outside the initial product.

**Exit:** replay and duplicate-delivery tests prove the same event set produces the same state.

## Phase 5 — Remote synchronization

- Select Firebase or an alternative after data ownership and access rules are decided.
- Add auth and least-privilege rules, transport adapter, retries, and sync receipts.
- Exercise offline/online convergence, revocation, and partial failure.

**Exit:** independent security review and contract tests pass; core local workflows still work when remote services fail.

## Phase 6 — Optional capabilities

BLE relay and AI concierge remain separate gated projects. Each requires a threat model, privacy/consent design, cost and abuse limits, degraded-mode behavior, and independent acceptance tests before implementation.

## Current sequence

1. Review this plan and ADR-001.
2. Ratify data source, privacy, accessibility, and MVP decisions.
3. Merge the foundation PR after checks and human review.
4. Open a narrowly scoped Phase 2 issue with data and offline acceptance criteria.
