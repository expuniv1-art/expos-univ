-- EXPOS_UNIV Supabase schema
-- Run this file in Supabase SQL Editor after creating a new project.

create extension if not exists "pgcrypto";

-- ---------- ENUMS ----------
do $$ begin
  create type public.user_role as enum ('admin', 'student');
exception when duplicate_object then null; end $$;

do $$ begin
  create type public.project_status as enum (
    'not_started',
    'project_in_progress',
    'chapter_one_done',
    'chapter_two_done',
    'review_correction',
    'references_done',
    'powerpoint_done',
    'project_completed',
    'sent_to_student'
  );
exception when duplicate_object then null; end $$;

do $$ begin
  create type public.payment_status as enum ('paid', 'partial', 'pending');
exception when duplicate_object then null; end $$;

do $$ begin
  create type public.project_file_type as enum ('Word', 'PDF', 'PowerPoint');
exception when duplicate_object then null; end $$;

-- ---------- TABLES ----------
create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  email text unique not null,
  full_name text not null,
  role public.user_role not null default 'student',
  created_at timestamptz not null default now()
);

create table if not exists public.students (
  id uuid primary key default gen_random_uuid(),
  user_id uuid unique references auth.users(id) on delete cascade,
  name text not null,
  university text not null,
  specialty text not null,
  project_type text not null,
  total_amount numeric(12,2) not null default 0 check (total_amount >= 0),
  paid_amount numeric(12,2) not null default 0 check (paid_amount >= 0),
  payment_status public.payment_status not null default 'pending',
  project_status public.project_status not null default 'not_started',
  progress int not null default 0 check (progress between 0 and 100),
  last_admin_update text,
  delivery_date date,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.payments (
  id uuid primary key default gen_random_uuid(),
  student_id uuid not null references public.students(id) on delete cascade,
  user_id uuid not null default auth.uid() references auth.users(id) on delete cascade,
  amount numeric(12,2) not null check (amount > 0),
  payment_date date not null,
  receipt_path text not null,
  receipt_name text not null,
  created_at timestamptz not null default now()
);

create table if not exists public.project_files (
  id uuid primary key default gen_random_uuid(),
  student_id uuid not null references public.students(id) on delete cascade,
  name text not null,
  file_type public.project_file_type not null,
  file_path text not null,
  uploaded_by uuid default auth.uid() references auth.users(id) on delete set null,
  created_at timestamptz not null default now()
);

create table if not exists public.admin_updates (
  id uuid primary key default gen_random_uuid(),
  student_id uuid not null references public.students(id) on delete cascade,
  text text not null,
  created_by uuid default auth.uid() references auth.users(id) on delete set null,
  created_at timestamptz not null default now()
);

-- ---------- HELPERS ----------
create or replace function public.is_admin()
returns boolean
language sql
security definer
set search_path = public
as $$
  select exists (
    select 1 from public.profiles
    where id = auth.uid() and role = 'admin'
  );
$$;

create or replace function public.refresh_student_paid_amount()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
  target_student_id uuid;
  new_paid numeric(12,2);
  total numeric(12,2);
begin
  target_student_id := coalesce(new.student_id, old.student_id);

  select coalesce(sum(amount), 0) into new_paid
  from public.payments
  where student_id = target_student_id;

  select total_amount into total
  from public.students
  where id = target_student_id;

  update public.students
  set paid_amount = new_paid,
      payment_status = case
        when new_paid >= total and total > 0 then 'paid'::public.payment_status
        when new_paid > 0 then 'partial'::public.payment_status
        else 'pending'::public.payment_status
      end,
      updated_at = now()
  where id = target_student_id;

  return coalesce(new, old);
end;
$$;

drop trigger if exists trg_refresh_paid_after_insert on public.payments;
create trigger trg_refresh_paid_after_insert
after insert or update or delete on public.payments
for each row execute function public.refresh_student_paid_amount();

create or replace function public.touch_students_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists trg_students_updated_at on public.students;
create trigger trg_students_updated_at
before update on public.students
for each row execute function public.touch_students_updated_at();

-- ---------- RLS ----------
alter table public.profiles enable row level security;
alter table public.students enable row level security;
alter table public.payments enable row level security;
alter table public.project_files enable row level security;
alter table public.admin_updates enable row level security;

-- profiles
create policy "profiles_select_own_or_admin" on public.profiles
for select using (id = auth.uid() or public.is_admin());

create policy "profiles_student_insert_own" on public.profiles
for insert with check (id = auth.uid() and role = 'student');

create policy "profiles_student_update_own_without_role_escalation" on public.profiles
for update using (id = auth.uid() and role = 'student') with check (id = auth.uid() and role = 'student');

create policy "profiles_admin_update" on public.profiles
for update using (public.is_admin()) with check (public.is_admin());

create policy "profiles_admin_insert" on public.profiles
for insert with check (public.is_admin());

-- students
create policy "students_select_own_or_admin" on public.students
for select using (user_id = auth.uid() or public.is_admin());

create policy "students_admin_insert" on public.students
for insert with check (public.is_admin());

create policy "students_admin_update" on public.students
for update using (public.is_admin()) with check (public.is_admin());

create policy "students_admin_delete" on public.students
for delete using (public.is_admin());

-- payments
create policy "payments_select_own_or_admin" on public.payments
for select using (
  public.is_admin()
  or exists (
    select 1 from public.students s
    where s.id = payments.student_id and s.user_id = auth.uid()
  )
);

create policy "payments_student_insert_own" on public.payments
for insert with check (
  user_id = auth.uid()
  and exists (
    select 1 from public.students s
    where s.id = payments.student_id and s.user_id = auth.uid()
  )
);

create policy "payments_admin_all" on public.payments
for all using (public.is_admin()) with check (public.is_admin());

-- project files
create policy "files_select_own_or_admin" on public.project_files
for select using (
  public.is_admin()
  or exists (
    select 1 from public.students s
    where s.id = project_files.student_id and s.user_id = auth.uid()
  )
);

create policy "files_admin_all" on public.project_files
for all using (public.is_admin()) with check (public.is_admin());

-- admin updates
create policy "updates_select_own_or_admin" on public.admin_updates
for select using (
  public.is_admin()
  or exists (
    select 1 from public.students s
    where s.id = admin_updates.student_id and s.user_id = auth.uid()
  )
);

create policy "updates_admin_all" on public.admin_updates
for all using (public.is_admin()) with check (public.is_admin());

-- ---------- STORAGE BUCKETS ----------
insert into storage.buckets (id, name, public)
values ('payment-receipts', 'payment-receipts', false)
on conflict (id) do nothing;

insert into storage.buckets (id, name, public)
values ('project-files', 'project-files', false)
on conflict (id) do nothing;

-- Receipts: students upload only inside their own auth.uid() folder. Admins can read everything.
create policy "receipts_select_own_or_admin" on storage.objects
for select using (
  bucket_id = 'payment-receipts'
  and (
    public.is_admin()
    or (storage.foldername(name))[1] = auth.uid()::text
  )
);

create policy "receipts_insert_own_folder" on storage.objects
for insert with check (
  bucket_id = 'payment-receipts'
  and (storage.foldername(name))[1] = auth.uid()::text
);

-- Project files: admin uploads; student downloads from own auth.uid() folder.
create policy "project_files_select_own_or_admin" on storage.objects
for select using (
  bucket_id = 'project-files'
  and (
    public.is_admin()
    or (storage.foldername(name))[1] = auth.uid()::text
  )
);

create policy "project_files_admin_insert" on storage.objects
for insert with check (
  bucket_id = 'project-files'
  and public.is_admin()
);

create policy "project_files_admin_update_delete" on storage.objects
for all using (
  bucket_id = 'project-files'
  and public.is_admin()
) with check (
  bucket_id = 'project-files'
  and public.is_admin()
);

-- ---------- REALTIME ----------
do $$
begin
  alter publication supabase_realtime add table public.students;
exception when duplicate_object then null; end $$;

do $$
begin
  alter publication supabase_realtime add table public.payments;
exception when duplicate_object then null; end $$;

do $$
begin
  alter publication supabase_realtime add table public.project_files;
exception when duplicate_object then null; end $$;

do $$
begin
  alter publication supabase_realtime add table public.admin_updates;
exception when duplicate_object then null; end $$;

-- ---------- SEED TEMPLATE ----------
-- 1) Create users from Supabase Dashboard > Authentication > Users.
-- 2) Copy their UUIDs, then insert profiles/students like this:
--
-- insert into public.profiles (id, email, full_name, role)
-- values ('ADMIN_USER_UUID', 'admin@expos-univ.com', 'Admin EXPOS_UNIV', 'admin');
--
-- insert into public.profiles (id, email, full_name, role)
-- values ('STUDENT_USER_UUID', 'student@expos-univ.com', 'Amina Benyoucef', 'student');
--
-- insert into public.students (user_id, name, university, specialty, project_type, total_amount, project_status, progress, last_admin_update, delivery_date)
-- values ('STUDENT_USER_UUID', 'أمينة بن يوسف', 'جامعة الجزائر 3', 'علوم التسيير', 'مذكرة ماستر', 18000, 'project_in_progress', 25, 'تم تسجيل المشروع بنجاح.', '2026-06-10');
