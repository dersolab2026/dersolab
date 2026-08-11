-- Soru-cevap ozelligi (hem eski egitmene-yonelik hali hem yeni acik havuz
-- hali) urun kararryla tamamen kaldirildi. questions/question_attachments/
-- question_declines tablolarinda veri yoktu (dogrulandi), guvenle dusuruluyor.

drop trigger if exists trg_deduct_question_credit on public.questions;
drop function if exists public.deduct_question_credit();

drop policy if exists "question_attachment_files_insert" on storage.objects;
drop policy if exists "question_attachment_files_select" on storage.objects;
-- storage.buckets satirini SQL'den silmek yasak (Storage API kullanilmali);
-- bucket'i migration'dan sonra admin client'in storage.deleteBucket()'i ile kaldiracagiz.

-- question_declines'a questions/question_attachments/storage.objects
-- politikalarindan capraz referans var (acik havuz kontrolleri), bu yuzden
-- cascade gerekiyor; veri olmadigi zaten dogrulandi.
drop table if exists public.question_declines cascade;
drop table if exists public.question_attachments cascade;
drop table if exists public.questions cascade;

alter table public.students drop column question_credit_balance;
alter table public.packages drop column package_type;

-- Satin alma tamamlaninca artik tek bir kredi turu var, 0067'den once kullanilan
-- basit haline donduruluyor.
create or replace function public.grant_credits_on_purchase()
returns trigger
language plpgsql security definer set search_path = public
as $$
begin
  if new.status = 'completed' and (old.status is null or old.status <> 'completed') then
    update public.students set credit_balance = credit_balance + new.credits_granted
    where user_id = new.student_id;
  end if;
  return new;
end;
$$;
