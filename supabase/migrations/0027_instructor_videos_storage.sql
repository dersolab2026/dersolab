insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'instructor-videos', 'instructor-videos', true,
  209715200,
  array['video/mp4', 'video/quicktime', 'video/webm']
);

create policy "instructor_video_public_select" on storage.objects
  for select using (bucket_id = 'instructor-videos');

create policy "instructor_video_owner_insert" on storage.objects
  for insert with check (bucket_id = 'instructor-videos' and (storage.foldername(name))[1] = auth.uid()::text);

create policy "instructor_video_owner_update" on storage.objects
  for update using (bucket_id = 'instructor-videos' and (storage.foldername(name))[1] = auth.uid()::text);
