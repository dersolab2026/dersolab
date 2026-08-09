create table public.yok_atlas_programs (
  id uuid primary key default gen_random_uuid(),
  kilavuz_kodu bigint not null unique,
  yil smallint not null,
  universite_id integer not null,
  universite_adi text not null,
  universite_turu text,
  il_adi text,
  ilce_adi text,
  fakulte_adi text,
  birim_adi text not null,
  birim_grup_adi text,
  birim_turu_adi text,
  ogrenim_turu_adi text,
  ogrenim_dili_adi text,
  ogrenim_suresi smallint,
  puan_turu text,
  kontenjan integer,
  ucret numeric(12,2),
  min_puan numeric(10,5),
  basari_sirasi integer,
  min_puan_1 numeric(10,5),
  basari_sirasi_1 integer,
  min_puan_2 numeric(10,5),
  basari_sirasi_2 integer,
  min_puan_3 numeric(10,5),
  basari_sirasi_3 integer,
  synced_at timestamptz not null default now()
);

create index yok_atlas_programs_puan_turu_idx on public.yok_atlas_programs (puan_turu);
create index yok_atlas_programs_basari_sirasi_idx on public.yok_atlas_programs (basari_sirasi);
create index yok_atlas_programs_il_adi_idx on public.yok_atlas_programs (il_adi);
create index yok_atlas_programs_birim_grup_adi_idx on public.yok_atlas_programs (birim_grup_adi);

alter table public.yok_atlas_programs enable row level security;

create policy "yok_atlas_programs_public_select" on public.yok_atlas_programs
  for select using (true);
