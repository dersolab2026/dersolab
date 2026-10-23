-- DersoLab Sosyal Medya Ajanı: Story ve TikTok / Çoklu Platform Genişletmesi
alter table public.social_posts
  drop constraint if exists social_posts_type_check;

alter table public.social_posts
  add constraint social_posts_type_check
  check (type in ('carousel', 'post', 'reels', 'story', 'x_thread'));

-- Hedef platform kolonu: instagram, tiktok, both (her ikisi)
alter table public.social_posts
  add column if not exists platform text default 'both';

-- Hikaye (Story) özel içerik verileri (9:16 formatı, interaktif etiketler vb.)
alter table public.social_posts
  add column if not exists story_data jsonb;

-- Çift platform yayın sonuçları (Instagram URL, TikTok URL, ID vb.)
alter table public.social_posts
  add column if not exists publish_metadata jsonb default '{}'::jsonb;
