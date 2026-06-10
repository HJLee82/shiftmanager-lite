"use client";

import { useState } from "react";
import Link from "next/link";
import ShiftCard from "@/components/schedule/ShiftCard";
import ShiftEmployeeSelector from "@/components/schedule/ShiftEmployeeSelector";
import { type Shift, type Employee } from "@/lib/mockData";
import { loadSettings } from "@/lib/settingsStore";

type Props = {
  weekStart: Date;
  shifts: Shift[];
  inlineEdit?: boolean;
  onShiftsChange?: (shifts: Shift[]) => void;
  availableEmployeesByDate?: (dateStr: string) => Employee[];
  otherEmployeesByDate?: (dateStr: string) => Employee[];
  unavailableEmployeesByDate?: (dateStr: string) => Employee[];
};

const DAY_NAMES = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

function getWeekDates(startDate: Date): Date[] {
  const dates: Date[] = [];
  for (let i = 0; i < 7; i++) {
    const date = new Date(startDate);
    date.setDate(startDate.getDate() + i);
    dates.push(date);
  }
  return dates;
}

function formatDate(date: Date): string {
  return date.toISOString().split("T")[0];
}

function formatHeader(date: Date): string {
  return date.toLocaleString("default", { weekday: "short", month: "numeric", day: "numeric" });
}

function getPrevWeekSameDay(dateStr: string): string {
  const date = new Date(dateStr + "T00:00:00");
  date.setDate(date.getDate() - 7);
  return date.toISOString().split("T")[0];
}

export default function WeeklySchedule({
  weekStart,
  shifts,
  inlineEdit = false,
  onShiftsChange,
  availableEmployeesByDate,
  otherEmployeesByDate,
  unavailableEmployeesByDate,
}: Props) {
  const settings = loadSettings();
  const weekDates = getWeekDates(weekStart);
  const [isEditing, setIsEditing] = useState(false);
  const [editingShiftId, setEditingShiftId] = useState<string | null>(null);
  const [showAddFormDate, setShowAddFormDate] = useState<string | null>(null);
  const [selectedEmployeeId, setSelectedEmployeeId] = useState("");
  const [selectedShiftId, setSelectedShiftId] = useState(settings.shifts[0]?.id ?? "");
  const [addError, setAddError] = useState("");

  function handleDelete(id: string) {
    if (!confirm("Delete this shift?")) return;
    onShiftsChange?.(shifts.filter((s) => s.id !== id));
  }

  function handleSaveEdit(shiftId: string, employeeId: string, shiftSettingId: string) {
    const employee = [...(availableEmployeesByDate?.("") ?? []), ...(otherEmployeesByDate?.("") ?? [])];
    const emp = employee.find((e) => e.id === employeeId);
    const shiftSetting = settings.shifts.find((s) => s.id === shiftSettingId);
    if (!emp || !shiftSetting) return;

    const startHour = parseInt(shiftSetting.start.replace(/am|pm/i, "").split(":")[0]);
    const isPm = shiftSetting.start.toLowerCase().includes("pm");
    const actualStartHour = isPm && startHour !== 12 ? startHour + 12 : startHour;

    onShiftsChange?.(
      shifts.map((s) =>
        s.id === shiftId
          ? { ...s, employeeName: emp.name, time: `${shiftSetting.start} - ${shiftSetting.end}`, startHour: actualStartHour }
          : s
      )
    );
    setEditingShiftId(null);
  }

  function handleSaveAdd(dateStr: string) {
    const allEmps = [
      ...(availableEmployeesByDate?.(dateStr) ?? []),
      ...(otherEmployeesByDate?.(dateStr) ?? []),
    ];
    const emp = allEmps.find((e) => e.id === selectedEmployeeId);
    const shiftSetting = settings.shifts.find((s) => s.id === selectedShiftId);
    if (!emp || !shiftSetting) return;

    const startHour = parseInt(shiftSetting.start.replace(/am|pm/i, "").split(":")[0]);
    const isPm = shiftSetting.start.toLowerCase().includes("pm");
    const actualStartHour = isPm && startHour !== 12 ? startHour + 12 : startHour;

    onShiftsChange?.([
      ...shifts,
      {
        id: Date.now().toString(),
        date: dateStr,
        employeeName: emp.name,
        time: `${shiftSetting.start} - ${shiftSetting.end}`,
        startHour: actualStartHour,
      },
    ]);

    setShowAddFormDate(null);
    setSelectedEmployeeId("");
    setSelectedShiftId(settings.shifts[0]?.id ?? "");
    setAddError("");
  }

  function handleCopyPrevWeek() {
    const newShifts = [...shifts];
    
    weekDates.forEach((date) => {
      const dateStr = formatDate(date);
      const prevDate = getPrevWeekSameDay(dateStr);
      const prevDayShifts = shifts
        .filter((s) => s.date === prevDate)
        .map((s) => ({
          ...s,
          id: Date.now().toString() + Math.random(),
          date: dateStr,
        }));

      // 해당 날짜 기존 shifts 제거하고 복사된 shifts 추가
      const filtered = newShifts.filter((s) => s.date !== dateStr);
      filtered.push(...prevDayShifts);
      newShifts.splice(0, newShifts.length, ...filtered);
    });

    onShiftsChange?.(newShifts);
  }

  return (
    <div className="space-y-3">
      {/* Edit 컨트롤 (inlineEdit 모드일 때만) */}
      {inlineEdit && (
        <div className="flex justify-end gap-3">
          <button
            onClick={() => handleCopyPrevWeek() }
            className="px-4 py-2 bg-gray-100 text-gray-600 rounded-lg hover:bg-gray-200 text-sm"
          >
            Copy Previous Week
          </button>
          {isEditing ? (
            <button
              onClick={() => { setIsEditing(false); setEditingShiftId(null); setShowAddFormDate(null); }}
              className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 text-sm"
            >
              Done
            </button>
          ) : (
            <button
              onClick={() => setIsEditing(true)}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm"
            >
              Edit
            </button>
          )}
        </div>
      )}

      {/* Weekly Grid */}
      <div className="grid grid-cols-7 gap-2 -mx-4">
        {weekDates.map((date) => {
          const dateStr = formatDate(date);
          const isToday = formatDate(new Date()) === dateStr;
          const morningShifts = shifts.filter((s) => s.date === dateStr && s.startHour < 12);
          const nightShifts = shifts.filter((s) => s.date === dateStr && s.startHour >= 12);
          const assignedNames = shifts.filter((s) => s.date === dateStr).map((s) => s.employeeName);
          const availEmps = availableEmployeesByDate?.(dateStr) ?? [];
          const otherEmps = otherEmployeesByDate?.(dateStr) ?? [];
          const unavailEmps = unavailableEmployeesByDate?.(dateStr) ?? [];

          const dayCard = (
            <div className="bg-white border border-gray-200 rounded-xl p-2 flex flex-col gap-0 overflow-hidden">
              {/* Day header */}
              <div className={`text-xs font-semibold text-center py-1 rounded-lg mb-1 ${
                isToday ? "bg-blue-600 text-white" : "text-gray-500"
              }`}>
                {formatHeader(date)}
              </div>

              {/* Morning section */}
              <div className="border-t border-gray-100 pt-1 pb-2 space-y-1 min-h-24">
                <div className="flex items-center justify-between mb-1">
                  <p className="text-xs text-gray-300 font-medium">Morning</p>
                  {inlineEdit && isEditing && (
                    <button
                      onClick={() => {
                        if (editingShiftId) { setAddError("Please save or cancel the current edit first."); return; }
                        setAddError("");
                        setShowAddFormDate(dateStr + "-morning");
                        setSelectedEmployeeId("");
                      }}
                      className="text-xs text-green-600 hover:text-green-700"
                    >
                      + Add
                    </button>
                  )}
                </div>

                {/* Add form - morning */}
                {inlineEdit && showAddFormDate === dateStr + "-morning" && (
                  <div className="space-y-2 mb-2">
                    <ShiftEmployeeSelector
                      availableEmployees={availEmps}
                      otherEmployees={otherEmps}
                      unavailableEmployees={unavailEmps}
                      selectedEmployeeId={selectedEmployeeId}
                      assignedEmployeeNames={assignedNames}
                      onSelect={setSelectedEmployeeId}
                    />
                    <select
                      value={selectedShiftId}
                      onChange={(e) => setSelectedShiftId(e.target.value)}
                      className="w-full border border-gray-300 rounded px-2 py-1 text-xs"
                    >
                      {settings.shifts.filter((s) => s.end === "break time").map((s) => (
                        <option key={s.id} value={s.id}>{s.name} ({s.start})</option>
                      ))}
                    </select>
                    <div className="flex gap-1">
                      <button onClick={() => handleSaveAdd(dateStr)} disabled={!selectedEmployeeId} className="px-2 py-1 bg-blue-600 text-white rounded text-xs disabled:opacity-50">Add</button>
                      <button onClick={() => { setShowAddFormDate(null); setAddError(""); }} className="px-2 py-1 bg-gray-100 text-gray-700 rounded text-xs">Cancel</button>
                    </div>
                  </div>
                )}

                {morningShifts.map((shift) => (
                  inlineEdit && isEditing && editingShiftId === shift.id ? (
                    <div key={shift.id} className="bg-gray-50 border border-gray-200 rounded-lg p-2 space-y-2">
                      <ShiftEmployeeSelector
                        availableEmployees={availEmps}
                        otherEmployees={otherEmps}
                        unavailableEmployees={unavailEmps}
                        selectedEmployeeId={selectedEmployeeId || availEmps.find((e) => e.name === shift.employeeName)?.id || ""}
                        assignedEmployeeNames={assignedNames.filter((n) => n !== shift.employeeName)}
                        onSelect={setSelectedEmployeeId}
                      />
                      <select
                        value={selectedShiftId}
                        onChange={(e) => setSelectedShiftId(e.target.value)}
                        className="w-full border border-gray-300 rounded px-2 py-1 text-xs"
                      >
                        {settings.shifts.map((s) => (
                          <option key={s.id} value={s.id}>{s.name} ({s.start})</option>
                        ))}
                      </select>
                      <div className="flex gap-1">
                        <button onClick={() => handleSaveEdit(shift.id, selectedEmployeeId, selectedShiftId)} disabled={!selectedEmployeeId} className="px-2 py-1 bg-blue-600 text-white rounded text-xs disabled:opacity-50">Save</button>
                        <button onClick={() => setEditingShiftId(null)} className="px-2 py-1 bg-gray-100 text-gray-700 rounded text-xs">Cancel</button>
                      </div>
                    </div>
                  ) : (
                    <ShiftCard
                      key={shift.id}
                      employeeName={shift.employeeName}
                      time={shift.time}
                      type="morning"
                      onEdit={inlineEdit && isEditing ? () => {
                        if (showAddFormDate) { setAddError("Please save or cancel the current form first."); return; }
                        setAddError("");
                        setEditingShiftId(shift.id);
                        setSelectedEmployeeId("");
                        setSelectedShiftId(settings.shifts[0]?.id ?? "");
                      } : undefined}
                      onDelete={inlineEdit && isEditing ? () => handleDelete(shift.id) : undefined}
                    />
                  )
                ))}
                {morningShifts.length === 0 && <p className="text-xs text-gray-200 text-center py-2">-</p>}
              </div>

              {/* Night section */}
              <div className="border-t border-gray-100 pt-1 pb-1 space-y-1 min-h-24">
                <div className="flex items-center justify-between mb-1">
                  <p className="text-xs text-gray-300 font-medium">Night</p>
                  {inlineEdit && isEditing && (
                    <button
                      onClick={() => {
                        if (editingShiftId) { setAddError("Please save or cancel the current edit first."); return; }
                        setAddError("");
                        setShowAddFormDate(dateStr + "-night");
                        setSelectedEmployeeId("");
                      }}
                      className="text-xs text-green-600 hover:text-green-700"
                    >
                      + Add
                    </button>
                  )}
                </div>

                {/* Add form - night */}
                {inlineEdit && showAddFormDate === dateStr + "-night" && (
                  <div className="space-y-2 mb-2">
                    <ShiftEmployeeSelector
                      availableEmployees={availEmps}
                      otherEmployees={otherEmps}
                      unavailableEmployees={unavailEmps}
                      selectedEmployeeId={selectedEmployeeId}
                      assignedEmployeeNames={assignedNames}
                      onSelect={setSelectedEmployeeId}
                    />
                    <select
                      value={selectedShiftId}
                      onChange={(e) => setSelectedShiftId(e.target.value)}
                      className="w-full border border-gray-300 rounded px-2 py-1 text-xs"
                    >
                      {settings.shifts.filter((s) => s.end === "closing").map((s) => (
                        <option key={s.id} value={s.id}>{s.name} ({s.start})</option>
                      ))}
                    </select>
                    <div className="flex gap-1">
                      <button onClick={() => handleSaveAdd(dateStr)} disabled={!selectedEmployeeId} className="px-2 py-1 bg-blue-600 text-white rounded text-xs disabled:opacity-50">Add</button>
                      <button onClick={() => { setShowAddFormDate(null); setAddError(""); }} className="px-2 py-1 bg-gray-100 text-gray-700 rounded text-xs">Cancel</button>
                    </div>
                  </div>
                )}

                {nightShifts.map((shift) => (
                  inlineEdit && isEditing && editingShiftId === shift.id ? (
                    <div key={shift.id} className="bg-gray-50 border border-gray-200 rounded-lg p-2 space-y-2">
                      <ShiftEmployeeSelector
                        availableEmployees={availEmps}
                        otherEmployees={otherEmps}
                        unavailableEmployees={unavailEmps}
                        selectedEmployeeId={selectedEmployeeId || otherEmps.find((e) => e.name === shift.employeeName)?.id || ""}
                        assignedEmployeeNames={assignedNames.filter((n) => n !== shift.employeeName)}
                        onSelect={setSelectedEmployeeId}
                      />
                      <select
                        value={selectedShiftId}
                        onChange={(e) => setSelectedShiftId(e.target.value)}
                        className="w-full border border-gray-300 rounded px-2 py-1 text-xs"
                      >
                        {settings.shifts.map((s) => (
                          <option key={s.id} value={s.id}>{s.name} ({s.start})</option>
                        ))}
                      </select>
                      <div className="flex gap-1">
                        <button onClick={() => handleSaveEdit(shift.id, selectedEmployeeId, selectedShiftId)} disabled={!selectedEmployeeId} className="px-2 py-1 bg-blue-600 text-white rounded text-xs disabled:opacity-50">Save</button>
                        <button onClick={() => setEditingShiftId(null)} className="px-2 py-1 bg-gray-100 text-gray-700 rounded text-xs">Cancel</button>
                      </div>
                    </div>
                  ) : (
                    <ShiftCard
                      key={shift.id}
                      employeeName={shift.employeeName}
                      time={shift.time}
                      type="night"
                      onEdit={inlineEdit && isEditing ? () => {
                        if (showAddFormDate) { setAddError("Please save or cancel the current form first."); return; }
                        setAddError("");
                        setEditingShiftId(shift.id);
                        setSelectedEmployeeId("");
                        setSelectedShiftId(settings.shifts[0]?.id ?? "");
                      } : undefined}
                      onDelete={inlineEdit && isEditing ? () => handleDelete(shift.id) : undefined}
                    />
                  )
                ))}
                {nightShifts.length === 0 && <p className="text-xs text-gray-200 text-center py-2">-</p>}
              </div>
            </div>
          );

          return inlineEdit ? (
            <div key={dateStr}>{dayCard}</div>
          ) : (
            <Link key={dateStr} href={`/schedule/${dateStr}`} className="hover:shadow-sm transition-shadow">
              {dayCard}
            </Link>
          );
        })}
      </div>

      {addError && <p className="text-sm text-red-500">{addError}</p>}
    </div>
  );
}