import type { AppData } from "../types";

const STORAGE_KEY = "safespend-data";

export const defaultData: AppData = {
  balance: 0,
  payAmount: 0,
  nextPayday: new Date().toISOString().split("T")[0],
  payFrequency: "fortnightly",
  bills: [],
  oneOffs: [],
  setupComplete: false,
};

export function loadData(): AppData {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return { ...defaultData };
    return { ...defaultData, ...JSON.parse(raw) };
  } catch {
    return { ...defaultData };
  }
}

export function saveData(data: AppData): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
}

export function generateId(): string {
  return crypto.randomUUID();
}
