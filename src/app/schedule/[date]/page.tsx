"use client";

import { useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import DailySchedule from "@/components/schedule/DailySchedule";
import ShiftEmployeeSelector from "@/components/schedule/ShiftEmployeeSelector";
import { mockShifts, mockEmployees, type Shift } from "@/lib/mockData";
import { loadSettings } from "@/lib/settingsStore";

const DAY_NAMES = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

function getDateInfo(dateStr: string) {
  const date = new Date(dateStr + "T00:00:00");
  return {
    dayName: DAY_NAMES[date.getDay()],
    formatted: date.toLocaleString("default", {
      weekday: "long",
      month: "long",
      day: "numeric",
      year: "numeric",
    }),
  };
}

function getPrevWeekSameDay(dateStr: string): string {
  const date = new Date(dateStr + "T00:00:00");
  date.setDate(date.getDate() - 7);
  return date.toISOString().split("T")[0];
}

export default function DailySchedulePage() {
  const params = useParams();
  const date = params.date as string;
  const { dayName, formatted } = getDateInfo(date);
  const settings = loadSettings();

  const [shifts, setShifts] = useState<Shift[]>(mockShifts);
  const [isEditing, setIsEditing] = useState(false);
  const [showAddForm, setShowAddForm] = useState(false);
  const [addError, setAddError] = useState("");
  const [selectedEmployeeId, setSelectedEmployeeId] = useState("");
  const [selectedShiftId, setSelectedShiftId] = useState(settings.shifts[0]?.id ?? "");

  const availableEmployees = mockEmployees.filter(
    (e) => e.availability.includes(dayName) && !e.unavailableDates.includes(date)
  );
  const otherEmployees = mockEmployees.filter(
    (e) => !e.availability.includes(dayName) || e.unavailableDates.includes(date)
  );
  const unavailableEmployees = mockEmployees.filter((e) =>
    e.unavailableDates.includes(date)
  );
  const assignedEmployeeNames = shifts
    .filter((s) => s.date === date)
    .map((s) => s.employeeName);

  function handleCopyPrevWeek() {
    const prevDate = getPrevWeekSameDay(date);
    const prevShifts = mockShifts
      .filter((s) => s.date === prevDate)
      .map((s) => ({ ...s, id: Date.now().toString() + s.id, date }));

    setShifts((prev) => [
      ...prev.filter((s) => s.date !== date),
      ...prevShifts,
    ]);
  }

  function handleSaveEdit(shiftId: string, employeeId: string, shiftSettingId: string) {
    const employee = mockEmployees.find((e) => e.id === employeeId);
    const shiftSetting = settings.shifts.find((s) => s.id === shiftSettingId);
    if (!employee || !shiftSetting) return;

    const startHour = parseInt(shiftSetting.start.replace(/am|pm/i, "").split(":")[0]);
    const isPm = shiftSetting.start.toLowerCase().includes("pm");
    const actualStartHour = isPm && startHour !== 12 ? startHour + 12 : startHour;

    setShifts((prev) =>
      prev.map((s) =>
        s.id === shiftId
          ? {
              ...s,
              employeeName: employee.name,
              time: `${shiftSetting.start} - ${shiftSetting.end}`,
              startHour: actualStartHour,
            }
          : s
      )
    );
  }

  function handleAddShift() {
    // 인라인 편집 중인지 체크 - DailySchedule 내부에서 관리되므로 여기선 addError만
    setAddError("");
    setShowAddForm(true);
    setSelectedEmployeeId("");
    setSelectedShiftId(settings.shifts[0]?.id ?? "");
  }

  function handleSaveAdd() {
    const employee = mockEmployees.find((e) => e.id === selectedEmployeeId);
    const shiftSetting = settings.shifts.find((s) => s.id === selectedShiftId);
    if (!employee || !shiftSetting) return;

    const startHour = parseInt(shiftSetting.start.replace(/am|pm/i, "").split(":")[0]);
    const isPm = shiftSetting.start.toLowerCase().includes("pm");
    const actualStartHour = isPm && startHour !== 12 ? startHour + 12 : startHour;

    const newShift: Shift = {
      id: Date.now().toString(),
      date,
      employeeName: employee.name,
      time: `${shiftSetting.start} - ${shiftSetting.end}`,
      startHour: actualStartHour,
    };

    setShifts((prev) => [...prev, newShift]);
    handleCancelAdd();
  }

  function handleCancelAdd() {
    setShowAddForm(false);
    setSelectedEmployeeId("");
    setSelectedShiftId(settings.shifts[0]?.id ?? "");
    setAddError("");
  }

  function handleDelete(id: string) {
    if (!confirm("Delete this shift?")) return;
    setShifts((prev) => prev.filter((s) => s.id !== id));
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link href="/schedule" className="text-sm text-gray-500 hover:text-gray-700">
            ← Back
          </Link>
          <h1 className="text-2xl font-bold text-gray-800">{formatted}</h1>
        </div>
        <div className="flex gap-3">
          <button
            onClick={handleCopyPrevWeek}
            className="px-4 py-2 bg-gray-100 text-gray-600 rounded-lg hover:bg-gray-200 text-sm"
          >
            Copy Previous Week
          </button>
          {isEditing ? (
            <>
              <button
                onClick={() => {
                  if (showAddForm) {
                    setAddError("Please save or cancel the current form first.");
                    return;
                  }
                  handleAddShift();
                }}
                className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 text-sm"
              >
                + Add Shift
              </button>
              <button
                onClick={() => { setIsEditing(false); handleCancelAdd(); }}
                className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 text-sm"
              >
                Done
              </button>
            </>
          ) : (
            <button
              onClick={() => setIsEditing(true)}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm"
            >
              Edit
            </button>
          )}
        </div>
      </div>

      {/* Add error */}
      {addError && (
        <p className="text-sm text-red-500">{addError}</p>
      )}

      {/* Add Shift Form */}
      {showAddForm && (
        <section className="bg-white border border-gray-200 rounded-lg p-4 space-y-4">
          <h2 className="text-sm font-semibold text-gray-700">Add Shift</h2>

          <ShiftEmployeeSelector
            availableEmployees={availableEmployees}
            otherEmployees={otherEmployees}
            unavailableEmployees={unavailableEmployees}
            selectedEmployeeId={selectedEmployeeId}
            assignedEmployeeNames={assignedEmployeeNames}
            onSelect={setSelectedEmployeeId}
          />

          {/* Shift 선택 */}
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
              onClick={handleSaveAdd}
              disabled={!selectedEmployeeId}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm disabled:opacity-50"
            >
              Add
            </button>
            <button
              onClick={handleCancelAdd}
              className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 text-sm"
            >
              Cancel
            </button>
          </div>
        </section>
      )}

      <DailySchedule
        date={date}
        shifts={shifts}
        isEditing={isEditing}
        availableEmployees={availableEmployees}
        otherEmployees={otherEmployees}
        unavailableEmployees={unavailableEmployees}
        onSaveEdit={handleSaveEdit}
        onDelete={handleDelete}
      />
    </div>
  );
}