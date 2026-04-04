-- =============================================
-- SERENE HOTEL — DATABASE SCHEMA
-- Run this once in your Neon SQL editor
-- =============================================

-- ENUMS
CREATE TYPE user_role AS ENUM ('guest', 'receptionist', 'admin');
CREATE TYPE room_type AS ENUM ('single', 'double', 'suite');
CREATE TYPE room_status AS ENUM ('available', 'occupied', 'reserved', 'maintenance', 'dirty');
CREATE TYPE booking_status AS ENUM ('reserved', 'checked_in', 'checked_out', 'cancelled');
CREATE TYPE payment_status AS ENUM ('unpaid', 'partial', 'paid');
CREATE TYPE payment_method AS ENUM ('cash', 'mpesa', 'card');

-- =============================================
-- USERS
-- =============================================
CREATE TABLE users (
  id           UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name         VARCHAR(100) NOT NULL,
  email        VARCHAR(100) UNIQUE NOT NULL,
  password     VARCHAR(255) NOT NULL,
  phone        VARCHAR(20),
  national_id  VARCHAR(20),
  role         user_role NOT NULL DEFAULT 'guest',
  created_at   TIMESTAMP DEFAULT NOW()
);

-- =============================================
-- ROOMS
-- =============================================
CREATE TABLE rooms (
  id               UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  room_number      VARCHAR(10) UNIQUE NOT NULL,
  type             room_type NOT NULL,
  floor            INT NOT NULL,
  price_per_night  NUMERIC(10,2) NOT NULL,
  status           room_status NOT NULL DEFAULT 'available',
  description      TEXT,
  photo_url        VARCHAR(255),
  created_at       TIMESTAMP DEFAULT NOW()
);

-- =============================================
-- BOOKINGS
-- =============================================
CREATE TABLE bookings (
  id                 UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  guest_id           UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  room_id            UUID NOT NULL REFERENCES rooms(id) ON DELETE CASCADE,
  check_in_date      DATE NOT NULL,
  check_out_date     DATE NOT NULL,
  status             booking_status NOT NULL DEFAULT 'reserved',
  booking_reference  VARCHAR(12) UNIQUE NOT NULL,
  created_by         UUID REFERENCES users(id),
  created_at         TIMESTAMP DEFAULT NOW(),

  CONSTRAINT valid_dates CHECK (check_out_date > check_in_date)
);

-- =============================================
-- INVOICES
-- =============================================
CREATE TABLE invoices (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  booking_id      UUID UNIQUE NOT NULL REFERENCES bookings(id) ON DELETE CASCADE,
  room_total      NUMERIC(10,2) NOT NULL,
  extras_total    NUMERIC(10,2) NOT NULL DEFAULT 0,
  discount        NUMERIC(10,2) NOT NULL DEFAULT 0,
  grand_total     NUMERIC(10,2) NOT NULL,
  payment_status  payment_status NOT NULL DEFAULT 'unpaid',
  payment_method  payment_method,
  issued_at       TIMESTAMP DEFAULT NOW()
);

-- =============================================
-- INVOICE EXTRAS (room service, laundry, etc.)
-- =============================================
CREATE TABLE invoice_extras (
  id           UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  invoice_id   UUID NOT NULL REFERENCES invoices(id) ON DELETE CASCADE,
  description  VARCHAR(100) NOT NULL,
  amount       NUMERIC(10,2) NOT NULL,
  added_at     TIMESTAMP DEFAULT NOW()
);

-- =============================================
-- PAYMENTS
-- =============================================
CREATE TABLE payments (
  id                   UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  invoice_id           UUID NOT NULL REFERENCES invoices(id) ON DELETE CASCADE,
  amount_paid          NUMERIC(10,2) NOT NULL,
  method               payment_method NOT NULL,
  mpesa_transaction_id VARCHAR(50),
  paid_at              TIMESTAMP DEFAULT NOW()
);

-- =============================================
-- INDEXES (speeds up common queries)
-- =============================================
CREATE INDEX idx_bookings_guest_id    ON bookings(guest_id);
CREATE INDEX idx_bookings_room_id     ON bookings(room_id);
CREATE INDEX idx_bookings_status      ON bookings(status);
CREATE INDEX idx_bookings_check_in    ON bookings(check_in_date);
CREATE INDEX idx_bookings_check_out   ON bookings(check_out_date);
CREATE INDEX idx_rooms_status         ON rooms(status);
CREATE INDEX idx_rooms_type           ON rooms(type);
CREATE INDEX idx_invoices_booking_id  ON invoices(booking_id);
CREATE INDEX idx_payments_invoice_id  ON payments(invoice_id);

-- =============================================
-- SEED — default admin user
-- password: admin123  (change after first login)
-- =============================================
INSERT INTO users (name, email, password, role)
VALUES (
  'Hotel Admin',
  'admin@serenehotel.com',
  '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi',
  'admin'
);

-- =============================================
-- SEED — sample rooms (15 rooms, 3 floors)
-- =============================================
INSERT INTO rooms (room_number, type, floor, price_per_night, status, description) VALUES
('101', 'single', 1, 2500.00, 'available', 'Cozy single room with garden view'),
('102', 'single', 1, 2500.00, 'available', 'Cozy single room with garden view'),
('103', 'single', 1, 2500.00, 'available', 'Cozy single room with garden view'),
('104', 'single', 1, 2500.00, 'available', 'Cozy single room with garden view'),
('105', 'single', 1, 2500.00, 'available', 'Cozy single room with garden view'),
('201', 'double', 2, 4000.00, 'available', 'Spacious double room with city view'),
('202', 'double', 2, 4000.00, 'available', 'Spacious double room with city view'),
('203', 'double', 2, 4000.00, 'available', 'Spacious double room with city view'),
('204', 'double', 2, 4000.00, 'available', 'Spacious double room with city view'),
('205', 'double', 2, 4000.00, 'available', 'Spacious double room with city view'),
('301', 'suite',  3, 7500.00, 'available', 'Luxury suite with panoramic view'),
('302', 'suite',  3, 7500.00, 'available', 'Luxury suite with panoramic view'),
('303', 'suite',  3, 7500.00, 'available', 'Luxury suite with panoramic view'),
('304', 'suite',  3, 7500.00, 'available', 'Luxury suite with panoramic view'),
('305', 'suite',  3, 7500.00, 'available', 'Luxury suite with panoramic view');