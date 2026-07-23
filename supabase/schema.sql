-- ═══════════════════════════════════════════════════════════════════════
-- MobileWala — complete database schema, current state
-- Reconstructed from a live schema audit (information_schema.columns) +
-- everything confirmed throughout the project's build/review history.
-- Run this against a fresh Supabase project to recreate the exact current
-- database. See the verification checklist at the bottom before trusting
-- this as the sole source of truth going forward.
-- ═══════════════════════════════════════════════════════════════════════

create extension if not exists pgcrypto;
create extension if not exists pg_trgm;

-- ── brands ─────────────────────────────────────────────────────────────
create table if not exists brands (
  id          uuid primary key default gen_random_uuid(),
  name        text not null,
  slug        text not null unique,
  logo_url    text,
  description text,
  is_active   boolean not null default true,
  created_at  timestamptz not null default now()
);

-- ── phones ─────────────────────────────────────────────────────────────
create table if not exists phones (
  id              uuid primary key default gen_random_uuid(),
  brand_id        uuid not null references brands(id) on delete restrict,
  name            text not null,
  slug            text not null unique,
  status          text not null default 'available'
                    check (status in ('available', 'coming_soon', 'discontinued')),
  price_pkr       integer,
  is_featured     boolean not null default false,
  sort_order      integer not null default 0,
  seo_description text,
  overview        text,
  description     text,
  created_at      timestamptz not null default now(),
  updated_at      timestamptz not null default now()
);

create or replace function set_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

drop trigger if exists phones_set_updated_at on phones;
create trigger phones_set_updated_at
  before update on phones
  for each row execute function set_updated_at();

-- ── phone_specs — fixed, filtering-only fields. Never rendered publicly.
create table if not exists phone_specs (
  id               uuid primary key default gen_random_uuid(),
  phone_id         uuid not null unique references phones(id) on delete cascade,
  network_type     text,
  os               text,
  ram_gb           integer,
  storage_gb       integer,
  display_size     numeric(4,2),
  main_camera_mp   numeric(6,2),
  battery_mah      integer,
  processor        text,
  display_type     text,
  bluetooth        boolean not null default false,
  wifi             boolean not null default false,
  dual_sim         boolean not null default false,
  fm_radio         boolean not null default false,
  memory_card      boolean not null default false,
  mp3              boolean not null default false,
  video_recording  boolean not null default false,
  has_camera       boolean not null default false,
  build            jsonb not null default '{}',
  connectivity     jsonb not null default '{}',
  features         jsonb not null default '{}'
);

-- ── phone_images ───────────────────────────────────────────────────────
create table if not exists phone_images (
  id                   uuid primary key default gen_random_uuid(),
  phone_id             uuid not null references phones(id) on delete cascade,
  cloudinary_public_id text not null,
  is_primary           boolean not null default false,
  sort_order           integer not null default 0
);

-- ── phone_extended_specs — the rich, admin-authored, public-facing spec
-- table. One text column per row shown on the phone page. Blank = hidden.
create table if not exists phone_extended_specs (
  id                      uuid primary key default gen_random_uuid(),
  phone_id                uuid not null unique references phones(id) on delete cascade,

  -- Build
  build_os                text,
  build_ui                text,
  build_dimensions        text,
  build_weight            text,
  build_sim               text,
  build_colors            text,
  build_extra             text,

  -- Frequency
  freq_2g                 text,
  freq_3g                 text,
  freq_4g                 text,
  freq_5g                 text,
  freq_extra              text,

  -- Processor
  proc_cpu                text,
  proc_chipset            text,
  proc_gpu                text,
  proc_extra              text,

  -- Display
  display_technology      text,
  display_size            text,
  display_resolution      text,
  display_protection      text,
  display_extra_features  text,

  -- Memory
  memory_built_in         text,
  memory_card             text,
  memory_extra            text,

  -- Camera
  camera_main             text,
  camera_features         text,
  camera_front             text,
  camera_extra            text,

  -- Connectivity
  conn_wlan               text,
  conn_bluetooth          text,
  conn_gps                text,
  conn_radio              text,
  conn_usb                text,
  conn_nfc                text,
  conn_infrared           text,
  conn_data               text,
  conn_extra               text,

  -- Features
  feat_sensors             text,
  feat_audio               text,
  feat_browser             text,
  feat_messaging           text,
  feat_games                text,
  feat_torch                text,
  feat_extra                text,

  -- Battery
  battery_charging          text,
  battery_extra              text
);

-- ── news ───────────────────────────────────────────────────────────────
create table if not exists news (
  id                     uuid primary key default gen_random_uuid(),
  brand_id               uuid references brands(id) on delete set null,
  title                  text not null,
  slug                   text not null unique,
  excerpt                text,
  body                   text,
  cover_image_public_id  text,
  published_at           timestamptz,
  is_published           boolean not null default false
);

-- ── homepage_sections ─────────────────────────────────────────────────
create table if not exists homepage_sections (
  id          uuid primary key default gen_random_uuid(),
  section_key text not null unique,
  title       text,
  phone_ids   uuid[] not null default '{}',
  is_active   boolean not null default true
);

-- ── offers — affiliate deals and local shop listings ────────────────────
create table if not exists offers (
  id                  uuid primary key default gen_random_uuid(),
  offer_type          text not null check (offer_type in ('affiliate', 'local_deal')),
  title               text not null,
  description         text,
  image_public_id     text,
  destination_url     text not null,
  price_pkr           integer,
  original_price_pkr  integer,
  shop_name           text,
  shop_location       text,
  is_active           boolean not null default true,
  sort_order          integer not null default 0,
  expires_at          timestamptz,
  created_at          timestamptz not null default now()
);

-- ── user_profiles ─────────────────────────────────────────────────────
create table if not exists user_profiles (
  id        uuid primary key references auth.users(id) on delete cascade,
  role      text not null default 'editor' check (role in ('admin', 'editor')),
  full_name text
);

-- ── site_settings — exchange rate, social links, banners, media kit stats
create table if not exists site_settings (
  key   text primary key,
  value jsonb
);

-- ── contact_messages — from both the contact form and advertise form ────
create table if not exists contact_messages (
  id          uuid primary key default gen_random_uuid(),
  name        text not null,
  email       text not null,
  message     text not null,
  created_at  timestamptz not null default now(),
  inquiry_type text not null default 'general',
  is_read      boolean not null default false
);

-- ═══════════════════════════════════════════════════════════════════════
-- Indexes
-- ═══════════════════════════════════════════════════════════════════════
create index if not exists idx_phones_brand_id            on phones (brand_id);
create index if not exists idx_phones_price_pkr            on phones (price_pkr);
create index if not exists idx_specs_network_type          on phone_specs (network_type);
create index if not exists idx_specs_ram_gb                on phone_specs (ram_gb);
create index if not exists idx_specs_main_camera_mp        on phone_specs (main_camera_mp);
create index if not exists idx_specs_display_size          on phone_specs (display_size);
create index if not exists idx_specs_os                    on phone_specs (os);
create index if not exists idx_news_brand_id                on news (brand_id);
create index if not exists idx_news_published_at
  on news (published_at) where is_published = true;
create index if not exists idx_phones_name_trgm
  on phones using gin (name gin_trgm_ops);
create index if not exists idx_phone_images_phone_id        on phone_images (phone_id);
create index if not exists idx_phone_extended_specs_phone   on phone_extended_specs (phone_id);
create index if not exists idx_offers_type_active           on offers (offer_type, is_active);

-- ═══════════════════════════════════════════════════════════════════════
-- Fuzzy phone search RPC — powers multi-word search matching
-- ═══════════════════════════════════════════════════════════════════════
create or replace function search_phones(search_query text, result_limit int default 20, result_offset int default 0)
returns table (id uuid, total_count bigint)
language sql
stable
as $$
  with terms as (
    select unnest(string_to_array(trim(search_query), ' ')) as term
  ),
  matched as (
    select p.id, similarity(p.name, search_query) as sim, p.sort_order
    from phones p
    join brands b on b.id = p.brand_id
    where (
      select bool_and((p.name || ' ' || b.name) ilike '%' || term || '%')
      from terms
      where term != ''
    )
  )
  select id, count(*) over() as total_count
  from matched
  order by sim desc, sort_order asc
  limit result_limit offset result_offset;
$$;

-- ═══════════════════════════════════════════════════════════════════════
-- Row Level Security
-- ═══════════════════════════════════════════════════════════════════════
alter table brands                enable row level security;
alter table phones                enable row level security;
alter table phone_specs           enable row level security;
alter table phone_images          enable row level security;
alter table phone_extended_specs  enable row level security;
alter table news                  enable row level security;
alter table homepage_sections     enable row level security;
alter table offers                enable row level security;
alter table user_profiles         enable row level security;
alter table site_settings         enable row level security;
alter table contact_messages      enable row level security;

-- Public (anon) read access to publicly-visible rows only. All writes go
-- through server actions using the secret-key admin client, which
-- bypasses RLS entirely — role checks (requireRole) are enforced there,
-- not here.
create policy "public read active brands" on brands
  for select using (is_active = true);

create policy "public read phones" on phones
  for select using (true);

create policy "public read phone_specs" on phone_specs
  for select using (true);

create policy "public read phone_images" on phone_images
  for select using (true);

create policy "public read phone_extended_specs" on phone_extended_specs
  for select using (true);

create policy "public read published news" on news
  for select using (is_published = true);

create policy "public read active homepage_sections" on homepage_sections
  for select using (is_active = true);

create policy "public read active non-expired offers" on offers
  for select using (is_active = true and (expires_at is null or expires_at > now()));

create policy "users read own profile" on user_profiles
  for select using (auth.uid() = id);

create policy "public read site_settings" on site_settings
  for select using (true);

-- contact_messages: deliberately no public read/write policy at all —
-- both the contact form and advertise form insert through the secret-key
-- admin client server-side, never directly from the browser.

-- ═══════════════════════════════════════════════════════════════════════
-- Seed data
-- ═══════════════════════════════════════════════════════════════════════
insert into homepage_sections (section_key, title, is_active) values
  ('featured_slider',      'Featured Phones',                 true),
  ('latest_phones',        'Latest Phones',                    true),
  ('coming_soon',          'Coming Soon',                      true),
  ('home_price_below_20k', 'Best Phones Below Rs. 20,000',     true),
  ('home_price_20k_30k',   'Best Phones Rs. 20,000 - 30,000',  true),
  ('home_price_30k_40k',   'Best Phones Rs. 30,000 - 40,000',  true),
  ('home_price_40k_50k',   'Best Phones Rs. 40,000 - 50,000',  true),
  ('home_price_50k_100k',  'Best Phones Rs. 50,000 - 100,000', true),
  ('home_price_above_100k','Best Phones Above Rs. 100,000',    true)
on conflict (section_key) do nothing;

insert into brands (name, slug, description, is_active) values
  ('Samsung', 'samsung', 'Samsung mobile phones and prices in Pakistan.', true),
  ('Apple',   'apple',   'Apple iPhone prices and specifications in Pakistan.', true),
  ('Xiaomi',  'xiaomi',  'Xiaomi and Redmi phones prices in Pakistan.', true),
  ('Vivo',    'vivo',    'Vivo mobile phones and prices in Pakistan.', true),
  ('Oppo',    'oppo',    'Oppo mobile phones and prices in Pakistan.', true),
  ('Realme',  'realme',  'Realme mobile phones and prices in Pakistan.', true),
  ('Infinix', 'infinix', 'Infinix mobile phones and prices in Pakistan.', true),
  ('Tecno',   'tecno',   'Tecno mobile phones and prices in Pakistan.', true),
  ('Nokia',   'nokia',   'Nokia mobile and feature phones prices in Pakistan.', true),
  ('Huawei',  'huawei',  'Huawei mobile phones and prices in Pakistan.', true)
on conflict (slug) do nothing;

insert into site_settings (key, value) values
  ('usd_exchange_rate', '{"rate": 280}'::jsonb)
on conflict (key) do nothing;

insert into site_settings (key, value) values (
  'social_links',
  '[
    {"platform": "facebook", "url": "", "enabled": false},
    {"platform": "instagram", "url": "", "enabled": false},
    {"platform": "twitter", "url": "", "enabled": false},
    {"platform": "youtube", "url": "", "enabled": false},
    {"platform": "tiktok", "url": "", "enabled": false},
    {"platform": "whatsapp", "url": "", "enabled": false}
  ]'::jsonb
) on conflict (key) do nothing;

insert into site_settings (key, value) values (
  'media_kit_stats',
  '{
    "monthly_visitors": "Add your traffic number in Admin → Settings",
    "monthly_pageviews": "Add your pageview number in Admin → Settings",
    "avg_session_duration": "Add your average session duration",
    "top_regions": "Add your top regions",
    "audience_description": "Add a short description of your typical visitor"
  }'::jsonb
) on conflict (key) do nothing;

insert into site_settings (key, value) values (
  'homepage_banner',
  '{"cloudinary_public_id": "", "link_url": "", "alt_text": "", "enabled": false}'::jsonb
) on conflict (key) do nothing;

insert into site_settings (key, value) values (
  'sidebar_banner',
  '{"cloudinary_public_id": "", "link_url": "", "alt_text": "", "enabled": false}'::jsonb
) on conflict (key) do nothing;