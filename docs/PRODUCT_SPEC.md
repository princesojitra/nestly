# Product Spec

## Product

Nestly: premium home management app (iOS + Android). Design direction: premium minimal, Apple-inspired, elegant, functional.

## Feature modules

1. Onboarding and authentication
2. Home dashboard
3. Home inventory
4. Add and edit assets
5. Asset details
6. Warranty management
7. Maintenance calendar
8. Maintenance details
9. Home expense analytics
10. Profile and settings

### Dashboard

At a glance: total registered assets, active warranties, upcoming warranty expirations, upcoming maintenance, recent activities, monthly home expenses.

### Inventory

Add/edit/delete assets; organize by category; store purchase date and price; attach images and descriptions; view asset details.

### Warranty management

Start/expiry dates, duration, document attachments, expiry reminders, status.

### Maintenance

Schedules (including recurring), upcoming vs. completed tasks, history, cost tracking.

### Expense analytics

Monthly expenses, expense categories, maintenance costs, purchase history, visual summaries.

Use realistic sample data during UI development, kept separate from production data sources.

## Non-functional requirements

- **Offline-first**: full read/write without network; sync queue to Supabase with retry, conflict detection, no silent overwrites.
- **Security**: Keychain/Keystore for tokens, Supabase Row Level Security, input validation, no secrets in Git or logs.
- **Performance**: fast startup, smooth navigation, efficient list rendering (FlatList or equivalent), controlled re-renders, efficient offline sync.
- **Accessibility**: accessible contrast, touch targets, consistent interaction patterns.
