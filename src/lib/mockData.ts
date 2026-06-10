export type Shift = {
  id: string;
  date: string;
  employeeName: string;
  time: string;
  startHour: number;
};

export const mockShifts: Shift[] = [
  { id: "1", date: "2026-06-10", employeeName: "Alice Johnson", time: "10:30am - 3pm", startHour: 10 },
  { id: "2", date: "2026-06-10", employeeName: "Bob Smith", time: "4:00pm - closing", startHour: 16 },
  { id: "3", date: "2026-06-10", employeeName: "Carol White", time: "6:00pm - closing", startHour: 18 },
  { id: "4", date: "2026-06-11", employeeName: "Alice Johnson", time: "10:30am - 3pm", startHour: 10 },
  { id: "5", date: "2026-06-11", employeeName: "Bob Smith", time: "11:00am - 3pm", startHour: 11 },
  { id: "6", date: "2026-06-11", employeeName: "Carol White", time: "10:30am - 3pm", startHour: 10 },
  { id: "7", date: "2026-06-11", employeeName: "David Lee", time: "4:00pm - closing", startHour: 16 },
  { id: "8", date: "2026-06-11", employeeName: "Emma Davis", time: "6:00pm - closing", startHour: 18 },
  { id: "9", date: "2026-06-11", employeeName: "Frank Kim", time: "4:00pm - closing", startHour: 16 },
  { id: "10", date: "2026-06-12", employeeName: "Alice Johnson", time: "10:30am - 3pm", startHour: 10 },
  { id: "11", date: "2026-06-12", employeeName: "Bob Smith", time: "11:00am - 3pm", startHour: 11 },
  { id: "12", date: "2026-06-12", employeeName: "Carol White", time: "10:30am - 3pm", startHour: 10 },
  { id: "13", date: "2026-06-12", employeeName: "David Lee", time: "4:00pm - closing", startHour: 16 },
  { id: "14", date: "2026-06-12", employeeName: "Emma Davis", time: "6:00pm - closing", startHour: 18 },
  { id: "15", date: "2026-06-12", employeeName: "Frank Kim", time: "4:00pm - closing", startHour: 16 },
  { id: "16", date: "2026-06-13", employeeName: "Alice Johnson", time: "10:30am - 3pm", startHour: 10 },
  { id: "17", date: "2026-06-13", employeeName: "Bob Smith", time: "11:00am - 3pm", startHour: 11 },
  { id: "18", date: "2026-06-13", employeeName: "Carol White", time: "10:30am - 3pm", startHour: 10 },
  { id: "19", date: "2026-06-13", employeeName: "David Lee", time: "4:00pm - closing", startHour: 16 },
  { id: "20", date: "2026-06-13", employeeName: "Emma Davis", time: "6:00pm - closing", startHour: 18 },
  { id: "21", date: "2026-06-13", employeeName: "Frank Kim", time: "4:00pm - closing", startHour: 16 },
  { id: "22", date: "2026-06-14", employeeName: "Alice Johnson", time: "10:30am - 3pm", startHour: 10 },
  { id: "23", date: "2026-06-14", employeeName: "Bob Smith", time: "11:00am - 3pm", startHour: 11 },
  { id: "24", date: "2026-06-14", employeeName: "Carol White", time: "10:30am - 3pm", startHour: 10 },
  { id: "25", date: "2026-06-14", employeeName: "David Lee", time: "4:00pm - closing", startHour: 16 },
  { id: "26", date: "2026-06-14", employeeName: "Emma Davis", time: "6:00pm - closing", startHour: 18 },
  { id: "27", date: "2026-06-14", employeeName: "Frank Kim", time: "4:00pm - closing", startHour: 16 },
];

export function getMondayOfWeek(date: Date): Date {
  const day = date.getDay();
  const monday = new Date(date);
  monday.setDate(date.getDate() - ((day + 6) % 7));
  return monday;
}

export function formatDate(date: Date): string {
  return date.toISOString().split("T")[0];
}

export function formatWeekRange(start: Date): string {
  const end = new Date(start);
  end.setDate(start.getDate() + 6);
  const format = (d: Date) =>
    `${String(d.getMonth() + 1).padStart(2, "0")}/${String(d.getDate()).padStart(2, "0")}/${d.getFullYear()}`;
  return `${format(start)} to ${format(end)}`;
}