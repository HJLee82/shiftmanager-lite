export type DayOfWeek = "Sun" | "Mon" | "Tue" | "Wed" | "Thu" | "Fri" | "Sat";

export type DaySchedule = {
  open: boolean;
  openTime: string;  // "11:00am"
  closeTime: string; // "9:00pm"
};

export type ShiftSlot = {
  id: string;
  name: string;    // "open team", "morning", "night", "night2"
  start: string;   // "10:30am" or "break time"
  end: string;     // "break time" or "closing"
};

export type StoreSettings = {
  storeHours: Record<DayOfWeek, DaySchedule>;
  breakTime: { start: string; end: string };
  shifts: ShiftSlot[];
};

const SETTINGS_KEY = "shiftmanager_settings";

const DAYS: DayOfWeek[] = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

// 기본값
export const defaultSettings: StoreSettings = {
  storeHours: Object.fromEntries(
    DAYS.map((day) => [day, { open: false, openTime: "11:00am", closeTime: "9:00pm" }])
  ) as Record<DayOfWeek, DaySchedule>,
  breakTime: { start: "3:00pm", end: "4:00pm" },
  shifts: [
    { id: "1", name: "Open Team", start: "10:30am", end: "break time" },
    { id: "2", name: "Morning", start: "11:00am", end: "break time" },
    { id: "3", name: "Night", start: "4:00pm", end: "closing" },
    { id: "4", name: "Night 2", start: "6:00pm", end: "closing" },
  ],
};

export function loadSettings(): StoreSettings {
  if (typeof window === "undefined") return defaultSettings;
  const raw = localStorage.getItem(SETTINGS_KEY);
  if (!raw) return defaultSettings;
  return JSON.parse(raw) as StoreSettings;
}

export function saveSettings(settings: StoreSettings): void {
  localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
}

export const DAYS_OF_WEEK: DayOfWeek[] = DAYS;