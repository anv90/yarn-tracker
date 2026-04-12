-- SQL Dump: Yarn tracker schema (PostgreSQL)
-- Date: 2026-04-04

BEGIN;

-- Drop in dependency order
DROP TABLE IF EXISTS finished_projects;
DROP TABLE IF EXISTS patterns;
DROP TABLE IF EXISTS yarn_stash;
DROP TABLE IF EXISTS yarn_products;
DROP TABLE IF EXISTS brand_lookup;
DROP TABLE IF EXISTS fiber_lookup;
DROP TABLE IF EXISTS weight_lookup;

-- ----------------------------
-- Category / Lookup Tables
-- ----------------------------

CREATE TABLE weight_lookup (
  weight_id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  name VARCHAR(255) NOT NULL UNIQUE
);

CREATE TABLE fiber_lookup (
  fiber_id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  name VARCHAR(255) NOT NULL UNIQUE
);

CREATE TABLE brand_lookup (
  brand_id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  name VARCHAR(255) NOT NULL UNIQUE
);

-- ----------------------------
-- Object Tables
-- ----------------------------

CREATE TABLE yarn_products (
  product_id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  brand_id BIGINT NOT NULL,
  name VARCHAR(255) NOT NULL,
  weight_id BIGINT NOT NULL,
  fiber_id BIGINT NOT NULL,

  CONSTRAINT fk_yarn_products_brand
    FOREIGN KEY (brand_id) REFERENCES brand_lookup (brand_id)
    ON DELETE CASCADE,

  CONSTRAINT fk_yarn_products_weight
    FOREIGN KEY (weight_id) REFERENCES weight_lookup (weight_id)
    ON DELETE CASCADE,

  CONSTRAINT fk_yarn_products_fiber
    FOREIGN KEY (fiber_id) REFERENCES fiber_lookup (fiber_id)
    ON DELETE CASCADE
);

CREATE TABLE yarn_stash (
  yarn_id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  product_id BIGINT NOT NULL,
  color VARCHAR(255) NOT NULL,
  yards INTEGER NOT NULL,

  CONSTRAINT fk_yarn_stash_product
    FOREIGN KEY (product_id) REFERENCES yarn_products (product_id)
    ON DELETE CASCADE
);

CREATE TABLE patterns (
  pattern_id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  link VARCHAR(2048) NOT NULL,
  recommended_weight_id BIGINT NOT NULL,
  yardage NUMERIC NOT NULL,

  CONSTRAINT fk_patterns_recommended_weight
    FOREIGN KEY (recommended_weight_id) REFERENCES weight_lookup (weight_id)
    ON DELETE CASCADE
);

-- ----------------------------
-- Intersection Table
-- ----------------------------

CREATE TABLE finished_projects (
  finished_project_id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  yarn_id BIGINT NOT NULL,
  pattern_id BIGINT NOT NULL,
  notes TEXT NULL,

  CONSTRAINT fk_finished_projects_yarn
    FOREIGN KEY (yarn_id) REFERENCES yarn_stash (yarn_id)
    ON DELETE CASCADE,

  CONSTRAINT fk_finished_projects_pattern
    FOREIGN KEY (pattern_id) REFERENCES patterns (pattern_id)
    ON DELETE CASCADE
);

-- Helpful indexes for joins (optional but recommended)
CREATE INDEX ix_yarn_products_brand_id ON yarn_products (brand_id);
CREATE INDEX ix_yarn_products_weight_id ON yarn_products (weight_id);
CREATE INDEX ix_yarn_products_fiber_id ON yarn_products (fiber_id);

CREATE INDEX ix_yarn_stash_product_id ON yarn_stash (product_id);

CREATE INDEX ix_patterns_recommended_weight_id ON patterns (recommended_weight_id);

CREATE INDEX ix_finished_projects_yarn_id ON finished_projects (yarn_id);
CREATE INDEX ix_finished_projects_pattern_id ON finished_projects (pattern_id);

COMMIT;