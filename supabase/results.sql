-- NBS online results: database setup for Supabase.
-- Run in Supabase: SQL Editor > New query > paste everything > Run.
-- Safe to run again: it only adds what is missing and updates the lookup function.
--
-- Who can do what:
--   * Only accounts listed in public.registrars (the Deputy Registrar) can upload, publish or delete results.
--   * Students see only PUBLISHED results, by Student ID.

create table if not exists public.registrars (
  user_id uuid primary key references auth.users on delete cascade,
  created_at timestamptz not null default now()
);

create table if not exists public.result_sheets (
  id uuid primary key default gen_random_uuid(),
  title text not null,                 -- program, e.g. "BS-Commerce"
  session text not null,               -- e.g. "2024-2028"
  columns jsonb not null default '[]', -- sheet layout: subjects (code, name, credit hours) and summary columns
  published boolean not null default false,
  published_at timestamptz,
  created_by uuid default auth.uid() references auth.users on delete set null,
  created_at timestamptz not null default now()
);
alter table public.result_sheets add column if not exists semester text;      -- e.g. "IV"
alter table public.result_sheets add column if not exists declared_on date;   -- result declaration date

create table if not exists public.results (
  sheet_id uuid not null references public.result_sheets on delete cascade,
  roll_no text not null,               -- Student ID
  data jsonb not null,                 -- { name, marks: { CODE: [marks, gpt, grade] }, summary: { "CGPA 4th": "3.99", ... } }
  primary key (sheet_id, roll_no)
);
-- Earlier versions asked for a CNIC; it is no longer used.
alter table public.results drop column if exists cnic_last4;
drop table if exists public.result_lookup_failures;
drop function if exists public.student_results(text, text);
-- Remove test sheets saved in the earlier (simple) format.
delete from public.result_sheets where jsonb_typeof(columns) <> 'object';

create index if not exists results_roll on public.results (lower(replace(roll_no, ' ', '')));

alter table public.registrars enable row level security;
alter table public.result_sheets enable row level security;
alter table public.results enable row level security;

create or replace function public.is_registrar()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (select 1 from public.registrars where user_id = auth.uid());
$$;

drop policy if exists "users see own registrar row" on public.registrars;
create policy "users see own registrar row" on public.registrars
  for select to authenticated using (user_id = auth.uid());

drop policy if exists "registrars manage sheets" on public.result_sheets;
create policy "registrars manage sheets" on public.result_sheets
  for all to authenticated using (public.is_registrar()) with check (public.is_registrar());

drop policy if exists "registrars manage results" on public.results;
create policy "registrars manage results" on public.results
  for all to authenticated using (public.is_registrar()) with check (public.is_registrar());

-- Every result gets a random 12-character code. It is printed with a QR code on the student's result
-- card, so anyone can open /verify/<code> on this website and check the result is genuine.
alter table public.results
  add column if not exists verify_code text not null default substr(replace(gen_random_uuid()::text, '-', ''), 1, 12);
create unique index if not exists results_verify_code on public.results (verify_code);

-- Student lookup by Student ID (spaces and capitals ignored). Only published sheets are returned.
drop function if exists public.student_results(text);
create function public.student_results(p_roll text)
returns table (roll_no text, title text, session text, semester text, declared_on date, published_at timestamptz, layout jsonb, data jsonb, verify_code text)
language sql
stable
security definer
set search_path = public
as $$
  select r.roll_no, s.title, s.session, s.semester, s.declared_on, s.published_at, s.columns, r.data, r.verify_code
  from public.results r
  join public.result_sheets s on s.id = r.sheet_id
  where s.published
    and length(trim(p_roll)) >= 5
    and lower(replace(r.roll_no, ' ', '')) = lower(replace(p_roll, ' ', ''))
  order by s.declared_on desc nulls last, s.published_at desc;
$$;

-- Verification by the code on a printed result card. Only published results can be verified.
create or replace function public.verify_result(p_code text)
returns table (roll_no text, title text, session text, semester text, declared_on date, published_at timestamptz, layout jsonb, data jsonb, verify_code text)
language sql
stable
security definer
set search_path = public
as $$
  select r.roll_no, s.title, s.session, s.semester, s.declared_on, s.published_at, s.columns, r.data, r.verify_code
  from public.results r
  join public.result_sheets s on s.id = r.sheet_id
  where s.published and r.verify_code = lower(trim(p_code));
$$;

revoke all on function public.student_results(text) from public;
grant execute on function public.student_results(text) to anon, authenticated;
revoke all on function public.verify_result(text) from public;
grant execute on function public.verify_result(text) to anon, authenticated;
revoke all on function public.is_registrar() from public;
grant execute on function public.is_registrar() to authenticated;

-- ─────────────────────────────────────────────────────────────────────────────
-- To let someone upload results, create their user in Authentication > Users, then run (with their email):
--
--    insert into public.registrars (user_id) select id from auth.users where email = 'deputy.registrar@example.com';
