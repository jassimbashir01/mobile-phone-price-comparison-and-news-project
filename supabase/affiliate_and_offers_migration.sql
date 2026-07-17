create table if not exists offers (
  id                uuid primary key default gen_random_uuid(),
  offer_type        text not null check (offer_type in ('affiliate', 'local_deal')),
  title             text not null,
  description       text,
  image_public_id   text,
  destination_url   text not null,
  price_pkr         integer,
  original_price_pkr integer,
  shop_name         text,
  shop_location     text,
  is_active         boolean not null default true,
  sort_order        integer not null default 0,
  expires_at        timestamptz,
  created_at        timestamptz not null default now()
);

create index if not exists idx_offers_type_active on offers (offer_type, is_active);

alter table offers enable row level security;

create policy "public read active non-expired offers" on offers
  for select using (is_active = true and (expires_at is null or expires_at > now()));