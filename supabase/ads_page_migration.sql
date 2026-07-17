alter table contact_messages add column if not exists inquiry_type text not null default 'general';

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