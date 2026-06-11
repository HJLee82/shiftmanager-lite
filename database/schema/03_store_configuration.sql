--Stores Table
CREATE TABLE stores (
  store_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  store_name VARCHAR(100) NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

--StoreHour Table
CREATE TABLE store_hours (
  store_hour_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  store_id UUID NOT NULL REFERENCES stores(store_id) ON DELETE CASCADE,
  day_of_week VARCHAR(3) NOT NULL CHECK (LOWER(day_of_week) IN ('sun', 'mon', 'tue', 'wed', 'thu', 'fri', 'sat')),
  is_open BOOLEAN NOT NULL DEFAULT false,
  open_time TIME,
  close_time TIME,
  CHECK (
    is_open = false
    OR (open_time IS NOT NULL AND close_time IS NOT NULL AND open_time < close_time)
  )
);

--BreakTime Table
CREATE TABLE break_time (
  break_time_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  store_id UUID NOT NULL REFERENCES stores(store_id) ON DELETE CASCADE,
  start_time TIME NOT NULL,
  end_time TIME NOT NULL,
  CHECK (start_time < end_time)
);

--Store Unavailability Table
CREATE TABLE store_unavailability (
  store_unavailability_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  store_id UUID NOT NULL REFERENCES stores(store_id) ON DELETE CASCADE,
  unavailable_date DATE NOT NULL,
  reason VARCHAR(100)
);

--Adding store_id(nullable) into Shift_definitions
ALTER TABLE shift_definitions
ADD COLUMN store_id UUID REFERENCES stores(store_id) ON DELETE CASCADE;