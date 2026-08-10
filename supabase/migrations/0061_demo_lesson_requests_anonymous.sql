alter table public.demo_lesson_requests
  alter column student_id drop not null,
  alter column requested_by drop not null,
  add column lead_name text,
  add column lead_email text,
  add constraint demo_lesson_requests_student_or_lead check (
    student_id is not null or (lead_name is not null and lead_email is not null)
  );
