-- ================================
-- Schedule Retrieval Queries
-- ================================

--Daily Schedule Query
SELECT
  e.name AS employee_name,
  sd.shift_name,
  sd.start_time,
  sd.end_type
FROM shift_assignments sa
JOIN schedules s ON sa.schedule_id = s.schedule_id
JOIN employees e ON sa.employee_id = e.employee_id
JOIN shift_definitions sd ON sa.shift_definition_id = sd.shift_definition_id
WHERE s.schedule_date = '2026-06-11'
ORDER BY sd.start_time;

--Weekly Schedule Query
SELECT
  s.schedule_date,
  e.name AS employee_name,
  sd.shift_name,
  sd.start_time,
  sd.end_type
FROM shift_assignments sa
JOIN schedules s ON sa.schedule_id = s.schedule_id
JOIN employees e ON sa.employee_id = e.employee_id
JOIN shift_definitions sd ON sa.shift_definition_id = sd.shift_definition_id
WHERE s.schedule_date BETWEEN '2026-06-08' AND '2026-06-14'
ORDER BY s.schedule_date, sd.start_time;

-- Monthly Schedule Query
SELECT
  s.schedule_date,
  e.name AS employee_name,
  sd.shift_name,
  sd.start_time,
  sd.end_type
FROM shift_assignments sa
JOIN schedules s ON sa.schedule_id = s.schedule_id
JOIN employees e ON sa.employee_id = e.employee_id
JOIN shift_definitions sd ON sa.shift_definition_id = sd.shift_definition_id
WHERE EXTRACT(YEAR FROM s.schedule_date) = 2026
  AND EXTRACT(MONTH FROM s.schedule_date) = 6
ORDER BY s.schedule_date, sd.start_time;

--Employee Schedule Query
SELECT
  e.name AS employee_name,
  COALESCE(s.schedule_date::text, 'No schedule') AS schedule_date,
  sd.shift_name,
  sd.start_time,
  sd.end_type
FROM employees e
LEFT JOIN shift_assignments sa ON e.employee_id = sa.employee_id
LEFT JOIN schedules s ON sa.schedule_id = s.schedule_id
LEFT JOIN shift_definitions sd ON sa.shift_definition_id = sd.shift_definition_id
WHERE e.employee_id = '21111111-1111-1111-1111-111111111111'
ORDER BY s.schedule_date NULLS LAST;