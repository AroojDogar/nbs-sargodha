-- NBS online attendance: database setup for Supabase.
-- Run this once in Supabase: SQL Editor > New query > paste everything > Run.
--
-- Who can do what:
--   * Teachers sign in (accounts are added by the admin in Authentication > Users).
--   * A teacher sees and edits ONLY their own classes, students and attendance.
--   * Students can look up their own totals by roll number (no names of other students are shown).

create table if not exists public.classes (
  id uuid primary key default gen_random_uuid(),
  teacher_id uuid not null default auth.uid() references auth.users on delete cascade,
  name text not null,      -- e.g. "BBA 3rd semester (Morning)"
  course text not null,    -- e.g. "Principles of Marketing"
  created_at timestamptz not null default now()
);

create table if not exists public.students (
  id uuid primary key default gen_random_uuid(),
  class_id uuid not null references public.classes on delete cascade,
  roll_no text not null,
  name text not null,
  created_at timestamptz not null default now(),
  unique (class_id, roll_no)
);

create table if not exists public.attendance (
  class_id uuid not null references public.classes on delete cascade,
  student_id uuid not null references public.students on delete cascade,
  date date not null,
  status text not null check (status in ('P', 'A', 'L')), -- Present, Absent, Leave
  marked_at timestamptz not null default now(),
  primary key (student_id, date)
);

create index if not exists attendance_class_date on public.attendance (class_id, date);
create index if not exists students_roll on public.students (lower(trim(roll_no)));

alter table public.classes enable row level security;
alter table public.students enable row level security;
alter table public.attendance enable row level security;

drop policy if exists "teachers manage own classes" on public.classes;
create policy "teachers manage own classes" on public.classes
  for all to authenticated
  using (teacher_id = auth.uid())
  with check (teacher_id = auth.uid());

drop policy if exists "teachers manage own students" on public.students;
create policy "teachers manage own students" on public.students
  for all to authenticated
  using (exists (select 1 from public.classes c where c.id = class_id and c.teacher_id = auth.uid()))
  with check (exists (select 1 from public.classes c where c.id = class_id and c.teacher_id = auth.uid()));

drop policy if exists "teachers manage own attendance" on public.attendance;
create policy "teachers manage own attendance" on public.attendance
  for all to authenticated
  using (exists (select 1 from public.classes c where c.id = class_id and c.teacher_id = auth.uid()))
  with check (
    exists (select 1 from public.classes c where c.id = class_id and c.teacher_id = auth.uid())
    and exists (select 1 from public.students s where s.id = student_id and s.class_id = attendance.class_id)
  );

-- Student lookup: totals per course for one roll number.
create or replace function public.student_attendance(p_roll text)
returns table (class_name text, course text, present int, absent int, on_leave int, total int)
language sql
stable
security definer
set search_path = public
as $$
  select c.name, c.course,
         count(a.student_id) filter (where a.status = 'P')::int,
         count(a.student_id) filter (where a.status = 'A')::int,
         count(a.student_id) filter (where a.status = 'L')::int,
         count(a.student_id)::int
  from public.students s
  join public.classes c on c.id = s.class_id
  left join public.attendance a on a.student_id = s.id
  where length(trim(p_roll)) >= 3
    and lower(trim(s.roll_no)) = lower(trim(p_roll))
  group by c.id, c.name, c.course, s.id
  order by c.name, c.course;
$$;

revoke all on function public.student_attendance(text) from public;
grant execute on function public.student_attendance(text) to anon, authenticated;
