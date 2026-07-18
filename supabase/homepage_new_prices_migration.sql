delete from homepage_sections where section_key in (
  'home_price_below_10k', 'home_price_10k_20k', 'home_price_above_50k'
);

insert into homepage_sections (section_key, title, is_active) values
  ('home_price_below_20k', 'Best Phones Below Rs. 20,000',        true),
  ('home_price_50k_100k',  'Best Phones Rs. 50,000 - 100,000',    true),
  ('home_price_above_100k', 'Best Phones Above Rs. 100,000',      true)
on conflict (section_key) do nothing;