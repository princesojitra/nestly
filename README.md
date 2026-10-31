# Nestly

A premium home management application that helps users organize household assets, track warranties, manage maintenance, and understand home-related expenses. Built for iOS and Android.

## Status

Foundation (Milestone 3) is in place: RN CLI + TypeScript project, design-system tokens, navigation, state management, and database/backend adapters. Verified booting on both iOS Simulator and an Android emulator. No features yet — see [`docs/DEVELOPMENT_ROADMAP.md`](docs/DEVELOPMENT_ROADMAP.md) for what's next.

## Stack

React Native CLI (no Expo) + TypeScript, React Navigation, Zustand, TanStack Query, SQLite, Supabase, Reanimated, Gesture Handler, React Hook Form + Zod, Jest + React Native Testing Library.

## Documentation

- [`docs/PRODUCT_SPEC.md`](docs/PRODUCT_SPEC.md) — features and product requirements
- [`docs/ARCHITECTURE.md`](docs/ARCHITECTURE.md) — project structure and architecture rules
- [`docs/DESIGN_SYSTEM.md`](docs/DESIGN_SYSTEM.md) — design tokens and components
- [`docs/SCREEN_SPECIFICATIONS.md`](docs/SCREEN_SPECIFICATIONS.md) — per-screen specs
- [`docs/DEVELOPMENT_ROADMAP.md`](docs/DEVELOPMENT_ROADMAP.md) — milestones
- [`docs/DESIGN_REVIEW.md`](docs/DESIGN_REVIEW.md) — visual QA log and screenshots
- [`CLAUDE.md`](CLAUDE.md) — conventions for working on this repo with Claude Code

## Getting started

```bash
npm install
cp .env.example .env   # fill in your Supabase project URL/key
bundle install && cd ios && bundle exec pod install && cd ..

npm start              # Metro bundler
npm run ios            # or: npm run android
```

```bash
npx tsc --noEmit        # type check
npx eslint .            # lint
npx jest                # unit tests
```
