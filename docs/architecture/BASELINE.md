# MappedFair architecture baseline v0.1.0

Status: proposed foundation for review.

## Product intent

MappedFair is a mobile-first Minnesota State Fair attendee companion. The durable product constraint is useful operation when cellular service is weak or absent. Accessibility-aware routing, itinerary, group coordination, and venue information are candidate core capabilities. BLE relay and an AI concierge are optional later capabilities.

No venue data, route graph, map provider, or user workflow is assumed to be verified by this document.

## Repository shape

apps/web/src contains app composition, features, domain rules, application use cases and ports, infrastructure adapters, and shared client utilities. Planned future workspace packages are packages/contracts for versioned schemas and packages/fair-data for sourced, licensed, dated venue data. Documentation lives in docs/architecture and docs/decisions.

Checked-in feature folders are organizational boundaries, not promises that every candidate feature belongs in the first release.

## Dependency rules

1. UI invokes application use cases.
2. Application use cases depend on domain rules and declared ports.
3. Domain code has no browser, framework, network, storage, or vendor dependencies.
4. Infrastructure adapters implement ports and translate external formats at the boundary.
5. Fair-data records carry source, reuse basis, snapshot version, and observation date. Routing or safety-relevant displays additionally require validated data and appropriate rights for that use; the first factual sample cannot support such claims.

## Offline and synchronization boundary

The client owns local read and write availability. Future local records should use IndexedDB behind an application port. Transport must be replaceable without changing domain rules.

The prior MF-SYNC-001 direction calls for a versioned event envelope, hybrid logical clock metadata, idempotent application, and deterministic reduction. Before implementing it, decide event identity, actor/device identity, schema evolution, deletion/tombstone behavior, conflict policy, clock skew bounds, export/import format, and recovery behavior.

Do not treat a device timestamp or transport arrival order as authoritative. Duplicate delivery must not duplicate effects. A sync adapter must report pending, accepted, rejected, and conflict outcomes distinctly.

## Privacy and capability boundaries

- Do not put provider secrets in browser code.
- Keep user notes and group data local by default until retention and sync rules are decided.
- No PHI is needed for the fair-attendee use case.
- No real payments in the initial release; a group ledger may record user-entered allocations only after semantics are approved.
- AI requests, if approved later, must be consented, minimized, server-mediated, and non-blocking for core offline workflows.
- BLE relay, if approved later, must have a threat model, consent model, expiry policy, abuse limits, and tests for untrusted peers.

## Observability and failure behavior

Surface data freshness and degraded-mode state. Users must be able to distinguish locally saved data from data that has synchronized. Feature behavior should fail locally and informatively when external providers are unavailable.

## Non-goals for the foundation

No production venue dataset, map SDK, route computation, authentication flow, cloud synchronization, BLE networking, AI calls, payment processing, or deployment pipeline is included here.
