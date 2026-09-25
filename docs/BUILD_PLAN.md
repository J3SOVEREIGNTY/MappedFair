# MappedFair build plan v0.1.0

Status: MVP scope and data-source disposition reviewed 2026-09-25; owner ratification pending.

## Phase 0 — Scope and data authority

- Select MVP workflows and explicit non-goals.
- Identify official or licensed venue/map sources and their update owner.
- Define freshness display, accessibility constraints, route confidence, privacy rules, and group-ledger semantics.
- Ratify ADR-001 and the synchronization contract questions.

**Exit:** accepted product scope, sourced dataset plan, privacy model, and acceptance criteria.

## Phase 1 — Foundation

- React + TypeScript + Vite npm workspace, Tailwind plugin, and clean app composition shell.
- Feature/domain/application/infrastructure boundaries documented in code.
- CI performs dependency install, lint, an accessible app-shell smoke test, typecheck, and production build.
- Add domain and integration behavior tests with each feature slice; avoid tests that only mirror implementation details.

**Exit:** clean install and all CI checks pass from a fresh checkout; no provider credentials required.

## Phase 2 — Offline data and itinerary slice

- Introduce a small, independently curated factual venue sample with provenance and observation date. Require explicit licensing or permission for wider imports.
- Define local entity schemas and IndexedDB adapter behind ports.
- Implement venue browsing plus itinerary and notes with local persistence.
- Precache the shell and bundled sample for repeat offline visits; test persistence, reload recovery, offline reload, empty/error states. Export/import is a separate decision.

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

1. Review and ratify the bounded MVP and the map/directory licensing gate in ADR-001.
2. Merge the foundation PR after checks and human review; review the stacked offline venue/itinerary PR against it.
3. Assign a seasonal data verification owner before using this sample for an event.
4. Decide future map licensing, accessibility and routing evidence, export, and any group/sync contract in separate milestones.
