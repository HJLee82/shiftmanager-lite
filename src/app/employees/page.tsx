import Link from "next/link";

// 임시데이터
const mockEmployees = [
  { id: "1", name: "Alice Johnson", role: "Server" },
  { id: "2", name: "Bob Smith", role: "Cook" },
  { id: "3", name: "Carol White", role: "Host" },
];

// 이름 첫글자 추출 (프로필 사진 없을 때 이니셜 표시)
function getInitial(name: string): string {
  return name.charAt(0).toUpperCase();
}

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
                {/* 프로필 사진 자리 (이미지 없으면 이니셜 표시) */}
                <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-semibold text-sm flex-shrink-0">
                  {getInitial(employee.name)}
                </div>
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