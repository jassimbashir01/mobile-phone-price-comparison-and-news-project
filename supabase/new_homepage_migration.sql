-- Undo the previous turn's mistake — those sections reused the sidebar's
-- price ranges instead of a dedicated homepage set.
delete from homepage_sections where section_key in (
  'price_below_5000', 'price_5000_10000', 'price_10000_15000',
  'price_15000_25000', 'price_25000_35000', 'price_35000_45000', 'price_above_45000'
);

-- One section per homepage-specific bracket, each with its own dedicated
-- /price-range/[range] page.
insert into homepage_sections (section_key, title, is_active) values
  ('home_price_below_10k', 'Best Phones Below Rs. 10,000',    true),
  ('home_price_10k_20k',   'Best Phones Rs. 10,000 - 20,000', true),
  ('home_price_20k_30k',   'Best Phones Rs. 20,000 - 30,000', true),
  ('home_price_30k_40k',   'Best Phones Rs. 30,000 - 40,000', true),
  ('home_price_40k_50k',   'Best Phones Rs. 40,000 - 50,000', true),
  ('home_price_above_50k', 'Best Phones Above Rs. 50,000',    true)
on conflict (section_key) do nothing;

-- Sponsored feature removal
alter table phones drop column if exists is_sponsored;