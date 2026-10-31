-- Nestly — Supabase mirror schema (Milestone 5: offline-first sync).
--
-- Not yet run against a real project: as of this commit the app only has placeholder
-- Supabase credentials (.env), so this file exists but nothing has executed it, and
-- the sync push path in src/core/sync/syncEngine.ts has never been exercised against
-- a live backend. Run this in the Supabase SQL editor once a real project exists,
-- then swap .env to its URL/anon key.
--
-- Mirrors the SQLite schema in src/features/*/data/sqlite*Repository.ts, with one
-- addition: every table gets a
-- user_id column, because SQLite only ever holds one signed-in user's data locally
-- but Supabase holds everyone's, and Row Level Security is what keeps rows private.

create table if not exists assets (
  id text primary key,
  user_id uuid not null references auth.users(id) on delete cascade,
  name text not null,
  category text not null,
  purchase_date text,
  price real,
  description text,
  created_at text not null,
  updated_at text not null
);

create table if not exists warranties (
  asset_id text primary key references assets(id) on delete cascade,
  user_id uuid not null references auth.users(id) on delete cascade,
  provider text not null,
  start_date text not null,
  end_date text not null,
  created_at text not null,
  updated_at text not null
);

create table if not exists maintenance_tasks (
  id text primary key,
  user_id uuid not null references auth.users(id) on delete cascade,
  asset_id text references assets(id) on delete set null,
  title text not null,
  recurring boolean not null,
  interval_days integer,
  due_date text not null,
  cost real,
  notes text,
  created_at text not null,
  updated_at text not null
);

create table if not exists maintenance_completions (
  id text primary key,
  user_id uuid not null references auth.users(id) on delete cascade,
  task_id text not null references maintenance_tasks(id) on delete cascade,
  completed_at text not null,
  cost real,
  notes text
);

alter table assets enable row level security;
alter table warranties enable row level security;
alter table maintenance_tasks enable row level security;
alter table maintenance_completions enable row level security;

create policy "own rows only" on assets for all using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "own rows only" on warranties for all using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "own rows only" on maintenance_tasks for all using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "own rows only" on maintenance_completions for all using (auth.uid() = user_id) with check (auth.uid() = user_id);
