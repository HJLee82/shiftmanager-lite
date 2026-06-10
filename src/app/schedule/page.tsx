"use client";

import { useState } from "react";
import WeeklySchedule from "@/components/schedule/WeeklySchedule";
import { mockShifts, getMondayOfWeek, formatWeekRange } from "@/lib/mockData";

export default function SchedulePage() {
  const [weekStart, setWeekStart] = useState(() => getMondayOfWeek(new Date()));

  function goToPrevWeek() {
    const prev = new Date(weekStart);
    prev.setDate(weekStart.getDate() - 7);
    setWeekStart(prev);
  }

  function goToNextWeek() {
    const next = new Date(weekStart);
    next.setDate(weekStart.getDate() + 7);
    setWeekStart(next);
  }

  function goToToday() {
    setWeekStart(getMondayOfWeek(new Date()));
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-800">Weekly Schedule</h1>
        <button
          className="px-4 py-2 bg-gray-100 text-gray-600 rounded-lg hover:bg-gray-200 text-sm"
          onClick={() => alert("Copy previous week - coming soon!")}
        >
          Copy Previous Week
        </button>
      </div>

      {/* Week Navigation */}
      <div className="flex items-center gap-3">
        <button onClick={goToPrevWeek} className="px-3 py-1 text-sm text-gray-600 hover:text-gray-900">←</button>
        <span className="text-sm font-medium text-gray-700">{formatWeekRange(weekStart)}</span>
        <button onClick={goToNextWeek} className="px-3 py-1 text-sm text-gray-600 hover:text-gray-900">→</button>
        <button onClick={goToToday} className="px-3 py-1 text-sm text-blue-600 hover:text-blue-800 border border-blue-300 rounded-lg">
          Today
        </button>
      </div>

      <WeeklySchedule weekStart={weekStart} shifts={mockShifts} />
    </div>
  );
}