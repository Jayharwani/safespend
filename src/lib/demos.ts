import { addDays, format } from "date-fns";
import type { AppData } from "../types";
import { generateId } from "./storage";

const today = new Date();

function makeBills() {
  return [
    { id: generateId(), name: "Phone bill", amount: 60, dayOfMonth: 10 },
    { id: generateId(), name: "Electricity", amount: 90, dayOfMonth: 12 },
    { id: generateId(), name: "Car insurance", amount: 130, dayOfMonth: 15 },
    { id: generateId(), name: "Streaming + subs", amount: 35, dayOfMonth: 18 },
  ];
}

export function getDemoData(scenario: "healthy" | "tight" | "danger"): AppData {
  const base: AppData = {
    balance: scenario === "healthy" ? 1200 : scenario === "tight" ? 400 : 200,
    payAmount: 2400,
    nextPayday: format(addDays(today, 15), "yyyy-MM-dd"),
    payFrequency: "fortnightly",
    bills: makeBills(),
    oneOffs: [],
    welcomeSeen: true,
    onboardingComplete: true,
    signedUp: true,
    permissionsSeen: true,
    allSetSeen: true,
    lastPaydayCelebrated: "",
    setupComplete: true,
  };
  return base;
}
