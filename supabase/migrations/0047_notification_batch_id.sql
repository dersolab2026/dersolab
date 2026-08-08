alter table public.notifications add column batch_id uuid;
create index notifications_batch_id_idx on public.notifications (batch_id) where batch_id is not null;
