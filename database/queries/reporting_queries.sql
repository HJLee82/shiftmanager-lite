-- 1. Employees already assigned on a specific date
SELECT
  s.schedule_date,
  e.name AS employee_name,
  sd.shift_name
FROM shift_assignments sa
JOIN schedules s ON sa.schedule_id = s.schedule_id
JOIN employees e ON sa.employee_id = e.employee_id
JOIN shift_definitions sd ON sa.shift_definition_id = sd.shift_definition_id
WHERE s.schedule_date = '2026-06-11'
ORDER BY sd.start_time;

-- 2. Unavailable employees for a specific date
SELECT
  e.name AS employee_name,
  eu.unavailable_date,
  eu.all_day,
  eu.start_time,
  eu.end_time
FROM employee_unavailability eu
JOIN employees e ON eu.employee_id = e.employee_id
WHERE eu.unavailable_date = '2026-06-14'
ORDER BY e.name;

-- 3. Available employees for a specific date and shift
SELECT
  e.name AS employee_name,
  e.role,
  sd.shift_name
FROM employee_availability ea
JOIN employees e ON ea.employee_id = e.employee_id
JOIN shift_definitions sd ON ea.shift_definition_id = sd.shift_definition_id
JOIN schedules s ON s.store_id = sd.store_id
LEFT JOIN employee_unavailability eu
  ON eu.employee_id = e.employee_id
  AND eu.unavailable_date = s.schedule_date
WHERE s.schedule_date = '2026-06-14'
  AND LOWER(ea.day_of_week) = LOWER(TO_CHAR(s.schedule_date, 'Dy'))
  AND eu.unavailability_id IS NULL
ORDER BY sd.start_time, e.name;

-- 4. Employee workload summary
SELECT
  e.name AS employee_name,
  e.role,
  COUNT(sa.assignment_id) AS total_assignments
FROM employees e
LEFT JOIN shift_assignments sa ON e.employee_id = sa.employee_id
GROUP BY e.employee_id, e.name, e.role
ORDER BY total_assignments DESC, e.name;

-- 5. Weekly staffing summary
SELECT
  s.schedule_date,
  COUNT(sa.assignment_id) AS total_assignments,
  COUNT(DISTINCT sa.employee_id) AS total_employees
FROM schedules s
LEFT JOIN shift_assignments sa ON s.schedule_id = sa.schedule_id
WHERE s.schedule_date BETWEEN '2026-06-08' AND '2026-06-14'
GROUP BY s.schedule_date
ORDER BY s.schedule_date;

-- 6. Monthly schedule report
SELECT
  EXTRACT(YEAR FROM s.schedule_date) AS schedule_year,
  EXTRACT(MONTH FROM s.schedule_date) AS schedule_month,
  COUNT(sa.assignment_id) AS total_assignments,
  COUNT(DISTINCT sa.employee_id) AS total_employees,
  COUNT(DISTINCT s.schedule_date) AS scheduled_days
FROM schedules s
LEFT JOIN shift_assignments sa ON s.schedule_id = sa.schedule_id
WHERE EXTRACT(YEAR FROM s.schedule_date) = 2026
  AND EXTRACT(MONTH FROM s.schedule_date) = 6
GROUP BY
  EXTRACT(YEAR FROM s.schedule_date),
  EXTRACT(MONTH FROM s.schedule_date);