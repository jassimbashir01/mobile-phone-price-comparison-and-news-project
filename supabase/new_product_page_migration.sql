-- Rich content fields for the new page structure
alter table phones add column if not exists overview text;
alter table phones add column if not exists description text;

-- price_usd is being replaced by live conversion from a site-wide rate —
-- no more manually re-entering USD per phone every time the rate moves
alter table phones drop column if exists price_usd;

-- Site-wide exchange rate, admin-editable. Uses the site_settings table
-- that already existed in the schema from the very first migration.
insert into site_settings (key, value) values ('usd_exchange_rate', '{"rate": 280}'::jsonb)
on conflict (key) do nothing;

-- Site's own social media presence — also stored here rather than a new
-- table, since it's a single small config blob, not relational data.
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