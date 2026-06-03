"use client";

import { useState, useEffect } from "react";
import {
  loadSettings,
  saveSettings,
  defaultSettings,
  DAYS_OF_WEEK,
  type StoreSettings,
  type DayOfWeek,
} from "@/lib/settingsStore";

export default function SettingsPage() {
  const [settings, setSettings] = useState<StoreSettings>(defaultSettings);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    setSettings(loadSettings());
  }, []);

  function handleDayToggle(day: DayOfWeek) {
    setSettings((prev) => ({
      ...prev,
      storeHours: {
        ...prev.storeHours,
        [day]: {
          ...prev.storeHours[day],
          open: !prev.storeHours[day].open,
        },
      },
    }));
  }

  function handleDayTime(day: DayOfWeek, field: "openTime" | "closeTime", value: string) {
    setSettings((prev) => ({
      ...prev,
      storeHours: {
        ...prev.storeHours,
        [day]: { ...prev.storeHours[day], [field]: value },
      },
    }));
  }

  function handleBreakTime(field: "start" | "end", value: string) {
    setSettings((prev) => ({
      ...prev,
      breakTime: { ...prev.breakTime, [field]: value },
    }));
  }

  function handleShiftTime(id: string, field: "start" | "end", value: string) {
    setSettings((prev) => ({
      ...prev,
      shifts: prev.shifts.map((s) =>
        s.id === id ? { ...s, [field]: value } : s
      ),
    }));
  }

  function parseHour(value: string): string {
    return value.replace(/am|pm/gi, "").trim();
  }

  function parsePeriod(value: string): string {
    const match = value.match(/am|pm/i);
    return match ? match[0].toLowerCase() : "am";
  }

  function handleSave() {
    saveSettings(settings);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  }

  return (
    <div className="space-y-8">
      <h1 className="text-2xl font-bold text-gray-800">Store Settings</h1>

      {/* Store Open Hours */}
      <section className="bg-white border border-gray-200 rounded-lg p-6 space-y-4">
        <h2 className="text-lg font-semibold text-gray-700">Store Open Hours</h2>
        {DAYS_OF_WEEK.map((day) => (
          <div key={day} className="flex items-center gap-4">
            {/* Day toggle */}
            <div className="flex items-center gap-2 w-24">
              <input
                type="checkbox"
                checked={settings.storeHours[day].open}
                onChange={() => handleDayToggle(day)}
                className="accent-blue-600"
              />
              <span className="text-sm font-medium text-gray-700">{day}</span>
            </div>

            {/* Time inputs */}
            {settings.storeHours[day].open ? (
              <div className="flex items-center gap-2">
                {/* Open */}
                <input
                  type="number"
                  min={1}
                  max={12}
                  value={parseHour(settings.storeHours[day].openTime)}
                  onChange={(e) =>
                    handleDayTime(
                      day,
                      "openTime",
                      `${e.target.value}${parsePeriod(settings.storeHours[day].openTime)}`
                    )
                  }
                  placeholder="11"
                  className="border border-gray-300 rounded px-3 py-1 text-sm w-16 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <select
                  value={parsePeriod(settings.storeHours[day].openTime)}
                  onChange={(e) =>
                    handleDayTime(
                      day,
                      "openTime",
                      `${parseHour(settings.storeHours[day].openTime)}${e.target.value}`
                    )
                  }
                  className="border border-gray-300 rounded px-2 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="am">AM</option>
                  <option value="pm">PM</option>
                </select>
                <span className="text-gray-400 text-sm">to</span>
                {/* Close */}
                <input
                  type="number"
                  min={1}
                  max={12}
                  value={parseHour(settings.storeHours[day].closeTime)}
                  onChange={(e) =>
                    handleDayTime(
                      day,
                      "closeTime",
                      `${e.target.value}${parsePeriod(settings.storeHours[day].closeTime)}`
                    )
                  }
                  placeholder="9"
                  className="border border-gray-300 rounded px-3 py-1 text-sm w-16 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <select
                  value={parsePeriod(settings.storeHours[day].closeTime)}
                  onChange={(e) =>
                    handleDayTime(
                      day,
                      "closeTime",
                      `${parseHour(settings.storeHours[day].closeTime)}${e.target.value}`
                    )
                  }
                  className="border border-gray-300 rounded px-2 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="am">AM</option>
                  <option value="pm">PM</option>
                </select>
              </div>
            ) : (
              <span className="text-sm text-gray-400">Closed</span>
            )}
          </div>
        ))}
      </section>

      {/* Break Time */}
      <section className="bg-white border border-gray-200 rounded-lg p-6 space-y-4">
        <h2 className="text-lg font-semibold text-gray-700">Break Time</h2>
        <div className="flex items-center gap-2">
          <input
            type="number"
            min={1}
            max={12}
            value={parseHour(settings.breakTime.start)}
            onChange={(e) => handleBreakTime("start", `${e.target.value}pm`)}
            placeholder="3"
            className="border border-gray-300 rounded px-3 py-1 text-sm w-16 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <span className="text-xs text-gray-400">PM</span>
          <span className="text-gray-400 text-sm">to</span>
          <input
            type="number"
            min={1}
            max={12}
            value={parseHour(settings.breakTime.end)}
            onChange={(e) => handleBreakTime("end", `${e.target.value}pm`)}
            placeholder="4"
            className="border border-gray-300 rounded px-3 py-1 text-sm w-16 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <span className="text-xs text-gray-400">PM</span>
        </div>
      </section>

      {/* Shift Hours */}
      <section className="bg-white border border-gray-200 rounded-lg p-6 space-y-4">
        <h2 className="text-lg font-semibold text-gray-700">Shift Hours</h2>
        {settings.shifts.map((shift) => {
          const endLabel = shift.id === "1" || shift.id === "2" ? "Break Time" : "Closing";

          return (
            <div key={shift.id} className="flex items-center gap-4">
              <span className="text-sm font-medium text-gray-700 w-24">{shift.name}</span>
              <div className="flex items-center gap-2">
                {/* 시작 시간 - 시 */}
                <input
                  type="number"
                  min={1}
                  max={12}
                  value={parseHour(shift.start).split(":")[0]}
                  onChange={(e) => {
                    const minute = parseHour(shift.start).split(":")[1] ?? "00";
                    const period = parsePeriod(shift.start);
                    handleShiftTime(shift.id, "start", `${e.target.value}:${minute}${period}`);
                  }}
                  className="border border-gray-300 rounded px-3 py-1 text-sm w-16 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                {/* 시작 시간 - 분 */}
                <select
                  value={parseHour(shift.start).split(":")[1] ?? "00"}
                  onChange={(e) => {
                    const hour = parseHour(shift.start).split(":")[0];
                    const period = parsePeriod(shift.start);
                    handleShiftTime(shift.id, "start", `${hour}:${e.target.value}${period}`);
                  }}
                  className="border border-gray-300 rounded px-2 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="00">:00</option>
                  <option value="30">:30</option>
                </select>
                {/* AM/PM */}
                <select
                  value={parsePeriod(shift.start)}
                  onChange={(e) => {
                    const hour = parseHour(shift.start).split(":")[0];
                    const minute = parseHour(shift.start).split(":")[1] ?? "00";
                    handleShiftTime(shift.id, "start", `${hour}:${minute}${e.target.value}`);
                  }}
                  className="border border-gray-300 rounded px-2 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="am">AM</option>
                  <option value="pm">PM</option>
                </select>
                <span className="text-gray-400 text-sm">to</span>
                {/* 끝시간 - 고정 표시 */}
                <span className="text-sm text-gray-400 bg-gray-100 border border-gray-200 rounded px-3 py-1">
                  {endLabel}
                </span>
              </div>
            </div>
          );
        })}
      </section>

      {/* Save Button */}
      <button
        onClick={handleSave}
        className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm"
      >
        {saved ? "Saved!" : "Save Settings"}
      </button>
    </div>
  );
}