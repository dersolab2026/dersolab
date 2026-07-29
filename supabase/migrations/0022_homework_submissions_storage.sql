insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'homework-submissions', 'homework-submissions', false,
  26214400,
  array['image/jpeg', 'image/png', 'image/webp', 'video/mp4', 'video/quicktime']
);

create policy "homework_submission_files_insert" on storage.objects
  for insert with check (
    bucket_id = 'homework-submissions'
    and exists (
      select 1 from public.homework h
      where h.id::text = (storage.foldername(name))[1]
      and (h.student_id = auth.uid() or public.is_guardian_of(h.student_id))
    )
  );

create policy "homework_submission_files_select" on storage.objects
  for select using (
    bucket_id = 'homework-submissions'
    and exists (
      select 1 from public.homework h
      where h.id::text = (storage.foldername(name))[1]
      and (h.student_id = auth.uid() or h.instructor_id = auth.uid()
           or public.is_guardian_of(h.student_id) or public.is_admin())
    )
  );
