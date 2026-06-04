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
import AvailabilitySection, { type Availability } from "@/components/employees/AvailabilitySection";
import UnavailabilitySection, { type UnavailableEntry } from "@/components/employees/UnavailabilitySection";
import EmployeeForm from "@/components/employees/EmployeeForm";
import ProfileAvatar from "@/components/employees/ProfileAvatar";

const mockEmployee = {
  id: "1",
  name: "Alice Johnson",
  role: "Server",
};

const mockUnavailability = [
  { date: "2026-06-10", allDay: true, fromShiftId: "1", toShiftId: "4" },
  { date: "2026-06-15", allDay: false, fromShiftId: "1", toShiftId: "3" },
  { date: "2026-06-20", allDay: false, fromShiftId: "3", toShiftId: "4" },
];

export default function EmployeeDetailPage() {
  const router = useRouter();
  const [settings, setSettings] = useState<StoreSettings | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [name, setName] = useState(mockEmployee.name);
  const [role, setRole] = useState(mockEmployee.role);
  const [availability, setAvailability] = useState<Availability | null>(null);
  const [unavailability, setUnavailability] = useState<UnavailableEntry[]>([]);
  const [currentMonth, setCurrentMonth] = useState(() => {
    const now = new Date();
    return { year: now.getFullYear(), month: now.getMonth() };
  });

  useEffect(() => {
    const loaded = loadSettings();
    setSettings(loaded);
    setAvailability(
      Object.fromEntries(
        DAYS_OF_WEEK.map((day) => {
          const enabledDays = ["Sun", "Wed", "Fri", "Sat"];
          const allDayDays = ["Sun"];
          return [
            day,
            {
              enabled: enabledDays.includes(day),
              allDay: allDayDays.includes(day),
              shiftId: ["Fri", "Sat"].includes(day)
                ? loaded.shifts[2]?.id ?? ""
                : loaded.shifts[0]?.id ?? "",
            },
          ];
        })
      ) as Availability
    );
    setUnavailability(mockUnavailability);
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

  function handleDateToggle(dateStr: string) {
    setUnavailability((prev) => {
      if (prev.some((u) => u.date === dateStr)) {
        return prev.filter((u) => u.date !== dateStr);
      }
      return [
        ...prev,
        {
          date: dateStr,
          allDay: false,
          fromShiftId: settings?.shifts[0]?.id ?? "",
          toShiftId: settings?.shifts[settings.shifts.length - 1]?.id ?? "",
        },
      ];
    });
  }

  function handleSave() {
    console.log({ name, role, availability, unavailability });
    setIsEditing(false);
  }

  function handleDelete() {
    if (!confirm("Are you sure you want to delete this employee?")) return;
    router.push("/employees");
  }

  if (!settings || !availability) {
    return <p className="text-gray-400 text-sm">Loading...</p>;
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <Link href="/employees" className="text-sm text-gray-500 hover:text-gray-700">
          ← Back
        </Link>
        <div className="flex gap-3">
          {isEditing ? (
            <>
              <button
                onClick={handleSave}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm"
              >
                Save
              </button>
              <button
                onClick={() => setIsEditing(false)}
                className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 text-sm"
              >
                Cancel
              </button>
            </>
          ) : (
            <>
              <button
                onClick={() => setIsEditing(true)}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm"
              >
                Edit
              </button>
              <button
                onClick={handleDelete}
                className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 text-sm"
              >
                Delete
              </button>
            </>
          )}
        </div>
      </div>

      {/* Employee Info */}
      <section className="bg-white border border-gray-200 rounded-lg p-6 space-y-4">
        <h2 className="text-lg font-semibold text-gray-700">Employee Info</h2>
        <div className="flex items-start justify-between">
          <EmployeeForm
            name={name}
            role={role}
            isEditing={isEditing}
            onNameChange={setName}
            onRoleChange={setRole}
          />
          <ProfileAvatar name={name} size="lg" />
        </div>
      </section>

      <AvailabilitySection
        settings={settings}
        availability={availability}
        isEditing={isEditing}
        onDayToggle={handleDayToggle}
        onAllDayToggle={handleAllDayToggle}
        onShiftSelect={handleShiftSelect}
      />

      <UnavailabilitySection
        settings={settings}
        unavailability={unavailability}
        isEditing={isEditing}
        currentMonth={currentMonth}
        onMonthChange={setCurrentMonth}
        onDateToggle={handleDateToggle}
        onFromShiftChange={(date, shiftId) =>
          setUnavailability((prev) =>
            prev.map((u) => (u.date === date ? { ...u, fromShiftId: shiftId } : u))
          )
        }
        onToShiftChange={(date, shiftId) =>
          setUnavailability((prev) =>
            prev.map((u) => (u.date === date ? { ...u, toShiftId: shiftId } : u))
          )
        }
        onAllDayToggle={(date) =>
          setUnavailability((prev) =>
            prev.map((u) => (u.date === date ? { ...u, allDay: !u.allDay } : u))
          )
        }
      />
    </div>
  );
}