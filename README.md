# MappedFair

MappedFair is planned as a mobile-first Minnesota State Fair companion that remains useful when connectivity is weak or unavailable.

## Project status

This branch includes the first offline venue and itinerary slice: a six-place factual sample with source and observation date, local plan and notes in IndexedDB, and a production service worker that precaches the app for repeat offline visits. Browse once online before relying on offline access. This is an independent sample, not a live Fair directory. Map, route, remote sync, BLE, AI, and payments are not implemented.

## Develop

Requirements: Node.js 24 and npm 11.

```sh
npm ci
npm run dev
```

## Quality checks

```sh
npm run lint
npm test
npm run typecheck
npm run build
```

## Architecture and delivery

- [Architecture baseline](docs/architecture/BASELINE.md)
- [Phased build plan](docs/BUILD_PLAN.md)
- [ADR-001: client stack and offline boundary](docs/decisions/ADR-001-client-and-offline-boundary.md)

ADR-001 records the verified source and licensing boundary. Broader directory/map rights, seasonal refresh, installation support, and Firebase adoption remain open decisions.
