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

export default function AddEmployeePage() {
  const router = useRouter();
  const [settings, setSettings] = useState<StoreSettings | null>(null);
  const [name, setName] = useState("");
  const [role, setRole] = useState("");
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

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!name.trim()) {
      setError("Employee name is required.");
      return;
    }
    console.log({ name, role, availability, unavailability });
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
        {/* Employee Info */}
        <section className="bg-white border border-gray-200 rounded-lg p-6">
          <h2 className="text-lg font-semibold text-gray-700 mb-4">Employee Info</h2>
          <EmployeeForm
            name={name}
            role={role}
            isEditing={true}
            onNameChange={setName}
            onRoleChange={setRole}
          />
          {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
        </section>

        <AvailabilitySection
          settings={settings}
          availability={availability}
          isEditing={true}
          onDayToggle={handleDayToggle}
          onAllDayToggle={handleAllDayToggle}
          onShiftSelect={handleShiftSelect}
        />

        <UnavailabilitySection
          settings={settings}
          unavailability={unavailability}
          isEditing={true}
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