-- Google ile kaydolan kullanıcı hesap türünü seçebilsin.
--
-- SORUN: Rol, kayıt formundan raw_user_meta_data ile geliyor ve
-- handle_new_user onu okuyor. Google ile girişte o metadata HİÇ gelmiyor,
-- dolayısıyla herkes sessizce 'student' oluyordu. Bu yüzden kayıt
-- formunda "Google ile Kaydol" düğmesi yalnızca Öğrenci seçiliyken
-- gösteriliyordu — eğitmen ve veli Google ile kaydolamıyordu.
--
-- ÇÖZÜM: Rolün onaylanıp onaylanmadığını işaretliyoruz. Metadata'dan rol
-- geldiyse (e-posta kaydı) onaylı sayılıyor; gelmediyse (OAuth) kullanıcı
-- ilk girişte hesap türü sayfasına yönlendiriliyor. Tahmin etmiyoruz,
-- soruyoruz — /terms/accept ile aynı desen.
--
-- ROL DEĞİŞTİRME BURADA DEĞİL: prevent_role_change (0048) kullanıcının
-- kendi rolünü değiştirmesini engelliyor ve bu koruma OLDUĞU GİBİ
-- KALIYOR. Geçiş, kendi yetki kontrolünü yapan bir sunucu aksiyonundan
-- admin istemcisiyle yapılıyor (auth.role() = 'service_role', tetikleyici
-- izin veriyor). Tek kullanımlık: role_confirmed true olunca kapanıyor.

alter table public.users
  add column if not exists role_confirmed boolean not null default true;

-- E-posta kaydı rolü metadata ile gönderiyor -> onaylı.
-- OAuth göndermiyor -> onaysız, hesap türü sorulacak.
create or replace function public.handle_new_user()
returns trigger
language plpgsql security definer set search_path = public
as $$
declare
  v_role user_role;
  v_requested_role text;
  v_rol_geldi boolean;
  v_grade smallint;
  v_track student_track;
begin
  v_requested_role := new.raw_user_meta_data->>'role';

  -- coalesce SART: OAuth'ta rol metadata'si hic gelmiyor ve SQL'de
  -- NULL in (...) sonucu false degil NULL. Coalesce olmadan role_confirmed
  -- NULL oluyor ve not-null kisitina takilip Google kaydini komple
  -- kiriyor. (Testte yakalandi.)
  v_rol_geldi := coalesce(v_requested_role in ('student', 'instructor', 'parent'), false);

  v_role := case
    when v_rol_geldi then v_requested_role::user_role
    else 'student'
  end;

  if (new.raw_user_meta_data->>'grade') ~ '^(?:[5-9]|1[0-3])$' then
    v_grade := (new.raw_user_meta_data->>'grade')::smallint;
  end if;

  if (new.raw_user_meta_data->>'track') in ('sayisal', 'sozel', 'ea', 'dil') then
    v_track := (new.raw_user_meta_data->>'track')::student_track;
  end if;

  insert into public.users (id, role, name, email, role_confirmed)
  values (
    new.id,
    v_role,
    coalesce(new.raw_user_meta_data->>'name', ''),
    new.email,
    v_rol_geldi
  );

  if v_role = 'student' then
    insert into public.students (user_id, grade_track, school_name, grade, track)
    values (
      new.id,
      case when new.raw_user_meta_data->>'grade_track' = 'lgs' then 'lgs'::grade_track else 'yks'::grade_track end,
      nullif(left(new.raw_user_meta_data->>'school_name', 120), ''),
      v_grade,
      v_track
    );
  elsif v_role = 'instructor' then
    insert into public.instructors (user_id)
    values (new.id);
  end if;

  if new.raw_user_meta_data->>'terms_version' = '2026-08-07' then
    insert into public.terms_acceptances (user_id, terms_version, acceptance_source)
    values (new.id, '2026-08-07', 'email_signup')
    on conflict (user_id, terms_version) do nothing;
  end if;

  return new;
end;
$$;

-- Mevcut hesaplar etkilenmiyor: kolonun varsayılanı true, yani hepsi
-- onaylı sayılıyor ve kimse hesap türü sayfasına düşmüyor.
