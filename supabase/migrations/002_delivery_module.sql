-- DELIVERY STAFF TABLE
CREATE TABLE IF NOT EXISTS delivery_staff (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name            VARCHAR(100) NOT NULL,
  mobile          VARCHAR(10) UNIQUE NOT NULL,
  password_hash   VARCHAR(255) NOT NULL,
  email           VARCHAR(200),
  vehicle_number  VARCHAR(20),
  is_active       BOOLEAN DEFAULT true,
  is_available    BOOLEAN DEFAULT true,
  created_at      TIMESTAMPTZ DEFAULT now(),
  updated_at      TIMESTAMPTZ DEFAULT now()
);

-- DAILY DELIVERIES TABLE
-- One record per customer per day
CREATE TABLE IF NOT EXISTS daily_deliveries (
  id                  UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  delivery_boy_id     UUID REFERENCES delivery_staff(id),
  subscription_id     UUID REFERENCES subscriptions(id) ON DELETE CASCADE,
  customer_id         UUID REFERENCES users(id) ON DELETE CASCADE,
  address_id          UUID REFERENCES addresses(id),
  delivery_date       DATE NOT NULL DEFAULT CURRENT_DATE,
  delivery_status     VARCHAR(30) DEFAULT 'pending',
  -- statuses: pending | out_for_delivery | delivered | failed | cancelled
  time_slot           VARCHAR(30) DEFAULT 'morning_6_8',
  -- slots: morning_6_8 | morning_8_10
  assigned_at         TIMESTAMPTZ DEFAULT now(),
  delivered_at        TIMESTAMPTZ,
  failed_reason       TEXT,
  delivery_notes      TEXT,
  delivered_by        UUID REFERENCES delivery_staff(id),
  delivery_lat        DECIMAL(10,8),
  delivery_lng        DECIMAL(11,8),
  created_at          TIMESTAMPTZ DEFAULT now(),
  updated_at          TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_daily_deliveries_date ON daily_deliveries(delivery_date);
CREATE INDEX IF NOT EXISTS idx_daily_deliveries_boy ON daily_deliveries(delivery_boy_id);
CREATE INDEX IF NOT EXISTS idx_daily_deliveries_status ON daily_deliveries(delivery_status);
CREATE UNIQUE INDEX IF NOT EXISTS idx_daily_deliveries_unique 
  ON daily_deliveries(subscription_id, delivery_date);

-- DELIVERY HISTORY TABLE
-- Archived completed delivery records
CREATE TABLE IF NOT EXISTS delivery_history (
  id                UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  daily_delivery_id UUID REFERENCES daily_deliveries(id),
  delivery_boy_id   UUID REFERENCES delivery_staff(id),
  customer_id       UUID REFERENCES users(id),
  subscription_id   UUID REFERENCES subscriptions(id),
  delivery_date     DATE NOT NULL,
  delivered_at      TIMESTAMPTZ,
  status            VARCHAR(30) NOT NULL,
  items_delivered   JSONB,
  address_snapshot  JSONB,
  notes             TEXT,
  created_at        TIMESTAMPTZ DEFAULT now()
);

-- ADD COLUMNS TO ADDRESSES TABLE (if not already present)
ALTER TABLE addresses 
  ADD COLUMN IF NOT EXISTS latitude  DECIMAL(10,8),
  ADD COLUMN IF NOT EXISTS longitude DECIMAL(11,8),
  ADD COLUMN IF NOT EXISTS house_number VARCHAR(50),
  ADD COLUMN IF NOT EXISTS street   VARCHAR(200),
  ADD COLUMN IF NOT EXISTS area     VARCHAR(200);

-- SEED: 1 default delivery boy (password: Delivery@1234)
INSERT INTO delivery_staff (name, mobile, password_hash, vehicle_number) 
VALUES ('Ravi Kumar', '8888888888', '$2a$10$kRCj3TWtIUyB.6RQjioIo.jJF3vKunerRAlhihdYglPlzx.Jx7P3m', 'TS09AB1234')
ON CONFLICT (mobile) DO UPDATE SET password_hash = '$2a$10$kRCj3TWtIUyB.6RQjioIo.jJF3vKunerRAlhihdYglPlzx.Jx7P3m';
