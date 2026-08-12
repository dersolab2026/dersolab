-- "Mezun" (lise bitmis, YKS'ye tekrar hazirlanan) ogrenciler icin sinif
-- secimine 13 degerini (Mezun) ekliyoruz. Constraint adi Postgres'in
-- otomatik verdigi isim olabilecegi icin dinamik buluyoruz.

do $$
declare
  v_constraint_name text;
begin
  select conname into v_constraint_name
  from pg_constraint
  where conrelid = 'public.students'::regclass
    and pg_get_constraintdef(oid) ilike '%grade%'
    and contype = 'c';

  if v_constraint_name is not null then
    execute format('alter table public.students drop constraint %I', v_constraint_name);
  end if;

  alter table public.students add constraint students_grade_check check (grade between 5 and 13);
end $$;
