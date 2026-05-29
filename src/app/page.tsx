import Link from "next/link";

function getWeekRange(): string {
  const today = new Date();
  const day = today.getDay(); // 0=Sun, 6=Sat

  const monday = new Date(today);
  monday.setDate(today.getDate() - ((day + 6) % 7));

  const sunday = new Date(monday);
  sunday.setDate(monday.getDate() + 6);

  const format = (date: Date) =>
    `${String(date.getMonth() + 1).padStart(2, "0")}/${String(date.getDate()).padStart(2, "0")}/${date.getFullYear()}`;

  return `${format(monday)} to ${format(sunday)}`;
}

export default function HomePage() {
  const weekRange = getWeekRange();

  return (
    <div className="space-y-8">
      <h1 className="text-2xl font-bold text-gray-800">Dashboard</h1>

      {/* Weekly Schedule Preview */}
      <section>
        <div className="flex items-center gap-3 mb-3">
          <h2 className="text-lg font-semibold text-gray-700">
            This Week's Schedule
          </h2>
          <span className="text-sm text-gray-400">{weekRange}</span>
        </div>
        <div className="bg-white rounded-lg border border-gray-200 p-6 text-gray-400 text-sm">
          No schedule yet.
        </div>
      </section>

      {/* Employee Buttons */}
      <section>
        <h2 className="text-lg font-semibold text-gray-700 mb-3">
          Employees
        </h2>
        <div className="flex gap-3">
          <Link
            href="/employees"
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Employee List
          </Link>
          <Link
            href="/employees/add"
            className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
          >
            Add Employee
          </Link>
        </div>
      </section>

      {/* Schedule Buttons */}
      <section>
        <h2 className="text-lg font-semibold text-gray-700 mb-3">
          Schedule
        </h2>
        <div className="flex gap-3">
          <Link
            href="/schedule"
            className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700"
          >
            Weekly Schedule
          </Link>
        </div>
      </section>
    </div>
  );
}