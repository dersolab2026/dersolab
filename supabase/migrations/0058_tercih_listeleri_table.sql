create table public.tercih_listeleri (
  id uuid primary key default gen_random_uuid(),
  sender_id uuid not null references public.users(id) on delete cascade,
  recipient_id uuid not null references public.users(id) on delete cascade,
  file_path text not null,
  program_count integer not null,
  created_at timestamptz not null default now()
);

alter table public.tercih_listeleri enable row level security;

create policy "tercih_listeleri_select" on public.tercih_listeleri
  for select using (sender_id = auth.uid() or recipient_id = auth.uid() or public.is_admin());
