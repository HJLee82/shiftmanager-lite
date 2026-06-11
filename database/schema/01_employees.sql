CREATE TABLE employees (
  employee_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(50) NOT NULL,
  role VARCHAR(50) DEFAULT 'Trainee'
    CHECK (role IN ('Manager', 'Server', 'Cook', 'Host', 'Trainee')),
  email VARCHAR(255) UNIQUE,
  phone VARCHAR(20),
  active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);