-- Seans turu (ders / kocluk) simdiye kadar egitmenin brans listesinden tahmin
-- ediliyordu; hem ders hem kocluk veren egitmenlerde bu yanlis sonuc veriyor.
-- Artik turu rezervasyonun kendisinde tutuyoruz.

alter table public.bookings
  add column session_type text not null default 'lesson'
  check (session_type in ('lesson', 'coaching'));

-- Gecmis kayitlar: eski tahmin mantigi yalnizca tek bransi Kocluk olan
-- egitmenlerde dogru calisiyordu, o kayitlari koruyarak geri dolduruyoruz.
update public.bookings b
  set session_type = 'coaching'
  from public.instructors i
  where i.user_id = b.instructor_id
    and i.subjects = array['Koçluk']::text[];
