insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values ('tercih-listeleri', 'tercih-listeleri', false, 5242880, array['application/pdf']);

create policy "tercih_listesi_files_select" on storage.objects
  for select using (
    bucket_id = 'tercih-listeleri'
    and (storage.foldername(name))[1] = auth.uid()::text
  );
