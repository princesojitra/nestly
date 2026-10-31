# Development Roadmap

1. **Environment and project setup** — repo, docs, Git remote. ✅
2. **Product and design exploration** — two visual directions with real previews, design system, screen specs, architecture/roadmap proposal. ✅ Approved: Direction A.
3. **Foundation** ✅ — RN CLI + TypeScript project, design-system tokens + Button/Card/Text/icons, React Navigation (bottom tabs + stack), Zustand + TanStack Query providers, SQLite (`@op-engineering/op-sqlite`) + Supabase client with Keychain-backed session storage, Jest/RNTL + ESLint + GitHub Actions CI. Verified booting on iOS Simulator and Android emulator.
4. **Core features**, incrementally:
   - **Authentication** ✅ — Supabase Auth (email/password), Welcome/SignIn/SignUp screens (React Hook Form + Zod), session-gated root navigator, sign-out from Profile. Verified on iOS Simulator: validation, successful-path wiring, and graceful network-error handling (tested against placeholder Supabase credentials — a real project's URL/key are needed before this actually authenticates). OAuth and "forgot password" are explicitly deferred, not built.
   - **Dashboard** ✅ — real greeting from the signed-in user, spec'd empty state (no stats mocked — Inventory/Warranty/Maintenance have no data layer yet), CTA navigates to Inventory.
   - **Inventory (incl. asset details)** ✅ — SQLite-backed list/add/edit/detail (search, category filters, empty/error/loading states). First real persistence; found and fixed a real touch-handling bug via simulator testing (see commit).
   - **Warranty** ✅ — scoped as one warranty per asset (no dedicated tab in the approved design), status card on Asset Detail, SQLite with `ON DELETE CASCADE` from assets. Verified via unit tests; live simulator click-through was blocked by input flakiness in a very long-running simulator session (see commit) rather than a known app issue.
   - **Maintenance** ✅ — scheduled tasks (optional asset link), one-time/recurring with a completion history table, due-date math. Status card patterns match Inventory/Warranty.
   - **Analytics** ✅ — read-only derived views (monthly trend, category breakdown, purchase-vs-maintenance split) over existing asset/maintenance data; no new tables or charting dependency.
   - **Profile/settings** ✅ (minimal) — real signed-in email, sign-out. Notification preferences, data export, sync status, and dark theme are explicitly deferred: each needs infrastructure (push notifications, Supabase sync, theming) this app doesn't have yet, so no fake toggles were built for them.
5. **Offline and cloud sync** — local persistence, sync queue, retry logic, conflict handling, Supabase integration. Not started.
6. **Quality and release prep** — full test pass, iOS/Android verification, visual/accessibility/security/performance review, CI/CD, docs complete. Not started.
