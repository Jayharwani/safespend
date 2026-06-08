import { addDays, format, subDays } from "date-fns";
import type { AppData, OneOffEntry } from "../types";
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

// A realistic scatter of recent spends so Insights has something to show.
function makeSpends(): OneOffEntry[] {
  const samples: { daysAgo: number; name: string; amount: number }[] = [
    { daysAgo: 0, name: "Coffee", amount: 6 },
    { daysAgo: 0, name: "Lunch", amount: 18 },
    { daysAgo: 1, name: "Groceries", amount: 52 },
    { daysAgo: 2, name: "Bus fare", amount: 9 },
    { daysAgo: 3, name: "Dinner out", amount: 34 },
    { daysAgo: 4, name: "Pharmacy", amount: 22 },
    { daysAgo: 5, name: "Coffee", amount: 6 },
    { daysAgo: 6, name: "Groceries", amount: 44 },
    { daysAgo: 9, name: "Clothes", amount: 60 },
    { daysAgo: 11, name: "Groceries", amount: 48 },
    { daysAgo: 13, name: "Takeaway", amount: 26 },
    { daysAgo: 16, name: "Groceries", amount: 51 },
    { daysAgo: 20, name: "Cinema", amount: 28 },
  ];
  return samples.map((s) => ({
    id: generateId(),
    name: s.name,
    amount: s.amount,
    date: format(subDays(today, s.daysAgo), "yyyy-MM-dd"),
    type: "spend",
  }));
}

export function getDemoData(scenario: "healthy" | "tight" | "danger"): AppData {
  const base: AppData = {
    balance: scenario === "healthy" ? 1200 : scenario === "tight" ? 400 : 200,
    payAmount: 2400,
    nextPayday: format(addDays(today, 15), "yyyy-MM-dd"),
    payFrequency: "fortnightly",
    bills: makeBills(),
    oneOffs: makeSpends(),
    welcomeSeen: true,
    onboardingComplete: true,
    signedUp: true,
    permissionsSeen: true,
    allSetSeen: true,
    lastPaydayCelebrated: "",
    lastNotified: "",
    setupComplete: true,
  };
  return base;
}
