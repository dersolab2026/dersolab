-- DersoLab Sosyal Medya Gönderileri ve Ajan Veritabanı Tablosu
create table if not exists public.social_posts (
  id text primary key,
  title text not null,
  type text not null check (type in ('carousel', 'post', 'reels')),
  topic text not null,
  topic_label text not null,
  status text not null default 'draft' check (status in ('draft', 'approved', 'scheduled', 'published')),
  target_audience text default 'YKS (TYT/AYT)',
  caption text not null,
  hashtags jsonb default '[]'::jsonb,
  carousel_slides jsonb,
  single_post_data jsonb,
  reels_storyboard jsonb,
  scheduled_for timestamptz,
  published_at timestamptz,
  created_at timestamptz default timezone('utc'::text, now()) not null
);

-- RLS Politikaları: Yalnızca yöneticiler (admin) okuyabilir ve yazabilir
alter table public.social_posts enable row level security;

create policy "Adminler sosyal medya gönderilerini yönetebilir"
  on public.social_posts
  for all
  using (
    exists (
      select 1 from public.users
      where users.id = auth.uid()
      and users.role = 'admin'
    )
  );
