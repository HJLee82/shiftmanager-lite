# ShiftManager Lite

ShiftManager Lite is a restaurant shift scheduling web app for managers.

## Project Goals

- Manage employee records
- Create and manage weekly schedules
- Add, edit, and delete shifts
- Track employee availability and unavailability
- Copy previous weekly schedules into a new week

## Tech Stack

### Frontend
- Next.js
- React
- TypeScript
- Tailwind CSS

### Backend / Database
- Supabase
- PostgreSQL

### Development Workflow
- GitHub Issues
- GitHub Pull Requests
- Feature Branch Workflow

---

## Page Structure

```text
/                         → Home Dashboard

/employees                → Employee List

/employees/add            → Add Employee

/employees/[id]           → Employee Detail
                             - View employee information
                             - Inline edit employee data
                             - Delete employee

/schedule                 → Weekly Schedule Overview

/schedule/[date]          → Schedule Detail
                             - View shifts for selected date
                             - Edit schedule
                             - Delete shifts