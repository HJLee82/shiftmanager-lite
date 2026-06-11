--Schedule Table
CREATE TABLE schedules (
  schedule_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  store_id UUID NOT NULL REFERENCES stores(store_id) ON DELETE CASCADE,
  schedule_date DATE NOT NULL UNIQUE
);

--ShiftAssignment Table
CREATE TABLE shift_assignments (
  assignment_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  schedule_id UUID NOT NULL REFERENCES schedules(schedule_id) ON DELETE CASCADE,
  employee_id UUID NOT NULL REFERENCES employees(employee_id) ON DELETE CASCADE,
  shift_definition_id UUID NOT NULL REFERENCES shift_definitions(shift_definition_id) ON DELETE CASCADE,
  status VARCHAR(20) NOT NULL DEFAULT 'assigned' CHECK (status IN ('assigned', 'swap_requested', 'approved')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);