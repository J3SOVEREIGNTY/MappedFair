# ADR-001: Client stack and offline boundary

- Status: proposed
- Date: 2026-09-24
- Decision owner: Jæ³
- Evidence review: 2026-09-25; MVP scope proposed for owner review

## Context

MappedFair is intended for mobile use at a crowded event where connectivity can degrade. Prior project direction selected React, TypeScript, Vite, Tailwind, Firebase Auth/Firestore, a local-first ledger, transport-independent sync, BLE relay, and a Gemini concierge. The repository was empty apart from its title README.

## Proposed decisions

1. Use a React + TypeScript client built with Vite. Keep it in an npm workspace at apps/web.
2. Use Tailwind CSS for utility styling; defer detailed visual design until the primary attendee workflows are specified.
3. Keep core domain and application logic independent of React and provider SDKs.
4. Treat IndexedDB as the planned local persistence adapter. Keep the sync contract transport-independent.
5. Treat Firebase as a candidate remote adapter, not a domain dependency. Add it only after access rules, data ownership, and conflict behavior are accepted.
6. Precache the built app shell and bundled small venue sample for repeat offline visits. Defer BLE relay, AI provider calls, and payment integrations until their capability and failure boundaries are specified.

## MVP boundary and source disposition (2026-09-25)

- First attendee workflow: browse/search a small curated list of fixed venues, add and order stops, add short personal notes, remove stops, and recover the plan from IndexedDB after reload. The service worker precaches the shell and venue bundle after an initial online visit. User notes stay on that device; browser data removal or private mode may remove them. The app does not promise export, cross-device recovery, or background sync.
- The [Fair's map page](https://www.mnstatefair.org/maps) and [interactive map](https://www.mnstatefair.org/map/) are authoritative *references* for Fair cartography. No grant to redistribute the map artwork, tiles, interactive data, or entire venue directory was identified during this review. Do not copy those artifacts into the app, bulk ingest the directory, or imply Fair endorsement. Written permission or an explicitly licensed source is required before shipping a reproduced fairground map.
- For the first slice, manually select six factual names and street addresses from the Fair's [location addresses](https://www.mnstatefair.org/guides/accessibility/locations), with source URL, observation date, and snapshot year on each record. This is an editorial selection of facts, **not a Fair-licensed dataset**. The U.S. Copyright Office [distinguishes facts from expression](https://copyright.gov/help/faq/faq-general.html), while selection and arrangement can still receive protection. Keep selection small and independent; seek permission or an explicit license before larger data imports. Attribution and independent-app wording appear in the UI. Revalidate records before each fair season; the current website is not evidence of historical 2026 operating status.
- Fair [logo and creative-material use requires written approval](https://www.mnstatefair.org/about/logos-and-trademarks). Use an original icon, no official Fair imagery or marks. OpenStreetMap is a potential future source under [ODbL attribution and share-alike](https://www.openstreetmap.org/copyright); its [standard raster tile server prohibits offline tile prefetch](https://operations.osmfoundation.org/policies/tiles/). No OSM data or tiles are included in this slice.
- Directions, route optimization, accessible paths, real-time availability, vendor listings, authentication, group ledgers, and payments are outside this MVP. A street address is informational, not an accessibility or navigation claim.

## Consequences

- The initial app can be developed and built without Firebase credentials or external service access.
- The first single-device itinerary does not use a distributed event ledger; a sync/convergence contract remains required before cross-device features.
- The foundation checks validate structure and buildability; they do not establish runtime offline, accessibility, routing, or security readiness.
- A visual direction and tested mobile interaction flow remain future work.

## Alternatives considered

- A native app shell: deferred for the first foundation because prior product direction prioritizes a broadly accessible web companion.
- Provider SDK use throughout feature code: rejected because it couples core behavior to transport and vendor availability.
- Building BLE and AI into the first milestone: deferred due to added security, privacy, operational, and offline failure modes.

## Open decisions

- Verify installation behavior across target browsers and agree on each season's venue review owner and cadence.
- Obtain a written redistribution license or approve an explicitly licensed map source before adding rendered maps or larger directory imports.
- Confirm Firebase or choose another sync service after defining data ownership and access rules.
- Define later milestone acceptance tests for routing, accessibility, groups, and cross-device recovery.
- Decide whether the group ledger records allocations only or any external financial action.

## Ratification gate

Review this ADR and the architecture baseline before implementing persistent event schemas or vendor integrations.
