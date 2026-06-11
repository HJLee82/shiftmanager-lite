--Schedule: Uniquely change dates per store
ALTER TABLE schedules
DROP CONSTRAINT IF EXISTS schedules_schedule_date_key;

ALTER TABLE schedules
ADD CONSTRAINT unique_store_schedule_date UNIQUE (store_id, schedule_date);


--Prevention of duplication employee_availability
ALTER TABLE employee_availability
ADD CONSTRAINT unique_employee_availability
UNIQUE (employee_id, day_of_week, shift_definition_id);

--Prevention of duplication shift_assignments
ALTER TABLE shift_assignments
ADD CONSTRAINT unique_shift_assignment
UNIQUE (schedule_id, employee_id, shift_definition_id);