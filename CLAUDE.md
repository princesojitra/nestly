# CLAUDE.md

Guidance for Claude Code when working in this repository.

## Project

Nestly — a premium home management app (iOS + Android) for tracking household assets, warranties, maintenance, and home expenses. Portfolio project demonstrating production-quality mobile engineering.

## Constraints

- React Native **CLI**, not Expo. TypeScript strict mode.
- No new dependency without checking compatibility with the installed React Native version first.
- Business logic stays independent of React Native/UI — feature-first Clean Architecture (`data` / `domain` / `presentation` per feature under `src/features/`). See `docs/ARCHITECTURE.md`.
- Offline-first: local SQLite is the source of truth for reads/writes; Supabase sync runs through a queue. Never silently overwrite conflicting data.
- New UI icons: prefer the design system's icon set over ad-hoc assets.
- Design tokens (color/type/spacing/radius/shadow) live in `src/shared/theme/` — use them, don't hardcode values in screens.

## Workflow

- Work incrementally per milestone (see `docs/DEVELOPMENT_ROADMAP.md`). Don't build the whole app in one step.
- Feature branches: `feature/<area>` (e.g. `feature/dashboard`).
- Before a major change: explain the approach, flag risks, keep the diff focused.
- For any UI change: run the app, capture real screenshots (`docs/screenshots/`), inspect them, fix issues, log findings in `docs/DESIGN_REVIEW.md`. Never approve a screen from source review alone.
- Don't report tests as passing without having run them in this session.

## Git

- Commit messages: conventional commits (`feat:`, `fix:`, `chore:`, `refactor:`, `test:`, `docs:`), no ticket system for this project.
- Keep `main` stable; land features via PRs from feature branches.
