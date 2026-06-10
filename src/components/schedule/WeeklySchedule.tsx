import Link from "next/link";
import ShiftCard from "@/components/schedule/ShiftCard";

type Shift = {
  id: string;
  date: string;
  employeeName: string;
  time: string;
  startHour: number;
};

type Props = {
  weekStart: Date;
  shifts: Shift[];
};

function getWeekDates(startDate: Date): Date[] {
  const dates: Date[] = [];
  for (let i = 0; i < 7; i++) {
    const date = new Date(startDate);
    date.setDate(startDate.getDate() + i);
    dates.push(date);
  }
  return dates;
}

function formatDate(date: Date): string {
  return date.toISOString().split("T")[0];
}

function formatHeader(date: Date): string {
  return date.toLocaleString("default", { weekday: "short", month: "numeric", day: "numeric" });
}

export default function WeeklySchedule({ weekStart, shifts }: Props) {
  const weekDates = getWeekDates(weekStart);

  return (
    <div className="grid grid-cols-7 gap-2 -mx-4">
      {weekDates.map((date) => {
        const dateStr = formatDate(date);
        const isToday = formatDate(new Date()) === dateStr;
        const morningShifts = shifts.filter(
          (s) => s.date === dateStr && s.startHour < 12
        );
        const nightShifts = shifts.filter(
          (s) => s.date === dateStr && s.startHour >= 12
        );

        return (
          <Link
            key={dateStr}
            href={`/schedule/${dateStr}`}
            className="bg-white border border-gray-200 rounded-xl p-2 hover:shadow-sm transition-shadow flex flex-col gap-0 overflow-hidden"
          >
            {/* Day header */}
            <div
              className={`text-xs font-semibold text-center py-1 rounded-lg mb-1 ${
                isToday ? "bg-blue-600 text-white" : "text-gray-500"
              }`}
            >
              {formatHeader(date)}
            </div>

            {/* Morning section */}
            <div className="border-t border-gray-100 pt-1 pb-2 space-y-1 min-h-24">
              <p className="text-xs text-gray-300 font-medium mb-1">Morning</p>
              {morningShifts.length > 0 ? (
                morningShifts.map((shift) => (
                  <ShiftCard
                    key={shift.id}
                    employeeName={shift.employeeName}
                    time={shift.time}
                    type="morning"
                  />
                ))
              ) : (
                <p className="text-xs text-gray-200 text-center py-2">-</p>
              )}
            </div>

            {/* Night section */}
            <div className="border-t border-gray-100 pt-1 pb-1 space-y-1 min-h-24">
              <p className="text-xs text-gray-300 font-medium mb-1">Night</p>
              {nightShifts.length > 0 ? (
                nightShifts.map((shift) => (
                  <ShiftCard
                    key={shift.id}
                    employeeName={shift.employeeName}
                    time={shift.time}
                    type="night"
                  />
                ))
              ) : (
                <p className="text-xs text-gray-200 text-center py-2">-</p>
              )}
            </div>
          </Link>
        );
      })}
    </div>
  );
}