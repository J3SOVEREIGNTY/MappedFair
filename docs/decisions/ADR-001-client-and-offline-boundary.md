# ADR-001: Client stack and offline boundary

- Status: proposed
- Date: 2026-09-24
- Decision owner: Jæ³

## Context

MappedFair is intended for mobile use at a crowded event where connectivity can degrade. Prior project direction selected React, TypeScript, Vite, Tailwind, Firebase Auth/Firestore, a local-first ledger, transport-independent sync, BLE relay, and a Gemini concierge. The repository was empty apart from its title README.

## Proposed decisions

1. Use a React + TypeScript client built with Vite. Keep it in an npm workspace at apps/web.
2. Use Tailwind CSS for utility styling; defer detailed visual design until the primary attendee workflows are specified.
3. Keep core domain and application logic independent of React and provider SDKs.
4. Treat IndexedDB as the planned local persistence adapter. Keep the sync contract transport-independent.
5. Treat Firebase as a candidate remote adapter, not a domain dependency. Add it only after access rules, data ownership, and conflict behavior are accepted.
6. Defer PWA caching, BLE relay, AI provider calls, and payment integrations until their capability and failure boundaries are specified.

## Consequences

- The initial app can be developed and built without Firebase credentials or external service access.
- Offline-first behavior requires explicit local event and convergence contracts before it is coded.
- The foundation checks validate structure and buildability; they do not establish runtime offline, accessibility, routing, or security readiness.
- A visual direction and tested mobile interaction flow remain future work.

## Alternatives considered

- A native app shell: deferred for the first foundation because prior product direction prioritizes a broadly accessible web companion.
- Provider SDK use throughout feature code: rejected because it couples core behavior to transport and vendor availability.
- Building BLE and AI into the first milestone: deferred due to added security, privacy, operational, and offline failure modes.

## Open decisions

- Confirm PWA installation and cache strategy.
- Select authoritative map and fair-data sources, license terms, and update cadence.
- Confirm Firebase or choose another sync service after defining data ownership and access rules.
- Define MVP and acceptance tests for routing, accessibility, groups, and local recovery.
- Decide whether the group ledger records allocations only or any external financial action.

## Ratification gate

Review this ADR and the architecture baseline before implementing persistent event schemas or vendor integrations.
