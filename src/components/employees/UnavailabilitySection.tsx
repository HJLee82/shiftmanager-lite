import { type StoreSettings } from "@/lib/settingsStore";
import CalendarMonthNav from "@/components/CalendarMonthNav";

export type UnavailableEntry = {
  date: string;
  allDay: boolean;
  fromShiftId: string;
  toShiftId: string;
};

type Props = {
  settings: StoreSettings;
  unavailability: UnavailableEntry[];
  isEditing: boolean;
  currentMonth: { year: number; month: number };
  onMonthChange: (month: { year: number; month: number }) => void;
  onDateToggle: (dateStr: string) => void;
  onFromShiftChange: (date: string, shiftId: string) => void;
  onToShiftChange: (date: string, shiftId: string) => void;
  onAllDayToggle: (date: string) => void;
};

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

export default function UnavailabilitySection({
  settings,
  unavailability,
  isEditing,
  currentMonth,
  onMonthChange,
  onDateToggle,
  onFromShiftChange,
  onToShiftChange,
  onAllDayToggle,
}: Props) {
  return (
    <section className="bg-white border border-gray-200 rounded-lg p-6 space-y-4">
      <h2 className="text-lg font-semibold text-gray-700">Unavailability</h2>

      {/* 월 네비게이션 */}
      <CalendarMonthNav
        currentMonth={currentMonth}
        onMonthChange={onMonthChange}
      />

      {/* 캘린더 헤더 */}
      <div className="grid grid-cols-7 gap-1 text-center text-xs text-gray-400">
        {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((d) => (
          <div key={d}>{d}</div>
        ))}
      </div>

      {/* 캘린더 날짜 */}
      <div className="grid grid-cols-7 gap-1">
        {Array.from({
          length: new Date(currentMonth.year, currentMonth.month, 1).getDay(),
        }).map((_, i) => (
          <div key={`empty-${i}`} />
        ))}
        {getDaysInMonth(currentMonth.year, currentMonth.month).map((date) => {
          const dateStr = formatDate(date);
          const isSelected = unavailability.some((u) => u.date === dateStr);
          const isToday = formatDate(new Date()) === dateStr;

          return (
            <button
              key={dateStr}
              type="button"
              disabled={!isEditing}
              onClick={() => onDateToggle(dateStr)}
              className={`rounded-full w-8 h-8 mx-auto text-sm flex items-center justify-center transition-colors
                ${isSelected ? "bg-red-500 text-white" : "hover:bg-gray-100 text-gray-700"}
                ${isToday && !isSelected ? "border border-blue-400 font-semibold" : ""}
                ${!isEditing ? "cursor-default" : ""}
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
          <p className="text-sm font-medium text-gray-700">
            {isEditing ? "Selected Dates" : "Unavailable Dates"}
          </p>
          {unavailability
            .sort((a, b) => a.date.localeCompare(b.date))
            .map((entry) => {
              const fromShift = settings.shifts.find((s) => s.id === entry.fromShiftId);
              const toShift = settings.shifts.find((s) => s.id === entry.toShiftId);

              return (
                <div key={entry.date} className="flex items-center gap-3 flex-wrap">
                  <span className="text-sm text-gray-700 w-24">{entry.date}</span>

                  {isEditing ? (
                    <>
                      <select
                        value={entry.fromShiftId}
                        onChange={(e) => onFromShiftChange(entry.date, e.target.value)}
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

                      <select
                        value={entry.toShiftId}
                        onChange={(e) => onToShiftChange(entry.date, e.target.value)}
                        disabled={entry.allDay}
                        className="border border-gray-300 rounded px-2 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100 disabled:text-gray-400"
                      >
                        {settings.shifts.map((shift) => (
                          <option key={shift.id} value={shift.id}>
                            {shift.start}
                          </option>
                        ))}
                      </select>

                      <div
                        onClick={() => onAllDayToggle(entry.date)}
                        className={`w-10 h-5 rounded-full transition-colors cursor-pointer ${
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
                    </>
                  ) : (
                    // View 모드 - 텍스트로 표시
                    <span className="text-sm text-red-500">
                      {entry.allDay
                        ? "All Day"
                        : `${fromShift?.start ?? "-"} - ${toShift?.start ?? "-"}`}
                    </span>
                  )}
                </div>
              );
            })}
        </div>
      )}
    </section>
  );
}