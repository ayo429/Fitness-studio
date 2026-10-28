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

-- One row per purchase. Money is stored in cents (Stripe works in cents).
-- status starts as 'pending' and only the Stripe webhook may change it to 'paid'.
-- Orders are payment records, so deleting a user who has orders is blocked.
CREATE TABLE IF NOT EXISTS orders (
  id                SERIAL PRIMARY KEY,
  user_id           TEXT NOT NULL REFERENCES "user"(id),
  status            TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'paid', 'expired')),
  total_cents       INTEGER NOT NULL,
  currency          TEXT NOT NULL DEFAULT 'usd',
  stripe_session_id TEXT UNIQUE,
  created_at        TIMESTAMPTZ NOT NULL DEFAULT now(),
  paid_at           TIMESTAMPTZ
);

-- What was bought in each order. The plan name and price are copied in at the time
-- of purchase, so old orders still show what was really charged if a plan changes later.
CREATE TABLE IF NOT EXISTS order_items (
  id               SERIAL PRIMARY KEY,
  order_id         INTEGER NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
  plan_id          INTEGER REFERENCES plans(id) ON DELETE SET NULL,
  plan_name        TEXT    NOT NULL,
  unit_price_cents INTEGER NOT NULL,
  quantity         INTEGER NOT NULL DEFAULT 1
);