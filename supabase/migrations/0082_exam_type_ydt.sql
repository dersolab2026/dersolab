-- YDT (Yabanci Dil Testi) Netlerim'e eklendi. YDT, AYT'nin bir testi degil;
-- YKS'nin ucuncu oturumu ve Dil alanindaki aday AYT yerine YDT'ye giriyor.
-- Bu yuzden ayri bir sinav turu olarak tanimlaniyor.

alter table public.student_exam_results
  drop constraint if exists student_exam_results_exam_type_check;

alter table public.student_exam_results
  add constraint student_exam_results_exam_type_check
  check (exam_type in ('lgs', 'tyt', 'ayt', 'ydt', 'kpss', 'dgs', 'ales'));
