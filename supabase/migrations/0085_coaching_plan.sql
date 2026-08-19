-- Haftalık koçluk planı.
--
-- 0081 "üstlenen koç haftayı kendisi planlar" diyordu ama koçun o planı
-- yazacağı hiçbir yer yoktu. Günlük yalnızca geçmişi kaydediyor; karşısında
-- bir hedef olmadığı için toplanan veri "iyi mi kötü mü" diye yorumlanamıyor.
--
-- Eşleştirme kasıtlı olarak öğrenciden ek veri istemiyor: öğrenci Günlük'e
-- her zamanki gibi giriyor, satır aynı gün + aynı ders üzerinden plana
-- bağlanıyor. Yeni bir alışkanlık talep etmek en pahalı üründür.

create table if not exists public.coaching_plan_items (
  id uuid primary key default gen_random_uuid(),
  student_id uuid not null references public.students(user_id) on delete cascade,
  coach_id uuid not null references public.instructors(user_id) on delete cascade,
  relationship_id uuid references public.coaching_relationships(id) on delete set null,

  -- Haftanin pazartesi tarihi; haftalik gruplama bunun uzerinden yapiliyor.
  plan_week date not null,
  plan_date date not null,
  -- Saat opsiyonel: koc "sali aksami" demek isteyebilir.
  plan_time time,

  subject text not null,
  topic text,
  source text,
  target_questions integer check (target_questions is null or target_questions >= 0),
  target_minutes integer check (target_minutes is null or target_minutes >= 0),

  -- Kocun elle isaretleyebilmesi icin; otomatik eslesme bunu ezmiyor.
  -- 'planned' = henuz bir sey yok, 'done' = koc elle tamamlandi dedi,
  -- 'skipped' = bu hafta atlandi.
  status text not null default 'planned' check (status in ('planned', 'done', 'skipped')),
  created_at timestamptz not null default now()
);

create index if not exists coaching_plan_items_ogrenci_hafta_idx
  on public.coaching_plan_items (student_id, plan_week);

create index if not exists coaching_plan_items_koc_idx
  on public.coaching_plan_items (coach_id, plan_week);

alter table public.coaching_plan_items enable row level security;

-- Ogrenci kendi planini gorur (gormedigi bir plana uymasi beklenemez).
create policy "plan_items_select" on public.coaching_plan_items
  for select using (
    student_id = (select auth.uid())
    or coach_id = (select auth.uid())
    or public.is_admin()
  );

create policy "plan_items_insert_coach" on public.coaching_plan_items
  for insert with check (
    coach_id = (select auth.uid()) and public.is_coach((select auth.uid()))
  );

create policy "plan_items_update_coach" on public.coaching_plan_items
  for update using (coach_id = (select auth.uid()));

create policy "plan_items_delete_coach" on public.coaching_plan_items
  for delete using (coach_id = (select auth.uid()));
