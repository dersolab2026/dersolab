-- Deneme kimliği ve deneme sonrası yansıtma.
--
-- Türkiye'de denemeler yayına göre çok farklı zorlukta. Zorluk kaydedilmeden
-- "netin düştü" yorumu yanlış olabiliyor ve öğrenciyi boşuna demoralize
-- ediyor: kolay bir denemeden zor bir denemeye geçen öğrencinin neti
-- düşerken gerçek seviyesi yükselmiş olabilir.
--
-- Not: bu alanlar bir dönem "site içi sıralama" özelliği için de ön koşul
-- olarak düşünülmüştü; o özellik iptal edildi. Buradaki gerekçe bağımsız.

alter table public.student_exam_results
  -- Yayin adi serbest metin degil kucuk bir katalogdan geliyor (kodda),
  -- ama veritabaninda text: katalog buyudukce migration gerekmesin.
  add column if not exists publisher text,
  add column if not exists difficulty text
    check (difficulty is null or difficulty in ('kolay', 'orta', 'zor')),
  -- Sinavi kac dakikada bitirdi; sure yonetimi sinyali.
  add column if not exists duration_minutes integer
    check (duration_minutes is null or (duration_minutes > 0 and duration_minutes <= 600));

create table if not exists public.student_exam_reflections (
  exam_result_id uuid primary key
    references public.student_exam_results(id) on delete cascade,
  -- "Bu denemeye nasil hazirlandin"
  preparation text,
  -- "Hangi derste sure yetmedi"
  time_pressure_subject text,
  created_at timestamptz not null default now()
);

alter table public.student_exam_reflections enable row level security;

-- Erisim ust kayda bagli: ogrencinin kendisi ve denemeyi gorebilen egitmen.
create policy "exam_reflections_select" on public.student_exam_reflections
  for select using (
    exists (
      select 1 from public.student_exam_results r
      where r.id = exam_result_id
        and (r.student_id = (select auth.uid()) or public.can_view_student(r.student_id))
    )
  );

create policy "exam_reflections_write_own" on public.student_exam_reflections
  for insert with check (
    exists (
      select 1 from public.student_exam_results r
      where r.id = exam_result_id and r.student_id = (select auth.uid())
    )
  );

create policy "exam_reflections_update_own" on public.student_exam_reflections
  for update using (
    exists (
      select 1 from public.student_exam_results r
      where r.id = exam_result_id and r.student_id = (select auth.uid())
    )
  );
