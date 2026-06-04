import Link from "next/link";
import ProfileAvatar from "@/components/employees/ProfileAvatar";

const mockEmployees = [
  { id: "1", name: "Alice Johnson", role: "Server" },
  { id: "2", name: "Bob Smith", role: "Cook" },
  { id: "3", name: "Carol White", role: "Host" },
];

export default function EmployeesPage() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-800">Employees</h1>
        <Link
          href="/employees/add"
          className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
        >
          + Add Employee
        </Link>
      </div>

      {/* Employee List */}
      <ul className="space-y-3">
        {mockEmployees.map((employee) => (
          <li key={employee.id}>
            <Link
              href={`/employees/${employee.id}`}
              className="flex items-center justify-between bg-white border border-gray-200 rounded-lg px-5 py-4 hover:bg-gray-50"
            >
              <div className="flex items-center gap-4">
                <ProfileAvatar name={employee.name} size="sm" />
                <div>
                  <p className="font-medium text-gray-800">{employee.name}</p>
                  <p className="text-sm text-gray-400">{employee.role}</p>
                </div>
              </div>
              <span className="text-gray-400">→</span>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}