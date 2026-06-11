type Props = {
  weekRange: string;
  onPrev: () => void;
  onNext: () => void;
  onToday: () => void;
};

export default function WeekNavigation({ weekRange, onPrev, onNext, onToday }: Props) {
  return (
    <div className="flex items-center gap-3">
      <button onClick={onPrev} className="px-3 py-1 text-sm text-gray-600 hover:text-gray-900">←</button>
      <span className="text-sm font-medium text-gray-700">{weekRange}</span>
      <button onClick={onNext} className="px-3 py-1 text-sm text-gray-600 hover:text-gray-900">→</button>
      <button onClick={onToday} className="px-3 py-1 text-sm text-blue-600 hover:text-blue-800 border border-blue-300 rounded-lg">
        Today
      </button>
    </div>
  );
}