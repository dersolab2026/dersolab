-- Netlerim artik ders ders dogru/yanlis girisine gecti. Toplamlar
-- student_exam_results uzerinde denormalize duruyor (liste ekraninda ek
-- sorgu gerekmesin diye), ders kirilimi bu tabloda.

create table public.student_exam_sections (
  id uuid primary key default gen_random_uuid(),
  exam_result_id uuid not null references public.student_exam_results(id) on delete cascade,
  section_name text not null,
  correct_count integer not null default 0 check (correct_count >= 0),
  wrong_count integer not null default 0 check (wrong_count >= 0),
  display_order smallint not null default 0
);

create index student_exam_sections_result_idx
  on public.student_exam_sections (exam_result_id, display_order);

-- AYT'de bolumler adayin alanina gore degistigi icin secilen alani saklıyoruz.
alter table public.student_exam_results
  add column track text check (track is null or track in ('sayisal', 'ea', 'sozel', 'dil'));

alter table public.student_exam_sections enable row level security;

-- Erisim ust kayittaki ogrenciye bagli.
create policy "exam_sections_select_own" on public.student_exam_sections
  for select using (
    exists (
      select 1 from public.student_exam_results r
      where r.id = exam_result_id and r.student_id = (select auth.uid())
    )
  );

create policy "exam_sections_insert_own" on public.student_exam_sections
  for insert with check (
    exists (
      select 1 from public.student_exam_results r
      where r.id = exam_result_id and r.student_id = (select auth.uid())
    )
  );

create policy "exam_sections_delete_own" on public.student_exam_sections
  for delete using (
    exists (
      select 1 from public.student_exam_results r
      where r.id = exam_result_id and r.student_id = (select auth.uid())
    )
  );
