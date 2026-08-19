-- Hedef program ve ders bazlı hedef netler.
--
-- Deneme grafiği bugün "neredesin" diyor ama "nerede olmalısın" demiyor;
-- koçluk görüşmesinin açılış sorusu tam olarak bu. Verinin çoğu zaten
-- yatırılmış durumda: yok_atlas_programs tablosunda 21.493 program, taban
-- puanı ve başarı sırasıyla duruyor (tercih robotu için çekilmişti).

alter table public.students
  -- yok_atlas_programs.kilavuz_kodu; FK KOYMUYORUZ çünkü tablo her yıl
  -- yeniden senkronlanıyor ve eski kodlar silinince öğrencinin hedefi
  -- FK ihlaliyle kaybolurdu. Kod tutulup program bulunamazsa arayüz
  -- "hedefin güncel kılavuzda yok" diyebilir.
  add column if not exists target_program_code bigint,
  -- Program seçmek istemeyen "şu sıralamayı istiyorum" diyebilsin.
  add column if not exists target_rank integer check (target_rank is null or target_rank > 0),
  -- Sınav tarihini öğrenci kendisi giriyor: gelecek yılların ÖSYM
  -- takvimi açıklanmadan sabit bir tarih gömmek yanlış olur.
  add column if not exists target_exam_date date;

create table if not exists public.student_target_nets (
  id uuid primary key default gen_random_uuid(),
  student_id uuid not null references public.students(user_id) on delete cascade,
  exam_type text not null,
  -- AYT'de alan; digerlerinde null.
  track text,
  section_name text not null,
  target_net numeric(5,2) not null check (target_net >= 0),
  created_at timestamptz not null default now()
);

-- track nullable oldugu icin duz unique constraint ise yaramaz: Postgres'te
-- NULL'lar birbirinden farkli sayilir ve ayni satir iki kez girilebilirdi.
create unique index if not exists student_target_nets_tek
  on public.student_target_nets (student_id, exam_type, coalesce(track, ''), section_name);

alter table public.student_target_nets enable row level security;

create policy "target_nets_select" on public.student_target_nets
  for select using (
    student_id = (select auth.uid()) or public.can_view_student(student_id)
  );

create policy "target_nets_insert_own" on public.student_target_nets
  for insert with check (student_id = (select auth.uid()));

create policy "target_nets_update_own" on public.student_target_nets
  for update using (student_id = (select auth.uid()));

create policy "target_nets_delete_own" on public.student_target_nets
  for delete using (student_id = (select auth.uid()));
