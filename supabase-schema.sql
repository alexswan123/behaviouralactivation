-- Run this in your Supabase SQL editor

-- Anonymous sessions (no login required)
create table if not exists user_sessions (
  id uuid primary key,           -- stored in localStorage
  created_at timestamptz default now()
);

-- A 10-day programme instance
create table if not exists schedules (
  id uuid primary key default gen_random_uuid(),
  session_id uuid references user_sessions(id) on delete cascade,
  start_date date not null,
  created_at timestamptz default now()
);

-- One or more activities per day
create table if not exists scheduled_activities (
  id uuid primary key default gen_random_uuid(),
  schedule_id uuid references schedules(id) on delete cascade,
  day_number int not null,              -- 1–10
  scheduled_date date not null,
  scheduled_time time not null,
  activity_name text not null,
  catalogue_id text,                    -- optional: links to activities.ts id
  category text,                        -- 'pleasure' | 'social' | 'achievement' | 'body'
  -- Pre-activity expected scores
  pre_achievement int check (pre_achievement between 0 and 10),
  pre_connection  int check (pre_connection  between 0 and 10),
  pre_enjoyment   int check (pre_enjoyment   between 0 and 10),
  -- Post-activity actual scores
  post_achievement int check (post_achievement between 0 and 10),
  post_connection  int check (post_connection  between 0 and 10),
  post_enjoyment   int check (post_enjoyment   between 0 and 10),
  completed boolean default false,
  notes text,
  created_at timestamptz default now()
);

-- Row Level Security
alter table user_sessions enable row level security;
alter table schedules enable row level security;
alter table scheduled_activities enable row level security;

-- RLS Policies

-- user_sessions: anyone can insert/select their own session
create policy "Users can insert their own session"
  on user_sessions for insert
  with check (true);

create policy "Users can read their own session"
  on user_sessions for select
  using (true);

-- schedules: scoped to session_id
create policy "Users can manage their own schedules"
  on schedules for all
  using (true)
  with check (true);

-- scheduled_activities: accessible via schedule join
create policy "Users can manage their own activities"
  on scheduled_activities for all
  using (true)
  with check (true);
