type Props = {
  employeeName: string;
  time: string;
  type: "morning" | "night";
  onEdit?: () => void;
  onDelete?: () => void;
};

export default function ShiftCard({ employeeName, time, type, onEdit, onDelete }: Props) {
  const isMorning = type === "morning";
  const firstName = employeeName.split(" ")[0];

  return (
    <div className={`rounded-lg px-3 py-2 space-y-0.5 ${
      isMorning ? "bg-blue-50" : "bg-purple-50"
    }`}>
      <div className="flex items-center justify-between">
        <p className={`text-sm font-semibold ${isMorning ? "text-blue-700" : "text-purple-700"}`}>
          {firstName}
        </p>
        {(onEdit || onDelete) && (
          <div className="flex gap-1">
            {onEdit && (
              <button
                onClick={onEdit}
                className="text-xs text-gray-400 hover:text-blue-500 px-1"
              >
                ✏️
              </button>
            )}
            {onDelete && (
              <button
                onClick={onDelete}
                className="text-xs text-gray-400 hover:text-red-500 px-1"
              >
                🗑️
              </button>
            )}
          </div>
        )}
      </div>
      <p className={`text-xs truncate ${isMorning ? "text-blue-400" : "text-purple-400"}`}>
        {time}
      </p>
    </div>
  );
}