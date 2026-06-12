-- ================================
-- ShiftManager Lite Database Schema
-- ================================

-- Stores Table
CREATE TABLE stores (
  store_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  store_name VARCHAR(50) NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Employees Table
CREATE TABLE employees (
  employee_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(50) NOT NULL,
  role VARCHAR(50) DEFAULT 'Trainee'
    CHECK (role IN ('Manager', 'Server', 'Cook', 'Host', 'Trainee')),
  email VARCHAR(50) UNIQUE,
  phone VARCHAR(20),
  active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ShiftDefinitions Table
CREATE TABLE shift_definitions (
  shift_definition_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  store_id UUID NOT NULL REFERENCES stores(store_id) ON DELETE CASCADE,
  shift_name VARCHAR(50) NOT NULL,
  start_time TIME NOT NULL,
  end_type VARCHAR(20) NOT NULL CHECK (end_type IN ('break_time', 'closing'))
);

-- Employee Availability Table
CREATE TABLE employee_availability (
  availability_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  employee_id UUID NOT NULL REFERENCES employees(employee_id) ON DELETE CASCADE,
  day_of_week VARCHAR(3) NOT NULL CHECK (LOWER(day_of_week) IN ('sun', 'mon', 'tue', 'wed', 'thu', 'fri', 'sat')),
  shift_definition_id UUID REFERENCES shift_definitions(shift_definition_id) ON DELETE SET NULL,
  UNIQUE (employee_id, day_of_week, shift_definition_id)
);

-- Employee Unavailability Table
CREATE TABLE employee_unavailability (
  unavailability_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  employee_id UUID NOT NULL REFERENCES employees(employee_id) ON DELETE CASCADE,
  unavailable_date DATE NOT NULL,
  all_day BOOLEAN NOT NULL DEFAULT true,
  start_time TIME,
  end_time TIME,
  CHECK (
    all_day = true
    OR (start_time IS NOT NULL AND end_time IS NOT NULL AND start_time < end_time)
  )
);

-- Store Hours Table
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

-- Break Time Table
CREATE TABLE break_time (
  break_time_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  store_id UUID NOT NULL REFERENCES stores(store_id) ON DELETE CASCADE,
  start_time TIME NOT NULL,
  end_time TIME NOT NULL,
  CHECK (start_time < end_time)
);

-- Store Unavailability Table
CREATE TABLE store_unavailability (
  store_unavailability_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  store_id UUID NOT NULL REFERENCES stores(store_id) ON DELETE CASCADE,
  unavailable_date DATE NOT NULL,
  reason VARCHAR(100)
);

-- Schedules Table
CREATE TABLE schedules (
  schedule_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  store_id UUID NOT NULL REFERENCES stores(store_id) ON DELETE CASCADE,
  schedule_date DATE NOT NULL,
  UNIQUE (store_id, schedule_date)
);

-- Shift Assignments Table
CREATE TABLE shift_assignments (
  assignment_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  schedule_id UUID NOT NULL REFERENCES schedules(schedule_id) ON DELETE CASCADE,
  employee_id UUID NOT NULL REFERENCES employees(employee_id) ON DELETE CASCADE,
  shift_definition_id UUID NOT NULL REFERENCES shift_definitions(shift_definition_id) ON DELETE CASCADE,
  status VARCHAR(20) NOT NULL DEFAULT 'assigned' CHECK (status IN ('assigned', 'swap_requested', 'approved')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (schedule_id, employee_id, shift_definition_id)
);