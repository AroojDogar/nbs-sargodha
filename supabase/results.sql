-- NBS online results: database setup for Supabase.
-- Run once in Supabase: SQL Editor > New query > paste everything > Run.
-- (schema.sql for attendance should already have been run; this file is separate.)
--
-- Who can do what:
--   * Only accounts listed in public.registrars (the Deputy Registrar) can upload, publish or delete results.
--   * Students see only PUBLISHED results, and only by giving their roll number AND the last 4 digits of their CNIC.
--   * Full CNIC numbers are never stored: only the last 4 digits are kept, to check the student.
--   * After 10 wrong CNIC tries for one roll number in an hour, that roll number is locked for the hour.

create table if not exists public.registrars (
  user_id uuid primary key references auth.users on delete cascade,
  created_at timestamptz not null default now()
);

create table if not exists public.result_sheets (
  id uuid primary key default gen_random_uuid(),
  title text not null,                 -- e.g. "BBA 3rd Semester"
  session text not null,               -- e.g. "Fall 2026"
  columns jsonb not null default '[]', -- column names in sheet order (roll number and CNIC excluded)
  published boolean not null default false,
  published_at timestamptz,
  created_by uuid default auth.uid() references auth.users on delete set null,
  created_at timestamptz not null default now()
);

create table if not exists public.results (
  sheet_id uuid not null references public.result_sheets on delete cascade,
  roll_no text not null,
  cnic_last4 text not null check (cnic_last4 ~ '^[0-9]{4}$'),
  data jsonb not null,                 -- { "Name": "...", "Marketing": "78", "GPA": "3.40", ... }
  primary key (sheet_id, roll_no)
);

create index if not exists results_roll on public.results (lower(trim(roll_no)));

create table if not exists public.result_lookup_failures (
  roll_no text not null,
  at timestamptz not null default now()
);
create index if not exists result_lookup_failures_roll on public.result_lookup_failures (roll_no, at);

alter table public.registrars enable row level security;
alter table public.result_sheets enable row level security;
alter table public.results enable row level security;
alter table public.result_lookup_failures enable row level security; -- no policies: only the function below uses it

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

-- Student lookup. Returns every published sheet that has this roll number with a matching CNIC.
create or replace function public.student_results(p_roll text, p_cnic4 text)
returns table (title text, session text, published_at timestamptz, columns jsonb, data jsonb)
language plpgsql
volatile
security definer
set search_path = public
as $$
declare
  roll text := lower(trim(p_roll));
  n int;
begin
  if length(roll) < 3 or p_cnic4 !~ '^[0-9]{4}$' then
    return;
  end if;

  if (select count(*) from public.result_lookup_failures f where f.roll_no = roll and f.at > now() - interval '1 hour') >= 10 then
    raise exception 'Too many wrong attempts. Please try again in an hour.';
  end if;

  delete from public.result_lookup_failures f where f.at < now() - interval '1 day';

  return query
    select s.title, s.session, s.published_at, s.columns, r.data
    from public.results r
    join public.result_sheets s on s.id = r.sheet_id
    where s.published
      and lower(trim(r.roll_no)) = roll
      and r.cnic_last4 = p_cnic4
    order by s.published_at desc;

  get diagnostics n = row_count;
  if n = 0 and exists (
    select 1 from public.results r join public.result_sheets s on s.id = r.sheet_id
    where s.published and lower(trim(r.roll_no)) = roll
  ) then
    insert into public.result_lookup_failures (roll_no) values (roll);
  end if;
end;
$$;

revoke all on function public.student_results(text, text) from public;
grant execute on function public.student_results(text, text) to anon, authenticated;
revoke all on function public.is_registrar() from public;
grant execute on function public.is_registrar() to authenticated;

-- ─────────────────────────────────────────────────────────────────────────────
-- AFTER running the above: make the Deputy Registrar's account a registrar.
-- 1. Create their user in Authentication > Users (Add user, Auto Confirm).
-- 2. Run this line in a NEW query, with their email:
--
--    insert into public.registrars (user_id) select id from auth.users where email = 'deputy.registrar@example.com';
