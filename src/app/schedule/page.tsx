"use client";

import { useState } from "react";
import Link from "next/link";
import WeeklySchedule from "@/components/schedule/WeeklySchedule";
import WeekNavigation from "@/components/schedule/WeekNavigation";
import { mockShifts, getMondayOfWeek, formatWeekRange } from "@/lib/mockData";

export default function SchedulePage() {
  const [weekStart, setWeekStart] = useState(() => getMondayOfWeek(new Date()));
  const monthLabel = new Date().toLocaleString("default", { month: "long" });

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
        <Link
          href="/schedule/monthly"
          className="px-5 py-3 bg-orange-400 text-white rounded-lg hover:bg-orange-500 text-lg font-medium"
        >
          {monthLabel} Schedule
        </Link>
      </div>

      <WeekNavigation
        weekRange={formatWeekRange(weekStart)}
        onPrev={goToPrevWeek}
        onNext={goToNextWeek}
        onToday={goToToday}
      />

      <WeeklySchedule weekStart={weekStart} shifts={mockShifts} />
    </div>
  );
}