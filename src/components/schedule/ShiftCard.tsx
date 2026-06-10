type Props = {
  employeeName: string;
  time: string;
  type: "morning" | "night";
};

export default function ShiftCard({ employeeName, time, type }: Props) {
  const isMorning = type === "morning";
  const firstName = employeeName.split(" ")[0];

  return (
    <div className={`rounded-lg px-3 py-2 space-y-0.5 ${
      isMorning ? "bg-blue-50" : "bg-purple-50"
    }`}>
      <p className={`text-sm font-semibold ${isMorning ? "text-blue-700" : "text-purple-700"}`}>
        {firstName}
      </p>
      <p className={`text-xs whitespace-nowrap ${isMorning ? "text-blue-400" : "text-purple-400"}`}>
        {time}
      </p>
    </div>
  );
}