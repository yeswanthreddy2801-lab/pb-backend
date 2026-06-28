-- USERS
CREATE TABLE users (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  mobile        VARCHAR(10) UNIQUE NOT NULL,
  name          VARCHAR(100),
  email         VARCHAR(200),
  is_active     BOOLEAN DEFAULT true,
  is_new_user   BOOLEAN DEFAULT true,
  created_at    TIMESTAMPTZ DEFAULT now(),
  updated_at    TIMESTAMPTZ DEFAULT now()
);

-- ADDRESSES
CREATE TABLE addresses (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id     UUID REFERENCES users(id) ON DELETE CASCADE,
  label       VARCHAR(50) DEFAULT 'Home',
  address     TEXT NOT NULL,
  landmark    VARCHAR(200),
  pincode     VARCHAR(6) NOT NULL,
  city        VARCHAR(100) NOT NULL,
  state       VARCHAR(100) NOT NULL,
  is_default  BOOLEAN DEFAULT true,
  created_at  TIMESTAMPTZ DEFAULT now()
);
CREATE INDEX idx_addresses_user_id ON addresses(user_id);

-- SUBSCRIPTION PLANS
CREATE TABLE subscription_plans (
  id           UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name         VARCHAR(100) NOT NULL,
  slug         VARCHAR(50) UNIQUE NOT NULL,
  description  TEXT,
  category     VARCHAR(50) NOT NULL,
  base_price   DECIMAL(10,2) NOT NULL,
  max_items    INT DEFAULT 6,
  color        VARCHAR(20),
  icon         VARCHAR(50),
  is_active    BOOLEAN DEFAULT true,
  created_at   TIMESTAMPTZ DEFAULT now()
);

-- FOOD ITEMS
CREATE TABLE food_items (
  id           UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name         VARCHAR(100) NOT NULL,
  category     VARCHAR(50) NOT NULL,
  plan_type    VARCHAR(20) NOT NULL,
  protein_g    DECIMAL(5,2) NOT NULL,
  calories     INT NOT NULL,
  price        DECIMAL(8,2) NOT NULL,
  image_url    TEXT,
  emoji        VARCHAR(10),
  color        VARCHAR(20),
  description  TEXT,
  is_active    BOOLEAN DEFAULT true,
  is_available BOOLEAN DEFAULT true,
  sort_order   INT DEFAULT 0,
  created_at   TIMESTAMPTZ DEFAULT now(),
  updated_at   TIMESTAMPTZ DEFAULT now()
);

-- ADMINS
CREATE TABLE admins (
  id         UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name       VARCHAR(100) NOT NULL,
  mobile     VARCHAR(10) UNIQUE NOT NULL,
  email      VARCHAR(200) UNIQUE,
  password_hash VARCHAR(255) NOT NULL,
  role       VARCHAR(30) DEFAULT 'admin',
  is_active  BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- SUBSCRIPTIONS
CREATE TABLE subscriptions (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id         UUID REFERENCES users(id) ON DELETE CASCADE,
  plan_id         UUID REFERENCES subscription_plans(id),
  address_id      UUID REFERENCES addresses(id),
  status          VARCHAR(30) DEFAULT 'pending',
  total_price     DECIMAL(10,2) NOT NULL,
  total_protein   DECIMAL(6,2),
  total_calories  INT,
  start_date      DATE,
  end_date        DATE,
  duration_days   INT DEFAULT 30,
  notes           TEXT,
  submitted_at    TIMESTAMPTZ DEFAULT now(),
  approved_at     TIMESTAMPTZ,
  approved_by     UUID REFERENCES admins(id),
  rejection_reason TEXT,
  created_at      TIMESTAMPTZ DEFAULT now(),
  updated_at      TIMESTAMPTZ DEFAULT now()
);
CREATE INDEX idx_subscriptions_user_id ON subscriptions(user_id);
CREATE INDEX idx_subscriptions_status ON subscriptions(status);

-- SUBSCRIPTION ITEMS
CREATE TABLE subscription_items (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  subscription_id UUID REFERENCES subscriptions(id) ON DELETE CASCADE,
  food_item_id    UUID REFERENCES food_items(id),
  quantity        INT DEFAULT 1,
  unit_price      DECIMAL(8,2),
  created_at      TIMESTAMPTZ DEFAULT now()
);

-- APPROVALS
CREATE TABLE approvals (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  subscription_id UUID REFERENCES subscriptions(id) ON DELETE CASCADE,
  admin_id        UUID REFERENCES admins(id),
  action          VARCHAR(20) NOT NULL,
  notes           TEXT,
  created_at      TIMESTAMPTZ DEFAULT now()
);

-- NOTIFICATIONS
CREATE TABLE notifications (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id     UUID REFERENCES users(id) ON DELETE CASCADE,
  type        VARCHAR(50) NOT NULL,
  title       VARCHAR(200) NOT NULL,
  message     TEXT NOT NULL,
  is_read     BOOLEAN DEFAULT false,
  metadata    JSONB,
  created_at  TIMESTAMPTZ DEFAULT now()
);
CREATE INDEX idx_notifications_user_id ON notifications(user_id);

-- ACTIVITY LOGS
CREATE TABLE activity_logs (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  actor_id    UUID NOT NULL,
  actor_type  VARCHAR(20) NOT NULL,
  action      VARCHAR(100) NOT NULL,
  entity_type VARCHAR(50),
  entity_id   UUID,
  metadata    JSONB,
  created_at  TIMESTAMPTZ DEFAULT now()
);
