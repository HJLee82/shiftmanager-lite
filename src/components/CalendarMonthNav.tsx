type Props = {
  currentMonth: { year: number; month: number };
  onMonthChange: (month: { year: number; month: number }) => void;
};

export default function CalendarMonthNav({ currentMonth, onMonthChange }: Props) {
  return (
    <div className="flex items-center justify-between">
      <button
        type="button"
        onClick={() => {
          const d = new Date(currentMonth.year, currentMonth.month - 1);
          onMonthChange({ year: d.getFullYear(), month: d.getMonth() });
        }}
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
        onClick={() => {
          const d = new Date(currentMonth.year, currentMonth.month + 1);
          onMonthChange({ year: d.getFullYear(), month: d.getMonth() });
        }}
        className="px-3 py-1 text-sm text-gray-600 hover:text-gray-900"
      >
        →
      </button>
    </div>
  );
}