-- Kayit formuna okul adi, sinif ve (YKS ogrencileri icin) alan/brans eklendi.

create type public.student_track as enum ('sayisal', 'sozel', 'ea', 'dil');

alter table public.students
  add column school_name text,
  add column grade smallint check (grade between 5 and 12),
  add column track public.student_track;

create or replace function public.handle_new_user()
returns trigger
language plpgsql security definer set search_path = public
as $$
declare
  v_role user_role;
begin
  v_role := coalesce((new.raw_user_meta_data->>'role')::user_role, 'student');

  insert into public.users (id, role, name, email)
  values (new.id, v_role, coalesce(new.raw_user_meta_data->>'name', ''), new.email);

  if v_role = 'student' then
    insert into public.students (user_id, grade_track, school_name, grade, track)
    values (
      new.id,
      coalesce((new.raw_user_meta_data->>'grade_track')::grade_track, 'yks'),
      nullif(new.raw_user_meta_data->>'school_name', ''),
      (new.raw_user_meta_data->>'grade')::smallint,
      (new.raw_user_meta_data->>'track')::student_track
    );
  elsif v_role = 'instructor' then
    insert into public.instructors (user_id)
    values (new.id);
  end if;

  return new;
end;
$$;
