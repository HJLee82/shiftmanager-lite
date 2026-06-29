import { type Employee } from "@/lib/mockData";

type Props = {
  availableEmployees: Employee[];
  otherEmployees: Employee[];
  unavailableEmployees: Employee[];
  selectedEmployeeId: string;
  assignedEmployeeNames: string[];
  onSelect: (id: string) => void;
};

function getValidationMessage(
  selectedEmployeeId: string,
  availableEmployees: Employee[],
  otherEmployees: Employee[],
  unavailableEmployees: Employee[],
  assignedEmployeeNames: string[]
): { message: string; type: "error" | "warning" } | null {
  if (!selectedEmployeeId) return null;

  const allEmployees = [...availableEmployees, ...otherEmployees];
  const selected = allEmployees.find((e) => e.id === selectedEmployeeId);
  if (!selected) return null;

  // 중복 배정 체크
  if (assignedEmployeeNames.includes(selected.name)) {
    return { message: `${selected.name} is already assigned on this date.`, type: "error" };
  }

  // unavailability 체크
  if (unavailableEmployees.some((e) => e.id === selectedEmployeeId)) {
    return { message: `${selected.name} is marked unavailable on this date.`, type: "warning" };
  }

  // availability 체크 (Others에서 선택한 경우)
  if (otherEmployees.some((e) => e.id === selectedEmployeeId)) {
    return { message: `${selected.name} is not available on this day of the week.`, type: "warning" };
  }

  return null;
}

export default function ShiftEmployeeSelector({
  availableEmployees,
  otherEmployees,
  unavailableEmployees,
  selectedEmployeeId,
  assignedEmployeeNames,
  onSelect,
}: Props) {
  const validation = getValidationMessage(
    selectedEmployeeId,
    availableEmployees,
    otherEmployees,
    unavailableEmployees,
    assignedEmployeeNames
  );

  return (
    <div className="space-y-3">
      <div className="flex gap-4">
        <div className="flex-1 space-y-3">
          {/* Available */}
          <div>
            <label className="block text-xs font-medium text-gray-500 mb-1">Available</label>
            <select
              value={availableEmployees.some((e) => e.id === selectedEmployeeId) ? selectedEmployeeId : ""}
              onChange={(e) => onSelect(e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Select employee</option>
              {availableEmployees.map((emp) => (
                <option
                  key={emp.id}
                  value={emp.id}
                  disabled={assignedEmployeeNames.includes(emp.name)}
                >
                  {emp.name} ({emp.role}){assignedEmployeeNames.includes(emp.name) ? " — assigned" : ""}
                </option>
              ))}
            </select>
          </div>

          {/* Others */}
          <div>
            <label className="block text-xs font-medium text-gray-500 mb-1">Others</label>
            <select
              value={otherEmployees.some((e) => e.id === selectedEmployeeId) ? selectedEmployeeId : ""}
              onChange={(e) => onSelect(e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Select employee</option>
              {otherEmployees.map((emp) => (
                <option
                  key={emp.id}
                  value={emp.id}
                  disabled={assignedEmployeeNames.includes(emp.name)}
                >
                  {emp.name} ({emp.role}){assignedEmployeeNames.includes(emp.name) ? " — assigned" : ""}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Unavailable note */}
        {unavailableEmployees.length > 0 && (
          <div className="w-48 bg-red-50 border border-red-100 rounded-lg p-3">
            <p className="text-xs font-medium text-red-500 mb-2">Unavailable</p>
            <ul className="space-y-1">
              {unavailableEmployees.map((emp) => (
                <li key={emp.id} className="text-xs text-red-400">{emp.name}</li>
              ))}
            </ul>
          </div>
        )}
      </div>

      {/* Validation message */}
      {validation && (
        <p className={`text-xs px-3 py-2 rounded-lg ${
          validation.type === "error"
            ? "bg-red-50 text-red-600 border border-red-100"
            : "bg-yellow-50 text-yellow-600 border border-yellow-100"
        }`}>
          {validation.type === "error" ? "⛔ " : "⚠️ "}
          {validation.message}
        </p>
      )}
    </div>
  );
}