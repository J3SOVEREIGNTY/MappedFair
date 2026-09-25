# MappedFair

MappedFair is planned as a mobile-first Minnesota State Fair companion that remains useful when connectivity is weak or unavailable.

## Project status

The repository is at its foundation stage. The current app is a minimal React/Vite shell; product workflows, venue data, remote sync, BLE, AI, and payment behavior are not implemented.

## Develop

Requirements: Node.js 24 and npm 11.

```sh
npm ci
npm run dev
```

## Quality checks

```sh
npm run lint
npm run typecheck
npm run build
```

## Architecture and delivery

- [Architecture baseline](docs/architecture/BASELINE.md)
- [Phased build plan](docs/BUILD_PLAN.md)
- [ADR-001: client stack and offline boundary](docs/decisions/ADR-001-client-and-offline-boundary.md)

The architecture and product scope are proposals for review. Data sources, licensing, map provider, MVP limits, and Firebase adoption remain open decisions.
