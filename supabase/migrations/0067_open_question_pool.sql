-- Soru-cevap ozelligi acik havuz modeline geciyor: ogrenci belirli bir
-- egitmene degil bir bransa soru soruyor, o bransi bilen herhangi bir
-- egitmen cevaplayabiliyor (demo_lesson_requests'teki ayni desen).
-- Ayrica ayri bir "soru kredisi" turu ekleniyor (ders kredisinden bagimsiz).

alter table public.students
  add column question_credit_balance integer not null default 0 check (question_credit_balance >= 0);

alter table public.packages
  add column package_type text not null default 'lesson' check (package_type in ('lesson', 'question'));

alter table public.questions
  alter column instructor_id drop not null,
  add column subject text;

create table public.question_declines (
  question_id uuid not null references public.questions(id) on delete cascade,
  instructor_id uuid not null references public.instructors(user_id) on delete cascade,
  created_at timestamptz not null default now(),
  primary key (question_id, instructor_id)
);

alter table public.question_declines enable row level security;

create policy "question_declines_select" on public.question_declines
  for select using (instructor_id = auth.uid() or public.is_admin());

create policy "question_declines_insert" on public.question_declines
  for insert with check (instructor_id = auth.uid());

-- questions RLS: acik havuz + booking sarti kalkiyor

drop policy "questions_select" on public.questions;
create policy "questions_select" on public.questions
  for select using (
    student_id = auth.uid()
    or instructor_id = auth.uid()
    or public.is_admin()
    or (
      status = 'pending'
      and instructor_id is null
      and exists (select 1 from public.instructors i where i.user_id = auth.uid() and i.subjects @> array[questions.subject])
      and not exists (
        select 1 from public.question_declines d
        where d.question_id = questions.id and d.instructor_id = auth.uid()
      )
    )
  );

drop policy "questions_insert" on public.questions;
create policy "questions_insert" on public.questions
  for insert with check (
    asked_by = auth.uid()
    and student_id = auth.uid()
  );

-- Tek policy hem "havuzdan al ve cevapla" (instructor_id null -> self) hem de
-- (varsa) zaten kendine ait bir soruyu guncellemeyi kapsiyor.
drop policy "questions_update_instructor" on public.questions;
create policy "questions_update_instructor" on public.questions
  for update using (
    instructor_id = auth.uid()
    or (
      status = 'pending'
      and instructor_id is null
      and exists (select 1 from public.instructors i where i.user_id = auth.uid() and i.subjects @> array[questions.subject])
      and not exists (
        select 1 from public.question_declines d
        where d.question_id = questions.id and d.instructor_id = auth.uid()
      )
    )
  )
  with check (instructor_id = auth.uid());

-- Acik havuzdaki (henuz kimseye atanmamis) sorularin eklerini de gorebilsinler
drop policy "question_attachments_select" on public.question_attachments;
create policy "question_attachments_select" on public.question_attachments
  for select using (
    exists (
      select 1 from public.questions q
      where q.id = question_attachments.question_id
      and (
        q.student_id = auth.uid() or q.instructor_id = auth.uid() or public.is_admin()
        or (
          q.status = 'pending' and q.instructor_id is null
          and exists (select 1 from public.instructors i where i.user_id = auth.uid() and i.subjects @> array[q.subject])
          and not exists (select 1 from public.question_declines d where d.question_id = q.id and d.instructor_id = auth.uid())
        )
      )
    )
  );

drop policy "question_attachment_files_select" on storage.objects;
create policy "question_attachment_files_select" on storage.objects
  for select using (
    bucket_id = 'question-attachments'
    and exists (
      select 1 from public.questions q
      where q.id::text = (storage.foldername(name))[1]
      and (
        q.student_id = auth.uid() or q.instructor_id = auth.uid() or public.is_admin()
        or (
          q.status = 'pending' and q.instructor_id is null
          and exists (select 1 from public.instructors i where i.user_id = auth.uid() and i.subjects @> array[q.subject])
          and not exists (select 1 from public.question_declines d where d.question_id = q.id and d.instructor_id = auth.uid())
        )
      )
    )
  );

-- Soru sormak artik "soru kredisi" harciyor (deduct_credit_on_booking ile ayni desen)
create function public.deduct_question_credit()
returns trigger
language plpgsql security definer set search_path = public
as $$
declare balance integer;
begin
  select question_credit_balance into balance from public.students where user_id = new.student_id;
  if balance is null or balance < 1 then
    raise exception 'Soru kredin kalmadı, önce bir soru paketi satın almalısın';
  end if;
  update public.students set question_credit_balance = question_credit_balance - 1 where user_id = new.student_id;
  return new;
end;
$$;

create trigger trg_deduct_question_credit
  before insert on public.questions
  for each row execute function public.deduct_question_credit();

-- Satin alma tamamlaninca paketin turune gore dogru bakiyeye yaz
create or replace function public.grant_credits_on_purchase()
returns trigger
language plpgsql security definer set search_path = public
as $$
declare pkg_type text;
begin
  if new.status = 'completed' and (old.status is null or old.status <> 'completed') then
    select package_type into pkg_type from public.packages where id = new.package_id;
    if pkg_type = 'question' then
      update public.students set question_credit_balance = question_credit_balance + new.credits_granted
      where user_id = new.student_id;
    else
      update public.students set credit_balance = credit_balance + new.credits_granted
      where user_id = new.student_id;
    end if;
  end if;
  return new;
end;
$$;
