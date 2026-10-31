# Screen Specifications

Visual references for the three previewed screens: `docs/DESIGN_REVIEW.md`. Specs below cover all ten modules at the depth needed to start Milestone 3; detail deepens per-feature as each is implemented (Milestone 4).

## Dashboard

Stat tiles (assets tracked, active warranties, tasks due soon), monthly-expense card with a 6-month bar trend, "Upcoming" list (next warranty expiry, next maintenance), "Recent activity" feed. Empty state (no assets yet): single CTA "Add your first asset" replaces the stat/upcoming sections.

## Home inventory

Search, category filter chips, 2-column asset grid (image, name, category, price). Empty state per category ("No appliances yet"). Error state: inline retry banner, cached data still shown if present (offline-first).

## Add / edit asset

Form: name, category (picker), purchase date, price, description, photos (camera/library), optional warranty fields inline. React Hook Form + Zod validation; required: name, category.

## Asset details

Hero image, category badge, purchase date/price, warranty status card (progress bar + expiry), maintenance history list, document attachments, Edit / Log-maintenance actions.

## Warranty management

List grouped by status (active / expiring soon / expired), each row: asset, provider, expiry, days remaining. Detail: dates, duration, document, reminder settings.

## Maintenance calendar

Month view with task-dot markers; list view toggle. Recurring-task indicator. Tapping a date/task opens Maintenance details.

## Maintenance details

Task name, asset link, schedule (one-off/recurring + interval), cost, notes, completion toggle, history of past completions for recurring tasks.

## Home expense analytics

Monthly total, category breakdown (bar or donut), maintenance-cost vs. purchase-cost split, trend over time, date-range filter.

## Onboarding & authentication

Welcome → sign up / log in (email + OAuth via Supabase Auth) → optional "add your first asset" nudge. Session persisted via Keychain/Keystore.

## Profile & settings

Account info, notification preferences (warranty/maintenance reminders), data export, sync status, theme (future: dark mode), sign out.

## Shared states

Every list screen needs: loading (skeleton, not spinner-only), empty (specific CTA, not generic "No data"), error (retry, keep stale cached data visible), and a populated state. Touch targets ≥44pt; all interactive elements get accessible labels.
