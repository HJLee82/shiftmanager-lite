import { type StoreSettings, type DayOfWeek, DAYS_OF_WEEK } from "@/lib/settingsStore";

type AvailabilityEntry = {
  enabled: boolean;
  allDay: boolean;
  shiftId: string;
};

export type Availability = Record<DayOfWeek, AvailabilityEntry>;

type Props = {
  settings: StoreSettings;
  availability: Availability;
  isEditing: boolean;
  onDayToggle: (day: DayOfWeek) => void;
  onAllDayToggle: (day: DayOfWeek) => void;
  onShiftSelect: (day: DayOfWeek, shiftId: string) => void;
};

export default function AvailabilitySection({
  settings,
  availability,
  isEditing,
  onDayToggle,
  onAllDayToggle,
  onShiftSelect,
}: Props) {
  if (!isEditing) {
    const morningShifts = settings.shifts.filter((s) => s.end === "break time");
    const nightShifts = settings.shifts.filter((s) => s.end === "closing");

    return (
      <section className="bg-white border border-gray-200 rounded-lg p-6 space-y-4">
        <h2 className="text-lg font-semibold text-gray-700">Availability</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-sm border-collapse">
            <thead>
              <tr>
                <th className="border border-gray-200 px-2 py-2 text-xs font-medium text-gray-500 bg-gray-50 w-20"></th>
                {DAYS_OF_WEEK.map((day) => (
                  <th
                    key={day}
                    className="border border-gray-200 px-2 py-2 text-center text-xs font-medium text-gray-500 bg-gray-50"
                  >
                    {day}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {/* Morning row */}
              <tr>
                <td className="border border-gray-200 px-2 py-2 text-xs font-medium text-gray-500 bg-gray-50">
                  Morning
                </td>
                {DAYS_OF_WEEK.map((day) => {
                  const avail = availability[day];
                  const isStoreClosed = !settings.storeHours[day].open;
                  const shift = settings.shifts.find((s) => s.id === avail.shiftId);
                  const isMorning = morningShifts.some((s) => s.id === avail.shiftId);

                  return (
                    <td
                      key={day}
                      className="border border-gray-200 px-2 py-3 text-center align-top"
                    >
                      {isStoreClosed ? (
                        <span className="text-xs text-gray-300">Closed</span>
                      ) : avail.enabled && (isMorning || avail.allDay) ? (
                        <div className="bg-blue-100 rounded-md px-1 py-2 space-y-1">
                          <p className="text-xs font-medium text-blue-700">
                            {avail.allDay ? "All Day" : shift?.name ?? "-"}
                          </p>
                          {!avail.allDay && shift && (
                            <p className="text-xs text-blue-500">
                              {shift.start} -{" "}
                              {shift.end === "break time"
                                ? settings.breakTime.start
                                : "closing"}
                            </p>
                          )}
                        </div>
                      ) : (
                        <span className="text-xs text-gray-300">-</span>
                      )}
                    </td>
                  );
                })}
              </tr>

              {/* Night row */}
              <tr>
                <td className="border border-gray-200 px-2 py-2 text-xs font-medium text-gray-500 bg-gray-50">
                  Night
                </td>
                {DAYS_OF_WEEK.map((day) => {
                  const avail = availability[day];
                  const isStoreClosed = !settings.storeHours[day].open;
                  const shift = settings.shifts.find((s) => s.id === avail.shiftId);
                  const isNight = nightShifts.some((s) => s.id === avail.shiftId);

                  return (
                    <td
                      key={day}
                      className="border border-gray-200 px-2 py-3 text-center align-top"
                    >
                      {isStoreClosed ? (
                        <span className="text-xs text-gray-300">Closed</span>
                      ) : avail.enabled && (isNight || avail.allDay) ? (
                        <div className="bg-purple-100 rounded-md px-1 py-2 space-y-1">
                          <p className="text-xs font-medium text-purple-700">
                            {avail.allDay ? "All Day" : shift?.name ?? "-"}
                          </p>
                          {!avail.allDay && shift && (
                            <p className="text-xs text-purple-500">
                              {shift?.start} - closing
                            </p>
                          )}
                        </div>
                      ) : (
                        <span className="text-xs text-gray-300">-</span>
                      )}
                    </td>
                  );
                })}
              </tr>
            </tbody>
          </table>
        </div>
      </section>
    );
  }

  // Edit 모드
  return (
    <section className="bg-white border border-gray-200 rounded-lg p-6 space-y-4">
      <h2 className="text-lg font-semibold text-gray-700">Availability</h2>
      {DAYS_OF_WEEK.map((day) => {
        const isStoreClosed = !settings.storeHours[day].open;
        const avail = availability[day];

        return (
          <div
            key={day}
            className={`flex items-center gap-4 ${isStoreClosed ? "opacity-40" : ""}`}
          >
            <div className="flex items-center gap-2 w-28">
              <input
                type="checkbox"
                checked={avail.enabled}
                onChange={() => onDayToggle(day)}
                disabled={isStoreClosed || !isEditing}
                className="accent-blue-600"
              />
              <span className="text-sm font-medium text-gray-700">{day}</span>
            </div>

            <select
              value={avail.shiftId}
              onChange={(e) => onShiftSelect(day, e.target.value)}
              disabled={isStoreClosed || !avail.enabled || avail.allDay || !isEditing}
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

            <div
              onClick={() => isEditing && !isStoreClosed && avail.enabled && onAllDayToggle(day)}
              className={`w-10 h-5 rounded-full transition-colors ${
                avail.allDay && avail.enabled && !isStoreClosed
                  ? "bg-green-500"
                  : "bg-gray-300"
              } ${!isEditing || isStoreClosed || !avail.enabled ? "cursor-not-allowed" : "cursor-pointer"}`}
            >
              <div
                className={`w-5 h-5 bg-white rounded-full shadow transform transition-transform ${
                  avail.allDay && avail.enabled ? "translate-x-5" : "translate-x-0"
                }`}
              />
            </div>
            <span className="text-sm text-gray-500">All Day</span>
          </div>
        );
      })}
    </section>
  );
}