import { useState } from "react";
import ShiftCard from "@/components/schedule/ShiftCard";
import ShiftEmployeeSelector from "@/components/schedule/ShiftEmployeeSelector";
import { type Shift, type Employee } from "@/lib/mockData";
import { loadSettings } from "@/lib/settingsStore";

type Props = {
  date: string;
  shifts: Shift[];
  isEditing: boolean;
  availableEmployees: Employee[];
  otherEmployees: Employee[];
  unavailableEmployees: Employee[];
  onSaveEdit: (shiftId: string, employeeId: string, shiftSettingId: string) => void;
  onDelete: (id: string) => void;
};

function InlineEditForm({
  shift,
  availableEmployees,
  otherEmployees,
  unavailableEmployees,
  assignedEmployeeNames,
  onSave,
  onCancel,
}: {
  shift: Shift;
  availableEmployees: Employee[];
  otherEmployees: Employee[];
  unavailableEmployees: Employee[];
  assignedEmployeeNames: string[];
  onSave: (employeeId: string, shiftSettingId: string) => void;
  onCancel: () => void;
}) {
  const settings = loadSettings();

  // 현재 shift의 setting id 찾기
  const currentShiftSetting = settings.shifts.find((s) => {
    const startHour = parseInt(s.start.replace(/am|pm/i, "").split(":")[0]);
    const isPm = s.start.toLowerCase().includes("pm");
    const actualHour = isPm && startHour !== 12 ? startHour + 12 : startHour;
    return actualHour === shift.startHour;
  });

  const emp = [...availableEmployees, ...otherEmployees].find(
    (e) => e.name === shift.employeeName
  );

  const [selectedEmployeeId, setSelectedEmployeeId] = useState(emp?.id ?? "");
  const [selectedShiftId, setSelectedShiftId] = useState(
    currentShiftSetting?.id ?? settings.shifts[0]?.id ?? ""
  );

  return (
    <div className="bg-gray-50 border border-gray-200 rounded-lg p-3 space-y-3">
      <ShiftEmployeeSelector
        availableEmployees={availableEmployees}
        otherEmployees={otherEmployees}
        unavailableEmployees={unavailableEmployees}
        selectedEmployeeId={selectedEmployeeId}
        assignedEmployeeNames={assignedEmployeeNames.filter((n) => n !== shift.employeeName)}
        onSelect={setSelectedEmployeeId}
      />
      <div>
        <label className="block text-xs font-medium text-gray-500 mb-1">Shift</label>
        <select
          value={selectedShiftId}
          onChange={(e) => setSelectedShiftId(e.target.value)}
          className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          {settings.shifts.map((s) => (
            <option key={s.id} value={s.id}>
              {s.name} ({s.start})
            </option>
          ))}
        </select>
      </div>
      <div className="flex gap-2">
        <button
          onClick={() => onSave(selectedEmployeeId, selectedShiftId)}
          disabled={!selectedEmployeeId}
          className="px-3 py-1.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-xs disabled:opacity-50"
        >
          Save
        </button>
        <button
          onClick={onCancel}
          className="px-3 py-1.5 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 text-xs"
        >
          Cancel
        </button>
      </div>
    </div>
  );
}

export default function DailySchedule({
  date,
  shifts,
  isEditing,
  availableEmployees,
  otherEmployees,
  unavailableEmployees,
  onSaveEdit,
  onDelete,
}: Props) {
  const [editingShiftId, setEditingShiftId] = useState<string | null>(null);

  const morningShifts = shifts.filter((s) => s.date === date && s.startHour < 12);
  const nightShifts = shifts.filter((s) => s.date === date && s.startHour >= 12);
  const assignedEmployeeNames = shifts
    .filter((s) => s.date === date)
    .map((s) => s.employeeName);

  function renderShift(shift: Shift, type: "morning" | "night") {
    if (isEditing && editingShiftId === shift.id) {
      return (
        <InlineEditForm
          key={shift.id}
          shift={shift}
          availableEmployees={availableEmployees}
          otherEmployees={otherEmployees}
          unavailableEmployees={unavailableEmployees}
          assignedEmployeeNames={assignedEmployeeNames}
          onSave={(employeeId, shiftSettingId) => {
            onSaveEdit(shift.id, employeeId, shiftSettingId);
            setEditingShiftId(null);
          }}
          onCancel={() => setEditingShiftId(null)}
        />
      );
    }

    return (
      <ShiftCard
        key={shift.id}
        employeeName={shift.employeeName}
        time={shift.time}
        type={type}
        onEdit={isEditing ? () => setEditingShiftId(shift.id) : undefined}
        onDelete={isEditing ? () => onDelete(shift.id) : undefined}
      />
    );
  }

  return (
    <div className="space-y-4">
      {/* Morning */}
      <section className="bg-white border border-gray-200 rounded-lg p-4 space-y-3">
        <h2 className="text-sm font-semibold text-gray-700">Morning</h2>
        {morningShifts.length > 0 ? (
          morningShifts.map((shift) => renderShift(shift, "morning"))
        ) : (
          <p className="text-sm text-gray-300">No shifts</p>
        )}
      </section>

      {/* Night */}
      <section className="bg-white border border-gray-200 rounded-lg p-4 space-y-3">
        <h2 className="text-sm font-semibold text-gray-700">Night</h2>
        {nightShifts.length > 0 ? (
          nightShifts.map((shift) => renderShift(shift, "night"))
        ) : (
          <p className="text-sm text-gray-300">No shifts</p>
        )}
      </section>
    </div>
  );
}