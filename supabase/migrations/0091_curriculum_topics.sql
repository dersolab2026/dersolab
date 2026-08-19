-- Konu sözlüğü ve konu takip çizelgesi.
--
-- Bugün konu düzeyinde hiçbir şey birikmiyor: Günlük'teki "topic" ve ödev
-- başlığı serbest metin. Öğrenci "Türev", "türev", "Türev Alma" yazınca üç
-- ayrı şey oluyor ve "hangi konuları bitirdim" sorusu cevaplanamıyor.
--
-- İki aşamalı devreye alınıyor. Bu migration birinci aşama: sözlük tablosu
-- ve öğrencinin konu durumu. Serbest metin alanları KALDIRILMIYOR — sözlükte
-- olmayan bir konu çalışan öğrenci engellenmemeli.

create table if not exists public.curriculum_topics (
  id uuid primary key default gen_random_uuid(),
  exam_type text not null,
  subject text not null,
  name text not null,
  -- Dersteki sira; mufredat sirasi ogrenci icin anlamli.
  display_order smallint not null default 0,
  created_at timestamptz not null default now()
);

create unique index if not exists curriculum_topics_tek
  on public.curriculum_topics (exam_type, subject, name);

create index if not exists curriculum_topics_ders_idx
  on public.curriculum_topics (exam_type, subject, display_order);

alter table public.curriculum_topics enable row level security;

-- Sozluk herkese acik: giris yapmamis ziyaretcinin de konu sayfalarini
-- gorebilmesi ileride SEO icin degerli.
create policy "curriculum_topics_public_select" on public.curriculum_topics
  for select using (true);

create policy "curriculum_topics_admin_write" on public.curriculum_topics
  for all using (public.is_admin()) with check (public.is_admin());

-- Ogrencinin konu bazli durumu.
create table if not exists public.student_topic_status (
  id uuid primary key default gen_random_uuid(),
  student_id uuid not null references public.students(user_id) on delete cascade,
  topic_id uuid not null references public.curriculum_topics(id) on delete cascade,
  -- islendi: konu anlatimi bitti | soru: soru cozuldu | tekrar: tekrar edildi
  studied boolean not null default false,
  practiced boolean not null default false,
  reviewed boolean not null default false,
  -- Ogrencinin kendi degerlendirmesi.
  confidence text check (confidence is null or confidence in ('zayif', 'orta', 'iyi')),
  updated_at timestamptz not null default now()
);

create unique index if not exists student_topic_status_tek
  on public.student_topic_status (student_id, topic_id);

create index if not exists student_topic_status_ogrenci_idx
  on public.student_topic_status (student_id);

alter table public.student_topic_status enable row level security;

create policy "topic_status_select" on public.student_topic_status
  for select using (
    student_id = (select auth.uid()) or public.can_view_student(student_id)
  );

create policy "topic_status_insert_own" on public.student_topic_status
  for insert with check (student_id = (select auth.uid()));

create policy "topic_status_update_own" on public.student_topic_status
  for update using (student_id = (select auth.uid()));

create policy "topic_status_delete_own" on public.student_topic_status
  for delete using (student_id = (select auth.uid()));

-- Gunluk ve odev sozlukteki konuya baglanabilsin. Serbest metin alanlari
-- yerinde kaliyor: sozlukte olmayan konu calisan ogrenci engellenmemeli.
alter table public.student_study_logs
  add column if not exists topic_id uuid references public.curriculum_topics(id) on delete set null;

alter table public.homework
  add column if not exists topic_id uuid references public.curriculum_topics(id) on delete set null;
