import type { AppData } from "../types";

/**
 * Pure data helpers. Persistence lives in db.ts (IndexedDB).
 */
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
  lastNotified: "",
  setupComplete: false,
  currency: "USD",
  weekStart: "monday",
};

export function generateId(): string {
  return crypto.randomUUID();
}
