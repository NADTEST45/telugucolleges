-- 006_data_reports.sql
-- Public "report incorrect data" submissions from college pages.
-- Written ONLY via the service-role client in /api/report (server-side);
-- RLS is enabled with no policies so the anon key can neither read nor
-- write this table directly.

create table if not exists public.data_reports (
  id uuid primary key default gen_random_uuid(),
  college_code text not null,
  college_name text not null,
  field_label text,                          -- which data point looks wrong (free label, e.g. "B.Tech fee")
  message text not null,                     -- what's wrong / what it should be
  reporter_email text,                       -- optional, for follow-up
  page_url text,                             -- page the report came from
  status text not null default 'new'
    check (status in ('new', 'reviewed', 'fixed', 'dismissed')),
  created_at timestamptz not null default now()
);

comment on table public.data_reports is
  'Anonymous data-accuracy reports submitted from public college pages via /api/report. Service-role access only.';

-- Service-role only: enable RLS, define no policies.
alter table public.data_reports enable row level security;

-- Admin triage queries
create index if not exists data_reports_status_created_idx
  on public.data_reports (status, created_at desc);
create index if not exists data_reports_college_code_idx
  on public.data_reports (college_code);
