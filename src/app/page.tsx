import Link from "next/link";
import WeeklySchedule from "@/components/schedule/WeeklySchedule";
import StoreSelector from "@/components/StoreSelector";
import { mockShifts, getMondayOfWeek, formatWeekRange } from "@/lib/mockData";

export default function HomePage() {
  const weekStart = getMondayOfWeek(new Date());
  const weekRange = formatWeekRange(weekStart);

  return (
    <div className="space-y-8">
      {/* Store Selector */}
      <StoreSelector />

      <h1 className="text-2xl font-bold text-gray-800">Dashboard</h1>

      {/* Weekly Schedule */}
      <section>
        <div className="flex items-center gap-3 mb-3">
          <h2 className="text-lg font-semibold text-gray-700">This Week's Schedule</h2>
          <span className="text-sm text-gray-400">{weekRange}</span>
        </div>
        <WeeklySchedule weekStart={weekStart} shifts={mockShifts} />
      </section>

      {/* Employee Buttons */}
      <section>
        <h2 className="text-lg font-semibold text-gray-700 mb-3">Employees</h2>
        <div className="flex gap-3">
          <Link href="/employees" className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
            Employee List
          </Link>
          <Link href="/employees/add" className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700">
            Add Employee
          </Link>
        </div>
      </section>

      {/* Schedule Buttons */}
      <section>
        <h2 className="text-lg font-semibold text-gray-700 mb-3">Schedule</h2>
        <div className="flex gap-3">
          <Link href="/schedule" className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700">
            Weekly Schedule
          </Link>
        </div>
      </section>
    </div>
  );
}