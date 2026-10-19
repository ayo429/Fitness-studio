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
