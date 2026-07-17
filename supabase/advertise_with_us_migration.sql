insert into site_settings (key, value) values (
  'sidebar_banner',
  '{"cloudinary_public_id": "", "link_url": "", "alt_text": "", "enabled": false}'::jsonb
) on conflict (key) do nothing;

insert into site_settings (key, value) values (
  'brand_showcase',
  '{"brand_ids": [], "enabled": false}'::jsonb
) on conflict (key) do nothing;