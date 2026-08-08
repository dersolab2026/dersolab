-- Ogrenci sorusuna, egitmen de cevabina PDF/gorsel/video ekleyebilsin.
-- homework_submissions ile ayni desen: ayri, sadece-insert edilen bir ek tablosu,
-- boylece questions satirinda sutun bazli kisitli update ihtiyaci olmuyor.

create table public.question_attachments (
  id uuid primary key default gen_random_uuid(),
  question_id uuid not null references public.questions(id) on delete cascade,
  uploaded_by uuid not null references public.users(id),
  role text not null check (role in ('question', 'answer')),
  file_path text not null,
  file_type text not null check (file_type in ('image', 'video', 'pdf')),
  created_at timestamptz not null default now()
);

alter table public.question_attachments enable row level security;

create policy "question_attachments_select" on public.question_attachments
  for select using (
    exists (
      select 1 from public.questions q
      where q.id = question_attachments.question_id
      and (q.student_id = auth.uid() or q.instructor_id = auth.uid() or public.is_admin())
    )
  );

create policy "question_attachments_insert" on public.question_attachments
  for insert with check (
    uploaded_by = auth.uid()
    and exists (
      select 1 from public.questions q
      where q.id = question_attachments.question_id
      and (
        (question_attachments.role = 'question' and q.student_id = auth.uid())
        or (question_attachments.role = 'answer' and q.instructor_id = auth.uid())
      )
    )
  );

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'question-attachments', 'question-attachments', false,
  26214400,
  array['image/jpeg', 'image/png', 'image/webp', 'video/mp4', 'video/quicktime', 'application/pdf']
);

create policy "question_attachment_files_insert" on storage.objects
  for insert with check (
    bucket_id = 'question-attachments'
    and exists (
      select 1 from public.questions q
      where q.id::text = (storage.foldername(name))[1]
      and (q.student_id = auth.uid() or q.instructor_id = auth.uid())
    )
  );

create policy "question_attachment_files_select" on storage.objects
  for select using (
    bucket_id = 'question-attachments'
    and exists (
      select 1 from public.questions q
      where q.id::text = (storage.foldername(name))[1]
      and (q.student_id = auth.uid() or q.instructor_id = auth.uid() or public.is_admin())
    )
  );
