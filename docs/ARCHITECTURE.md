# Architecture

Feature-first Clean Architecture, as outlined in the master spec:

```
src/
├── app/            # navigation root, providers (theme, query client, auth), env config
├── core/           # database (SQLite), network client, secure storage, error types, utilities
├── shared/         # design-system components, hooks, theme tokens, shared types
└── features/
    ├── authentication/
    ├── dashboard/
    ├── inventory/
    ├── warranty/
    ├── maintenance/
    ├── analytics/
    └── profile/
```

Each feature: `data/` (SQLite + Supabase data sources, repository implementations), `domain/` (models, repository interfaces, use cases), `presentation/` (screens, hooks/view-models, feature-local components).

## Rules

- UI never imports `core/database` or `core/network` directly — only through a feature's repository interface (`domain/`). This is what makes the offline-sync layer swappable and testable.
- Zustand for local/UI state; TanStack Query for anything that is fundamentally server/cache state (keeps the two concerns from blurring).
- A repository method returns domain models, never raw SQLite rows or Supabase response shapes — mapping happens in `data/`.
- No feature imports another feature's internals; cross-feature needs go through `shared/` or a domain-level event/interface.

## Offline-first data flow

```
UI → repository (domain interface)
        ↓ read/write
   SQLite (source of truth)
        ↓ enqueue on write
   sync queue (core/database) → Supabase, with retry + backoff
        ↑ conflict?
   surfaced to the feature (never auto-overwritten)
```

Reads always come from SQLite — the UI never waits on a network round-trip to show data. Writes land in SQLite immediately (optimistic) and are queued for sync; a failed sync retries with backoff; a detected conflict (local + remote both changed since last sync) is surfaced to the user/feature rather than silently resolved.

## Why this now, not more

No DI framework, no GraphQL layer, no multi-module build split — none of that is justified at this scope. The repository-interface boundary is the one abstraction that earns its keep here, because it's what makes "swap SQLite/Supabase for a test double" and "add conflict handling later" both possible without touching UI code.
