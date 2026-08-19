-- Kaynak kataloğu ve şablonlu ödev tipleri.
--
-- Türkiye'de koç–öğrenci konuşması kaynak üzerinden yürüyor ("3D'nin 3.
-- bölümünü bitir") ama ödev bugün tamamen serbest metin: hangi kitabın
-- neresi hiçbir yerde birikmiyor, yarım bırakılan kaynak görünmüyor.

create table if not exists public.study_resources (
  id uuid primary key default gen_random_uuid(),
  -- Katalog ortak: bir eğitmenin eklediği kaynağı diğerleri de kullanabilsin.
  -- Kişiye özel katalog, 17 eğitmenli bir platformda aynı kitabın 17 kez
  -- girilmesi demek olurdu.
  publisher text,
  title text not null,
  subject text,
  exam_type text,
  -- Kaynağın toplam bölüm/test sayısı; yüzde ilerleme için.
  total_units integer check (total_units is null or total_units > 0),
  created_by uuid references public.users(id) on delete set null,
  created_at timestamptz not null default now()
);

create unique index if not exists study_resources_tek
  on public.study_resources (coalesce(publisher, ''), title);

create index if not exists study_resources_ders_idx
  on public.study_resources (subject);

alter table public.study_resources enable row level security;

-- Katalog giriş yapmış herkese açık; eğitmen ekleyebiliyor, admin siliyor.
create policy "resources_select" on public.study_resources
  for select using ((select auth.uid()) is not null);

create policy "resources_insert_instructor" on public.study_resources
  for insert with check (
    exists (select 1 from public.instructors i where i.user_id = (select auth.uid()))
  );

create policy "resources_delete_admin" on public.study_resources
  for delete using (public.is_admin());

-- Ödevin tipi ve kaynak bağlantısı.
alter table public.homework
  add column if not exists resource_id uuid references public.study_resources(id) on delete set null,
  -- "3. bölüm, 1-40" gibi serbest aralık; birim sayısı kaynağa göre değişiyor.
  add column if not exists resource_range text,
  add column if not exists homework_type text not null default 'serbest'
    check (homework_type in ('serbest', 'kaynak', 'konu-tekrari', 'kapali-kitap'));

-- Kapalı kitap hatırlama görevinde eğitmenin kısa yapılandırılmış geri
-- bildirimi. Teslim ve onay akışı zaten vardı; eksik olan tek şey buydu.
alter table public.homework
  add column if not exists instructor_feedback text;
