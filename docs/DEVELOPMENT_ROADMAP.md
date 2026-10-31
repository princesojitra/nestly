# Development Roadmap

1. **Environment and project setup** — repo, docs, Git remote. ✅
2. **Product and design exploration** — two visual directions with real previews, design system, screen specs, architecture/roadmap proposal. ✅ Approved: Direction A.
3. **Foundation** ✅ — RN CLI + TypeScript project, design-system tokens + Button/Card/Text/icons, React Navigation (bottom tabs + stack), Zustand + TanStack Query providers, SQLite (`@op-engineering/op-sqlite`) + Supabase client with Keychain-backed session storage, Jest/RNTL + ESLint + GitHub Actions CI. Verified booting on iOS Simulator and Android emulator.
4. **Core features**, incrementally: authentication → dashboard → inventory → asset details → warranty → maintenance → analytics → profile/settings.
5. **Offline and cloud sync** — local persistence, sync queue, retry logic, conflict handling, Supabase integration.
6. **Quality and release prep** — full test pass, iOS/Android verification, visual/accessibility/security/performance review, CI/CD, docs complete.
