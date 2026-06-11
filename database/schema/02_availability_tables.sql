--Shift_definitions (referenced in employee_availability)
CREATE TABLE shift_definitions (
  shift_definition_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  shift_name VARCHAR(50) NOT NULL,
  start_time TIME NOT NULL,
  end_type VARCHAR(20) NOT NULL CHECK (end_type IN ('break_time', 'closing'))
);

--Employee_availability
CREATE TABLE employee_availability (
  availability_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  employee_id UUID NOT NULL REFERENCES employees(employee_id) ON DELETE CASCADE,
  day_of_week VARCHAR(3) NOT NULL CHECK (LOWER(day_of_week) IN ('sun', 'mon', 'tue', 'wed', 'thu', 'fri', 'sat')),
  shift_definition_id UUID REFERENCES shift_definitions(shift_definition_id) ON DELETE SET NULL
);

-- Employee_unavailability
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