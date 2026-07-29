create policy "homework_update_instructor" on public.homework
  for update using (instructor_id = auth.uid() or public.is_admin());

create table public.homework_submissions (
  id uuid primary key default gen_random_uuid(),
  homework_id uuid not null references public.homework(id) on delete cascade,
  file_path text not null,
  file_type text not null check (file_type in ('image', 'video')),
  uploaded_at timestamptz not null default now()
);

alter table public.homework_submissions enable row level security;

create policy "homework_submissions_select" on public.homework_submissions
  for select using (
    exists (
      select 1 from public.homework h
      where h.id = homework_submissions.homework_id
      and (h.student_id = auth.uid() or h.instructor_id = auth.uid()
           or public.is_guardian_of(h.student_id) or public.is_admin())
    )
  );

create policy "homework_submissions_insert" on public.homework_submissions
  for insert with check (
    exists (
      select 1 from public.homework h
      where h.id = homework_submissions.homework_id
      and (h.student_id = auth.uid() or public.is_guardian_of(h.student_id))
    )
  );

create or replace function public.mark_homework_submitted()
returns trigger
language plpgsql security definer set search_path = public
as $$
begin
  update public.homework set status = 'submitted'
  where id = new.homework_id and status = 'assigned';
  return new;
end;
$$;

create trigger trg_mark_homework_submitted
  after insert on public.homework_submissions
  for each row execute function public.mark_homework_submitted();
