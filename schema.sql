-- SICIP Plumbing Academy starter schema
-- Run in Supabase SQL Editor. Review before production use.

create extension if not exists pgcrypto;

create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  full_name text,
  preferred_language text not null default 'bn' check (preferred_language in ('bn','en')),
  role text not null default 'student' check (role in ('student','teacher_admin','super_admin')),
  created_at timestamptz not null default now()
);

create table if not exists public.chapters (
  id uuid primary key default gen_random_uuid(),
  title_bn text not null,
  title_en text,
  description text,
  sort_order int not null default 0,
  is_published boolean not null default false,
  created_at timestamptz not null default now()
);

create table if not exists public.materials (
  id uuid primary key default gen_random_uuid(),
  chapter_id uuid references public.chapters(id) on delete set null,
  title text not null,
  description text,
  storage_path text not null,
  file_type text not null default 'pdf',
  is_published boolean not null default false,
  created_by uuid references public.profiles(id),
  created_at timestamptz not null default now()
);

create table if not exists public.questions (
  id uuid primary key default gen_random_uuid(),
  chapter_id uuid references public.chapters(id) on delete set null,
  question_type text not null check (question_type in ('mcq','image_mcq','written','viva','practical')),
  question_bn text not null,
  question_en text,
  image_path text,
  explanation_bn text,
  explanation_en text,
  marks numeric(6,2) not null default 1,
  is_published boolean not null default false,
  created_by uuid references public.profiles(id),
  created_at timestamptz not null default now()
);

create table if not exists public.options (
  id uuid primary key default gen_random_uuid(),
  question_id uuid not null references public.questions(id) on delete cascade,
  option_bn text not null,
  option_en text,
  sort_order int not null default 0
);

-- Correct answers are kept separately. Do not expose this table to student clients.
create table if not exists public.question_answer_keys (
  question_id uuid primary key references public.questions(id) on delete cascade,
  correct_option_id uuid references public.options(id) on delete set null
);

create table if not exists public.exams (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  description text,
  duration_minutes int not null default 20,
  total_marks numeric(7,2) not null default 20,
  is_published boolean not null default false,
  starts_at timestamptz,
  ends_at timestamptz,
  created_by uuid references public.profiles(id),
  created_at timestamptz not null default now()
);

create table if not exists public.exam_questions (
  exam_id uuid not null references public.exams(id) on delete cascade,
  question_id uuid not null references public.questions(id) on delete cascade,
  sort_order int not null default 0,
  primary key (exam_id, question_id)
);

create table if not exists public.attempts (
  id uuid primary key default gen_random_uuid(),
  exam_id uuid not null references public.exams(id),
  student_id uuid not null references public.profiles(id),
  started_at timestamptz not null default now(),
  submitted_at timestamptz,
  score numeric(7,2),
  status text not null default 'in_progress' check (status in ('in_progress','submitted','graded'))
);

create table if not exists public.answers (
  id uuid primary key default gen_random_uuid(),
  attempt_id uuid not null references public.attempts(id) on delete cascade,
  question_id uuid not null references public.questions(id),
  selected_option_id uuid references public.options(id),
  written_answer text,
  awarded_marks numeric(7,2),
  teacher_feedback text,
  unique(attempt_id, question_id)
);

create table if not exists public.notices (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  body text not null,
  is_published boolean not null default false,
  created_by uuid references public.profiles(id),
  created_at timestamptz not null default now()
);

create table if not exists public.bookmarks (
  student_id uuid not null references public.profiles(id) on delete cascade,
  question_id uuid not null references public.questions(id) on delete cascade,
  created_at timestamptz not null default now(),
  primary key(student_id, question_id)
);

-- Create a profile automatically when a user signs up. New users are always students.
create or replace function public.handle_new_user()
returns trigger language plpgsql security definer set search_path = public as $$
begin
  insert into public.profiles (id, full_name)
  values (new.id, coalesce(new.raw_user_meta_data->>'full_name',''));
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
after insert on auth.users
for each row execute procedure public.handle_new_user();

-- Enable RLS on all application tables.
alter table public.profiles enable row level security;
alter table public.chapters enable row level security;
alter table public.materials enable row level security;
alter table public.questions enable row level security;
alter table public.options enable row level security;
alter table public.question_answer_keys enable row level security;
alter table public.exams enable row level security;
alter table public.exam_questions enable row level security;
alter table public.attempts enable row level security;
alter table public.answers enable row level security;
alter table public.notices enable row level security;
alter table public.bookmarks enable row level security;

-- Profiles: users see/edit their own basic profile; role cannot be self-updated through this policy.
create policy "read own profile" on public.profiles for select to authenticated using (id = auth.uid());
create policy "update own profile" on public.profiles for update to authenticated using (id = auth.uid()) with check (id = auth.uid());

-- Public course outline; content rows only visible when published.
create policy "public read published chapters" on public.chapters for select using (is_published = true);
create policy "public read published questions" on public.questions for select using (is_published = true);
create policy "public read published options" on public.options for select using (
  exists (select 1 from public.questions q where q.id = question_id and q.is_published = true)
);
-- No student SELECT policy is intentionally created for question_answer_keys.
-- Add a trusted server-side grading function before using real exams.
create policy "public read published exams" on public.exams for select using (is_published = true);
create policy "public read published exam questions" on public.exam_questions for select using (
  exists (select 1 from public.exams e where e.id = exam_id and e.is_published = true)
);
create policy "public read published notices" on public.notices for select using (is_published = true);

-- Private PDFs: authenticated users can read published material metadata.
create policy "authenticated read published materials" on public.materials for select to authenticated using (is_published = true);

-- Students can see only their own attempts and answers.
create policy "student read own attempts" on public.attempts for select to authenticated using (student_id = auth.uid());
create policy "student create own attempts" on public.attempts for insert to authenticated with check (student_id = auth.uid());
create policy "student read own answers" on public.answers for select to authenticated using (
  exists (select 1 from public.attempts a where a.id = attempt_id and a.student_id = auth.uid())
);
create policy "student manage own bookmarks" on public.bookmarks for all to authenticated using (student_id = auth.uid()) with check (student_id = auth.uid());

-- NOTE: Production policies for teacher/super-admin writes and secure grading should be added
-- after creating the first trusted super_admin profile. Never allow public users to set their own role.
-- Correct answers should be moved to a server-only table/function before running high-stakes exams.
