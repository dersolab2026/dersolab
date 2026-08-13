-- Ogrenciler kayittan sonra kendi profil bilgilerini (okul/sinif/alan)
-- guncelleyemiyordu; bu RLS eksikligi yuzunden bir "Hesabim" sayfasi hic
-- kurulamamisti.

create policy "students_update_own" on public.students
  for update using (user_id = (select auth.uid()))
  with check (user_id = (select auth.uid()));
