"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  loadSettings,
  DAYS_OF_WEEK,
  type StoreSettings,
  type DayOfWeek,
} from "@/lib/settingsStore";

type AvailabilityEntry = {
  enabled: boolean;
  allDay: boolean;
  shiftId: string;
};

type Availability = Record<DayOfWeek, AvailabilityEntry>;

type UnavailableEntry = {
  date: string;    // "2026-06-03"
  allDay: boolean;
  fromShiftId: string;
  toShiftId: string;
};

function buildDefaultAvailability(settings: StoreSettings): Availability {
  return Object.fromEntries(
    DAYS_OF_WEEK.map((day) => [
      day,
      {
        enabled: false,
        allDay: false,
        shiftId: settings.shifts[0]?.id ?? "",
      },
    ])
  ) as Availability;
}

function getDaysInMonth(year: number, month: number): Date[] {
  const days: Date[] = [];
  const date = new Date(year, month, 1);
  while (date.getMonth() === month) {
    days.push(new Date(date));
    date.setDate(date.getDate() + 1);
  }
  return days;
}

function formatDate(date: Date): string {
  return date.toISOString().split("T")[0];
}

export default function AddEmployeePage() {
  const router = useRouter();
  const [settings, setSettings] = useState<StoreSettings | null>(null);
  const [name, setName] = useState("");
  const [availability, setAvailability] = useState<Availability | null>(null);
  const [unavailability, setUnavailability] = useState<UnavailableEntry[]>([]);
  const [currentMonth, setCurrentMonth] = useState(() => {
    const now = new Date();
    return { year: now.getFullYear(), month: now.getMonth() };
  });
  const [error, setError] = useState("");

  useEffect(() => {
    const loaded = loadSettings();
    setSettings(loaded);
    setAvailability(buildDefaultAvailability(loaded));
  }, []);

  function handleDayToggle(day: DayOfWeek) {
    setAvailability((prev) =>
      prev ? { ...prev, [day]: { ...prev[day], enabled: !prev[day].enabled } } : prev
    );
  }

  function handleAllDayToggle(day: DayOfWeek) {
    setAvailability((prev) =>
      prev ? { ...prev, [day]: { ...prev[day], allDay: !prev[day].allDay } } : prev
    );
  }

  function handleShiftSelect(day: DayOfWeek, shiftId: string) {
    setAvailability((prev) =>
      prev ? { ...prev, [day]: { ...prev[day], shiftId } } : prev
    );
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!name.trim()) {
      setError("Employee name is required.");
      return;
    }
    // 나중에 Supabase 연결하면 여기서 저장
    console.log({ name, availability, unavailability });
    router.push("/employees");
  }

  if (!settings || !availability) {
    return <p className="text-gray-400 text-sm">Loading...</p>;
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-800">Add Employee</h1>
        <Link href="/employees" className="text-sm text-gray-500 hover:text-gray-700">
          ← Back
        </Link>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Name */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Employee Name <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Enter employee name"
            className="w-full border border-gray-300 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
        </div>

        {/* Availability */}
        <section className="bg-white border border-gray-200 rounded-lg p-6 space-y-4">
          <h2 className="text-lg font-semibold text-gray-700">Availability</h2>
          {DAYS_OF_WEEK.map((day) => {
            const storeDay = settings.storeHours[day];
            const avail = availability[day];
            const isStoreClosed = !storeDay.open;

            return (
              <div
                key={day}
                className={`flex items-center gap-4 ${isStoreClosed ? "opacity-40" : ""}`}
              >
                {/* Day checkbox */}
                <div className="flex items-center gap-2 w-28">
                  <input
                    type="checkbox"
                    checked={avail.enabled}
                    onChange={() => handleDayToggle(day)}
                    disabled={isStoreClosed}
                    className="accent-blue-600"
                  />
                  <span className="text-sm font-medium text-gray-700">{day}</span>
                </div>

                {/* Shift dropdown */}
                <select
                  value={avail.shiftId}
                  onChange={(e) => handleShiftSelect(day, e.target.value)}
                  disabled={isStoreClosed || !avail.enabled || avail.allDay}
                  className="border border-gray-300 rounded px-3 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100 disabled:text-gray-400"
                >
                  {settings.shifts.map((shift) => {
                    const endDisplay =
                      shift.end === "break time"
                        ? settings.breakTime.start
                        : "closing";

                    return (
                      <option key={shift.id} value={shift.id}>
                        {shift.name} ({shift.start} - {endDisplay})
                      </option>
                    );
                  })}
                </select>

                {/* All Day toggle */}
                <label className="flex items-center gap-2 cursor-pointer">
                  <div
                    onClick={() => !isStoreClosed && avail.enabled && handleAllDayToggle(day)}
                    className={`w-10 h-5 rounded-full transition-colors ${
                      avail.allDay && avail.enabled && !isStoreClosed
                        ? "bg-green-500"
                        : "bg-gray-300"
                    } ${isStoreClosed || !avail.enabled ? "cursor-not-allowed" : "cursor-pointer"}`}
                  >
                    <div
                      className={`w-5 h-5 bg-white rounded-full shadow transform transition-transform ${
                        avail.allDay && avail.enabled ? "translate-x-5" : "translate-x-0"
                      }`}
                    />
                  </div>
                  <span className="text-sm text-gray-500">All Day</span>
                </label>
              </div>
            );
          })}
        </section>

        {/* Unavailability */}
        <section className="bg-white border border-gray-200 rounded-lg p-6 space-y-4">
          <h2 className="text-lg font-semibold text-gray-700">Unavailability</h2>

          {/* 월 네비게이션 */}
          <div className="flex items-center justify-between mb-2">
            <button
              type="button"
              onClick={() =>
                setCurrentMonth((prev) => {
                  const d = new Date(prev.year, prev.month - 1);
                  return { year: d.getFullYear(), month: d.getMonth() };
                })
              }
              className="px-3 py-1 text-sm text-gray-600 hover:text-gray-900"
            >
              ←
            </button>
            <span className="text-sm font-medium text-gray-700">
              {new Date(currentMonth.year, currentMonth.month).toLocaleString("default", {
                month: "long",
                year: "numeric",
              })}
            </span>
            <button
              type="button"
              onClick={() =>
                setCurrentMonth((prev) => {
                  const d = new Date(prev.year, prev.month + 1);
                  return { year: d.getFullYear(), month: d.getMonth() };
                })
              }
              className="px-3 py-1 text-sm text-gray-600 hover:text-gray-900"
            >
              →
            </button>
          </div>

          {/* 캘린더 헤더 */}
          <div className="grid grid-cols-7 gap-1 text-center text-xs text-gray-400 mb-1">
            {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((d) => (
              <div key={d}>{d}</div>
            ))}
          </div>

          {/* 캘린더 날짜 */}
          <div className="grid grid-cols-7 gap-1">
            {/* 첫째날 앞 빈칸 */}
            {Array.from({
              length: new Date(currentMonth.year, currentMonth.month, 1).getDay(),
            }).map((_, i) => (
              <div key={`empty-${i}`} />
            ))}
            {/* 날짜 */}
            {getDaysInMonth(currentMonth.year, currentMonth.month).map((date) => {
              const dateStr = formatDate(date);
              const isSelected = unavailability.some((u) => u.date === dateStr);
              const isToday = formatDate(new Date()) === dateStr;

              return (
                <button
                  key={dateStr}
                  type="button"
                  onClick={() => {
                    setUnavailability((prev) => {
                      if (prev.some((u) => u.date === dateStr)) {
                        return prev.filter((u) => u.date !== dateStr);
                      }
                      return [
                        ...prev,
                        {
                          date: dateStr,
                          allDay: false,
                          fromShiftId: settings.shifts[0]?.id ?? "",
                          toShiftId: settings.shifts[settings.shifts.length - 1]?.id ?? "",
                        },
                      ];
                    });
                  }}
                  className={`rounded-full w-8 h-8 mx-auto text-sm flex items-center justify-center transition-colors
                    ${isSelected ? "bg-red-500 text-white" : "hover:bg-gray-100 text-gray-700"}
                    ${isToday && !isSelected ? "border border-blue-400 font-semibold" : ""}
                  `}
                >
                  {date.getDate()}
                </button>
              );
            })}
          </div>

          {/* 선택된 날짜 목록 */}
          {unavailability.length > 0 && (
            <div className="space-y-3 mt-4">
              <p className="text-sm font-medium text-gray-700">Selected Dates</p>
              {unavailability
                .sort((a, b) => a.date.localeCompare(b.date))
                .map((entry) => (
                  <div key={entry.date} className="flex items-center gap-3 flex-wrap">
                    <span className="text-sm text-gray-700 w-24">{entry.date}</span>

                    {/* From shift */}
                    <select
                      value={entry.fromShiftId}
                      onChange={(e) =>
                        setUnavailability((prev) =>
                          prev.map((u) =>
                            u.date === entry.date ? { ...u, fromShiftId: e.target.value } : u
                          )
                        )
                      }
                      disabled={entry.allDay}
                      className="border border-gray-300 rounded px-2 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100 disabled:text-gray-400"
                    >
                      {settings.shifts.map((shift) => (
                        <option key={shift.id} value={shift.id}>
                          {shift.start}
                        </option>
                      ))}
                    </select>

                    <span className="text-gray-400 text-sm">to</span>

                    {/* To shift */}
                    <select
                      value={entry.toShiftId}
                      onChange={(e) =>
                        setUnavailability((prev) =>
                          prev.map((u) =>
                            u.date === entry.date ? { ...u, toShiftId: e.target.value } : u
                          )
                        )
                      }
                      disabled={entry.allDay}
                      className="border border-gray-300 rounded px-2 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100 disabled:text-gray-400"
                    >
                      {settings.shifts.map((shift) => (
                        <option key={shift.id} value={shift.id}>
                          {shift.start}
                        </option>
                      ))}
                    </select>

                    {/* All Day toggle */}
                    <div
                      onClick={() =>
                        setUnavailability((prev) =>
                          prev.map((u) =>
                            u.date === entry.date ? { ...u, allDay: !u.allDay } : u
                          )
                        )
                      }
                      className={`w-10 h-5 rounded-full cursor-pointer transition-colors ${
                        entry.allDay ? "bg-red-500" : "bg-gray-300"
                      }`}
                    >
                      <div
                        className={`w-5 h-5 bg-white rounded-full shadow transform transition-transform ${
                          entry.allDay ? "translate-x-5" : "translate-x-0"
                        }`}
                      />
                    </div>
                    <span className="text-sm text-gray-500">All Day</span>
                  </div>
                ))}
            </div>
          )}
        </section>

        {/* Buttons */}
        <div className="flex gap-3">
          <button
            type="submit"
            className="px-5 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 text-sm"
          >
            Add Employee
          </button>
          <Link
            href="/employees"
            className="px-5 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 text-sm"
          >
            Cancel
          </Link>
        </div>
      </form>
    </div>
  );
}