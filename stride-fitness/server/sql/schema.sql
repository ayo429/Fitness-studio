-- Stride Fitness schema. Safe to run more than once.

CREATE TABLE IF NOT EXISTS programs (
  id              SERIAL PRIMARY KEY,
  name            TEXT    NOT NULL UNIQUE,
  description     TEXT    NOT NULL,
  session_minutes INTEGER NOT NULL,
  days_per_week   INTEGER NOT NULL,
  is_featured     BOOLEAN NOT NULL DEFAULT false,
  sort_order      INTEGER NOT NULL DEFAULT 0
);

CREATE TABLE IF NOT EXISTS plans (
  id            SERIAL PRIMARY KEY,
  name          TEXT    NOT NULL UNIQUE,
  price_monthly INTEGER NOT NULL,          -- whole dollars
  is_featured   BOOLEAN NOT NULL DEFAULT false,
  sort_order    INTEGER NOT NULL DEFAULT 0
);

CREATE TABLE IF NOT EXISTS plan_features (
  id         SERIAL PRIMARY KEY,
  plan_id    INTEGER NOT NULL REFERENCES plans(id) ON DELETE CASCADE,
  text       TEXT    NOT NULL,
  sort_order INTEGER NOT NULL DEFAULT 0
);

CREATE TABLE IF NOT EXISTS leads (
  id         SERIAL PRIMARY KEY,
  email      TEXT NOT NULL,
  plan_id    INTEGER REFERENCES plans(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- One row per member: the plan they are on right now.
-- user_id points at the "user" table that Better Auth created, so on a brand-new
-- database the auth migration (npx auth@latest migrate) must run before this file.
-- UNIQUE on user_id means a member can only be on one plan at a time.
-- Deleting a user deletes their membership; a plan that has members cannot be deleted.
CREATE TABLE IF NOT EXISTS memberships (
  id        SERIAL PRIMARY KEY,
  user_id   TEXT NOT NULL UNIQUE REFERENCES "user"(id) ON DELETE CASCADE,
  plan_id   INTEGER NOT NULL REFERENCES plans(id),
  chosen_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
