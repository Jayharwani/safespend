import type { AppData } from "../types";

const STORAGE_KEY = "safespend-data";

export const defaultData: AppData = {
  balance: 0,
  payAmount: 0,
  nextPayday: new Date().toISOString().split("T")[0],
  payFrequency: "fortnightly",
  bills: [],
  oneOffs: [],
  welcomeSeen: false,
  onboardingComplete: false,
  signedUp: false,
  permissionsSeen: false,
  allSetSeen: false,
  lastPaydayCelebrated: "",
  setupComplete: false,
};

export function loadData(): AppData {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return { ...defaultData };
    const parsed = { ...defaultData, ...JSON.parse(raw) };
    if (parsed.setupComplete) {
      if (!parsed.welcomeSeen) parsed.welcomeSeen = true;
      if (!parsed.onboardingComplete) parsed.onboardingComplete = true;
      if (!parsed.signedUp) parsed.signedUp = true;
      if (!parsed.permissionsSeen) parsed.permissionsSeen = true;
      if (!parsed.allSetSeen) parsed.allSetSeen = true;
    } else if (parsed.welcomeSeen && !parsed.onboardingComplete) {
      parsed.onboardingComplete = true;
    }
    return parsed;
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
