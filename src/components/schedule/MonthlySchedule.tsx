import Link from "next/link";
import { type Shift, formatDate } from "@/lib/mockData";

type Props = {
  year: number;
  month: number;
  shifts: Shift[];
  onDateClick?: (dateStr: string) => void;
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

export default function MonthlySchedule({ year, month, shifts, onDateClick }: Props) {
  const days = getDaysInMonth(year, month);
  const firstDayOfWeek = new Date(year, month, 1).getDay();
  const todayStr = formatDate(new Date());

  return (
    <div>
      {/* Day headers */}
      <div className="grid grid-cols-7 gap-1 mb-1 text-center">
        {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((d) => (
          <div key={d} className="text-xs font-medium text-gray-400 py-1">{d}</div>
        ))}
      </div>

      {/* Calendar grid */}
      <div className="grid grid-cols-7 gap-1">
        {Array.from({ length: firstDayOfWeek }).map((_, i) => (
          <div key={`empty-${i}`} />
        ))}

        {days.map((date) => {
          const dateStr = formatDate(date);
          const isToday = dateStr === todayStr;
          const dayShifts = shifts.filter((s) => s.date === dateStr);

          const content = (
            <>
              <div className={`text-xs font-semibold w-6 h-6 flex items-center justify-center rounded-full ${
                isToday ? "bg-blue-600 text-white" : "text-gray-500"
              }`}>
                {date.getDate()}
              </div>
              {dayShifts.slice(0, 2).map((shift) => (
                <div
                  key={shift.id}
                  className={`text-xs rounded px-1 py-0.5 truncate ${
                    shift.startHour < 12
                      ? "bg-blue-50 text-blue-600"
                      : "bg-purple-50 text-purple-600"
                  }`}
                >
                  {shift.employeeName.split(" ")[0]}
                </div>
              ))}
              {dayShifts.length > 2 && (
                <p className="text-xs text-gray-400">+{dayShifts.length - 2} more</p>
              )}
            </>
          );

          return onDateClick ? (
            <button
              key={dateStr}
              onClick={() => onDateClick(dateStr)}
              className="min-h-20 bg-white border border-gray-200 rounded-lg p-1.5 hover:shadow-sm transition-shadow flex flex-col gap-1 text-left w-full"
            >
              {content}
            </button>
          ) : (
            <Link
              key={dateStr}
              href={`/schedule/${dateStr}`}
              className="min-h-20 bg-white border border-gray-200 rounded-lg p-1.5 hover:shadow-sm transition-shadow flex flex-col gap-1"
            >
              {content}
            </Link>
          );
        })}
      </div>
    </div>
  );
}