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
    insert into public.students (user_id, grade_track)
    values (new.id, coalesce((new.raw_user_meta_data->>'grade_track')::grade_track, 'yks'));
  elsif v_role = 'instructor' then
    insert into public.instructors (user_id)
    values (new.id);
  end if;

  return new;
end;
$$;
