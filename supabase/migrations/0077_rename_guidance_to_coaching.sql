-- "Rehberlik" bransi "Kocluk" olarak yeniden adlandirildi ve dort koc eklendi.
-- Brans degerleri instructors.subjects dizisinde metin olarak tutuldugu icin
-- kod tarafindaki sabit degisikligiyle birlikte veriyi de guncellemek gerekiyor.

update public.instructors
  set subjects = array_replace(subjects, 'Rehberlik', 'Koçluk')
  where 'Rehberlik' = any(subjects);

-- Egemen, Selva, Nisa ve Gamze koc olarak ekleniyor (tekrar calistirilabilir).
update public.instructors i
  set subjects = array_append(i.subjects, 'Koçluk')
  from public.users u
  where u.id = i.user_id
    and u.email in (
      'egemen.isik@hotmail.com',
      'aselvasahin@gmail.com',
      'nisakaraalioglu@gmail.com',
      'gmzbdk4199@gmail.com'
    )
    and not ('Koçluk' = any(i.subjects));
