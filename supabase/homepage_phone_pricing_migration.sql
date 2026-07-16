-- Remove the old broad tiers (these never lined up with real category pages)
delete from homepage_sections where section_key in ('price_5k_10k', 'price_10k_25k', 'price_25k_plus');

-- One section per granular price bracket — now matches /price/[range] exactly,
-- which also fixes the "two tiers with no matching category page" gap
insert into homepage_sections (section_key, title, is_active) values
  ('price_below_5000',  'Best Phones Below Rs. 5,000',       true),
  ('price_5000_10000',  'Best Phones Rs. 5,000 - 10,000',     true),
  ('price_10000_15000', 'Best Phones Rs. 10,000 - 15,000',    true),
  ('price_15000_25000', 'Best Phones Rs. 15,000 - 25,000',    true),
  ('price_25000_35000', 'Best Phones Rs. 25,000 - 35,000',    true),
  ('price_35000_45000', 'Best Phones Rs. 35,000 - 45,000',    true),
  ('price_above_45000', 'Best Phones Above Rs. 45,000',       true)
on conflict (section_key) do nothing;