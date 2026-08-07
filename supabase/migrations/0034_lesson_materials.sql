create table public.lesson_materials (
  id uuid primary key default gen_random_uuid(),
  booking_id uuid not null references public.bookings(id) on delete cascade,
  instructor_id uuid not null references public.instructors(user_id),
  student_id uuid not null references public.students(user_id),
  title text not null,
  file_path text not null,
  created_at timestamptz not null default now()
);

alter table public.lesson_materials enable row level security;

create policy "lesson_materials_select" on public.lesson_materials
  for select using (
    instructor_id = auth.uid()
    or student_id = auth.uid()
    or public.is_guardian_of(student_id)
    or public.is_admin()
  );

create policy "lesson_materials_insert" on public.lesson_materials
  for insert with check (
    instructor_id = auth.uid()
    and exists (
      select 1 from public.bookings b
      where b.id = booking_id and b.instructor_id = auth.uid() and b.student_id = student_id
    )
  );

create policy "lesson_materials_delete" on public.lesson_materials
  for delete using (instructor_id = auth.uid() or public.is_admin());

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values ('lesson-materials', 'lesson-materials', false, 10485760, array['application/pdf']);

create policy "lesson_material_files_insert" on storage.objects
  for insert with check (
    bucket_id = 'lesson-materials'
    and exists (
      select 1 from public.bookings b
      where b.id::text = (storage.foldername(name))[1] and b.instructor_id = auth.uid()
    )
  );

create policy "lesson_material_files_select" on storage.objects
  for select using (
    bucket_id = 'lesson-materials'
    and exists (
      select 1 from public.bookings b
      where b.id::text = (storage.foldername(name))[1]
      and (b.student_id = auth.uid() or b.instructor_id = auth.uid()
           or public.is_guardian_of(b.student_id) or public.is_admin())
    )
  );

create policy "lesson_material_files_delete" on storage.objects
  for delete using (
    bucket_id = 'lesson-materials'
    and exists (
      select 1 from public.bookings b
      where b.id::text = (storage.foldername(name))[1] and b.instructor_id = auth.uid()
    )
  );
