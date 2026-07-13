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
  price_usd       numeric(10,2),
  is_featured     boolean not null default false,
  is_sponsored    boolean not null default false,
  sort_order      integer not null default 0,
  seo_description text,
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

-- ── phone_specs (one row per phone) ───────────────────────────────────
create table if not exists phone_specs (
  id               uuid primary key default gen_random_uuid(),
  phone_id         uuid not null unique references phones(id) on delete cascade,
  network_type     text,        -- '2G' | '3G' | '4G' | '5G'
  os               text,        -- 'Android' | 'iOS' | 'Feature Phone' | 'Windows'
  ram_gb           integer,
  storage_gb       integer,
  display_size     numeric(4,2),  -- inches
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

-- ── user_profiles ─────────────────────────────────────────────────────
create table if not exists user_profiles (
  id        uuid primary key references auth.users(id) on delete cascade,
  role      text not null default 'editor' check (role in ('admin', 'editor')),
  full_name text
);

-- ── site_settings ──────────────────────────────────────────────────────
create table if not exists site_settings (
  key   text primary key,
  value jsonb
);

-- ── contact_messages ──────────────────────────────────────────────────
create table if not exists contact_messages (
  id         uuid primary key default gen_random_uuid(),
  name       text not null,
  email      text not null,
  message    text not null,
  created_at timestamptz not null default now()
);

-- ═══════════════════════════════════════════════════════════════════════
-- Indexes
-- ═══════════════════════════════════════════════════════════════════════
create index if not exists idx_phones_brand_id        on phones (brand_id);
create index if not exists idx_phones_price_pkr        on phones (price_pkr);
create index if not exists idx_specs_network_type       on phone_specs (network_type);
create index if not exists idx_specs_ram_gb             on phone_specs (ram_gb);
create index if not exists idx_specs_main_camera_mp     on phone_specs (main_camera_mp);
create index if not exists idx_specs_display_size       on phone_specs (display_size);
create index if not exists idx_specs_os                 on phone_specs (os);
create index if not exists idx_news_brand_id            on news (brand_id);
create index if not exists idx_news_published_at
  on news (published_at) where is_published = true;
create index if not exists idx_phones_name_trgm
  on phones using gin (name gin_trgm_ops);

-- ═══════════════════════════════════════════════════════════════════════
-- Row Level Security
-- ═══════════════════════════════════════════════════════════════════════
alter table brands            enable row level security;
alter table phones            enable row level security;
alter table phone_specs       enable row level security;
alter table phone_images      enable row level security;
alter table news              enable row level security;
alter table homepage_sections enable row level security;
alter table user_profiles     enable row level security;
alter table site_settings     enable row level security;
alter table contact_messages  enable row level security;

create policy "public read active brands" on brands
  for select using (is_active = true);

create policy "public read phones" on phones
  for select using (true);

create policy "public read phone_specs" on phone_specs
  for select using (true);

create policy "public read phone_images" on phone_images
  for select using (true);

create policy "public read published news" on news
  for select using (is_published = true);

create policy "public read active homepage_sections" on homepage_sections
  for select using (is_active = true);

create policy "users read own profile" on user_profiles
  for select using (auth.uid() = id);

create policy "public read site_settings" on site_settings
  for select using (true);

-- ═══════════════════════════════════════════════════════════════════════
-- Seed data: homepage sections + brands
-- ═══════════════════════════════════════════════════════════════════════
insert into homepage_sections (section_key, title, is_active) values
  ('featured_slider',  'Featured Phones',        true),
  ('latest_phones',    'Latest Phones',           true),
  ('price_5k_10k',     'Best Phones Rs. 5,000 - 10,000', true),
  ('price_10k_25k',    'Best Phones Rs. 10,000 - 25,000', true),
  ('price_25k_plus',   'Best Phones Above Rs. 25,000',    true),
  ('coming_soon',      'Coming Soon',             true)
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