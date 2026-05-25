-- ============================================================
-- Seed data generated from Yarn_Library_-_Library.csv
-- ============================================================

BEGIN;

-- weight_lookup
INSERT INTO weight_lookup (name) VALUES
  ('0'),
  ('1'),
  ('2'),
  ('3'),
  ('4'),
  ('5'),
  ('6');

-- fiber_lookup
INSERT INTO fiber_lookup (name) VALUES
  ($$Acrylic$$),
  ($$Bamboo$$),
  ($$Cotton$$),
  ($$Milk Cotton$$),
  ($$Plush Chenille$$),
  ($$Wool$$);

-- brand_lookup
INSERT INTO brand_lookup (name) VALUES
  --($$24/7 Cotton$$),
  ($$Aunt Lydias$$),
  ($$Bernat$$),
  ($$Big Twist$$),
  ($$Caron$$),
  ($$Loops & Threads$$),
  ($$J&P Coats$$),
  ($$KC$$),
  --($$Liliarge$$),
  ($$Lily$$),
  --($$Lion Brand Mandala$$),
  --($$Lion Brand Respun$$),
  --($$Michaels$$),
  ($$Misc$$),
  ($$Red Heart$$),
  --($$Red Heart Super Saver$$),
  --($$Umissy$$),
  --($$Unknown$$),
  ($$Wool-Ease$$),
  ($$Lion Brand$$);

-- yarn_products
-- name reuses brand name as the product-line identifier
INSERT INTO yarn_products (brand_id, name, weight_id, fiber_id)
SELECT
  b.brand_id,
  v.product_name,
  w.weight_id,
  f.fiber_id
FROM (VALUES
  ($$Red Heart$$, $$Finger Loop$$, '6', $$Plush Chenille$$),
  ($$Loops & Threads$$, $$Impeccable$$, '4', $$Acrylic$$),
  ($$Caron$$, $$Simply Soft$$, '4', $$Acrylic$$),
  ($$Misc$$, $$Liliarge$$, '3', $$Milk Cotton$$), --check if can be null
  ($$Misc$$, $$Umissy$$, '3', $$Milk Cotton$$),
  ($$Misc$$, $$Scraps$$, '4', $$Acrylic$$),
  ($$Lion Brand$$, $$Anti-Pilling$$, '4', $$Acrylic$$),
  --($$Michaels$$, '5', $$Acrylic$$),
  ($$Big Twist$$, $$Plush$$, '6', $$Plush Chenille$$),
  ($$Red Heart$$, $$Super Saver$$, '4', $$Acrylic$$),
  ($$Lion Brand$$, $$24/7 Cotton$$, '4', $$Cotton$$),
  ($$Aunt Lydias$$, $$Classic 10$$, '0', $$Cotton$$),
  ($$Lion Brand$$, $$Mandala$$, '3', $$Acrylic$$),
  ($$Bernat$$, $$Blanket$$, '6', $$Plush Chenille$$),
  ($$Lion Brand$$, $$Wool-Ease$$, '6', $$Wool$$),
  ($$Lion Brand$$, $$Respun$$, '4', $$Acrylic$$),
  ($$Big Twist$$, $$Value$$, '4', $$Acrylic$$),
  ($$Lily$$, $$Sugar N Cream$$, '4', $$Cotton$$),
  ($$KC$$, $$PlaceholderCotton$$, '3', $$Cotton$$),
  ($$KC$$, $$PLaceholderBamboo$$, '4', $$Bamboo$$),
  ($$J&P Coats$$, $$PlaceholderThread$$, '0', $$Cotton$$)
  --($$Unknown$$, '0', $$Cotton$$)
) AS v(brand_name, product_name, weight_name, fiber_name)
JOIN brand_lookup  b ON b.name = v.brand_name
JOIN weight_lookup w ON w.name::text = v.weight_name
JOIN fiber_lookup  f ON f.name = v.fiber_name;

-- yarn_stash
INSERT INTO yarn_stash (product_id, color, yards)
SELECT
  p.product_id,
  v.color,
  v.yards
FROM (VALUES
  ($$Finger Loop$$, $$Teal$$, 0),
  ($$Impeccable$$, $$Red Hot$$, 0),
  ($$Impeccable$$, $$Lover Pink$$, 0),
  ($$Impeccable$$, $$Butter Yellow$$, 0),
  ($$Simply Soft$$, $$Sunshine$$, 0),
  ($$Liliarge$$, $$Fluorescent White$$, 0),
  ($$Umissy$$, $$Tan$$, 0),
  ($$Umissy$$, $$Lighter tan$$, 0),
  ($$Simply Soft$$, $$Plum Wine$$, 0),
  ($$Scraps$$, $$Pink$$, 0),
  ($$Simply Soft$$, $$Country Blue$$, 0),
  ($$Anti-Pilling$$,$$Turqoise Heather$$, 0),
  ($$Scraps$$, $$Blooooood$$, 0),
  ($$Impeccable$$, $$Brown$$, 0),
  ($$Impeccable$$,  $$Pale Gray$$, 0),
  ($$Anti-Pilling$$,  $$Lemonade$$, 0),
  ($$Plush$$,  $$Winter White$$, 191),
  ($$Super Saver$$,  $$Black$$, 0),
  ($$Super Saver$$,  $$Tan$$, 0),
  ($$24/7 Cotton$$, $$White$$, 0),
  ($$Super Saver$$, $$White$$, 0),
  ($$Anti-Pilling$$, $$Ivory$$, 0),
  ($$Aunt Lydias$$,  $$Periwinkle$$, 1050),
  ($$Mandala$$,  $$Cupid$$, 0),
  ($$Bernat Blanket$$,  $$fuschia$$, 0),
  ($$Wool-Ease$$, $$Starlight$$, 0),
  ($$Blanket$$,  $$School Bus Yellow$$, 220),
  ($$Wool-Ease$$,  $$Milk with Tea$$, 244),
  ($$Super Saver$$,  $$Burgundy$$, 364),
  ($$Respun$$,  $$Sahara$$, 658),
  ($$Super Saver$$, $$Light Gray$$, 364),
  ($$Value$$, $$Black$$, 380),
  ($$Super Saver$$,  $$Frosty Green$$, 364),
  ($$Respun$$,  $$Cider$$, 658),
  ($$Sugar N Cream$$,  $$Overcast$$, 190),
  ($$PlaceholderCotton$$, $$White Sands$$, 360),
  ($$PLaceholderBamboo$$,  $$Feather Gray$$, 135),
  ($$Sugar N Cream$$, $$Blue Jeans$$, 370),
  ($$Sugar N Cream$$, $$Bamboo$$, 370),
  ($$Sugar N Cream$$, $$Soft Ecru$$, 1348),
  ($$PlaceholderThread$$,  $$Shaded Brown$$, 750),
  ($$PlaceholderThread$$, $$Black$$, 0)
) AS v(product_name, color, yards)
JOIN yarn_products p ON p.name = v.product_name;

COMMIT;