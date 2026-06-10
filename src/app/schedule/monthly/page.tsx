"use client";

import { useState } from "react";
import MonthlySchedule from "@/components/schedule/MonthlySchedule";
import WeeklySchedule from "@/components/schedule/WeeklySchedule";
import { mockShifts, mockEmployees, getMondayOfWeek, type Shift } from "@/lib/mockData";

const DAY_NAMES = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

export default function MonthlySchedulePage() {
  const today = new Date();
  const [currentMonth, setCurrentMonth] = useState({
    year: today.getFullYear(),
    month: today.getMonth(),
  });
  const [selectedWeekStart, setSelectedWeekStart] = useState<Date | null>(null);
  const [shifts, setShifts] = useState<Shift[]>(mockShifts);

  const monthLabel = new Date(currentMonth.year, currentMonth.month).toLocaleString("default", {
    month: "long",
    year: "numeric",
  });

  function handleDateClick(dateStr: string) {
    const date = new Date(dateStr + "T00:00:00");
    setSelectedWeekStart(getMondayOfWeek(date));
  }

  function getAvailableEmployees(dateStr: string) {
    const dayName = DAY_NAMES[new Date(dateStr + "T00:00:00").getDay()];
    return mockEmployees.filter(
      (e) => e.availability.includes(dayName) && !e.unavailableDates.includes(dateStr)
    );
  }

  function getOtherEmployees(dateStr: string) {
    const dayName = DAY_NAMES[new Date(dateStr + "T00:00:00").getDay()];
    return mockEmployees.filter(
      (e) => !e.availability.includes(dayName) || e.unavailableDates.includes(dateStr)
    );
  }

  function getUnavailableEmployees(dateStr: string) {
    return mockEmployees.filter((e) => e.unavailableDates.includes(dateStr));
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-800">{monthLabel}</h1>
      </div>

      {/* Month Navigation */}
      <div className="flex items-center gap-3">
        <button
          onClick={() => {
            const d = new Date(currentMonth.year, currentMonth.month - 1);
            setCurrentMonth({ year: d.getFullYear(), month: d.getMonth() });
          }}
          className="px-3 py-1 text-sm text-gray-600 hover:text-gray-900"
        >
          ←
        </button>
        <span className="text-sm font-medium text-gray-700">{monthLabel}</span>
        <button
          onClick={() => {
            const d = new Date(currentMonth.year, currentMonth.month + 1);
            setCurrentMonth({ year: d.getFullYear(), month: d.getMonth() });
          }}
          className="px-3 py-1 text-sm text-gray-600 hover:text-gray-900"
        >
          →
        </button>
      </div>

      <MonthlySchedule
        year={currentMonth.year}
        month={currentMonth.month}
        shifts={shifts}
        onDateClick={handleDateClick}
      />

      {/* 선택된 주 weekly schedule */}
      {selectedWeekStart && (
        <div className="space-y-3">
          <h2 className="text-lg font-semibold text-gray-700">
            Week of {selectedWeekStart.toLocaleString("default", { month: "long", day: "numeric" })}
          </h2>
          <WeeklySchedule
            weekStart={selectedWeekStart}
            shifts={shifts}
            inlineEdit={true}
            onShiftsChange={setShifts}
            availableEmployeesByDate={getAvailableEmployees}
            otherEmployeesByDate={getOtherEmployees}
            unavailableEmployeesByDate={getUnavailableEmployees}
          />
        </div>
      )}
    </div>
  );
}