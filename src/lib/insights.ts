import { startOfDay, subDays, format, isWithinInterval } from "date-fns";
import type { OneOffEntry } from "../types";

export interface BarDatum {
  label: string;
  amount: number;
  sublabel: string;
}

export interface InsightsData {
  bars: BarDatum[];
  total: number;
  prevTotal: number;
  periodLabel: string;
  prevLabel: string;
}

function sumSpendsBetween(spends: { date: string; amount: number }[], start: Date, end: Date) {
  return spends.reduce((acc, s) => {
    const d = startOfDay(new Date(s.date + "T00:00:00"));
    return isWithinInterval(d, { start, end }) ? acc + s.amount : acc;
  }, 0);
}

export function aggregateSpends(
  oneOffs: OneOffEntry[],
  range: "week" | "month",
  today = new Date()
): InsightsData {
  const spends = oneOffs
    .filter((e) => e.type === "spend")
    .map((e) => ({ date: e.date, amount: e.amount }));
  const t = startOfDay(today);

  if (range === "week") {
    const bars: BarDatum[] = [];
    for (let i = 6; i >= 0; i--) {
      const day = subDays(t, i);
      bars.push({
        label: format(day, "EEEEE"),
        sublabel: format(day, "EEE, MMM d"),
        amount: sumSpendsBetween(spends, day, day),
      });
    }
    const total = bars.reduce((a, b) => a + b.amount, 0);
    const prevTotal = sumSpendsBetween(spends, subDays(t, 13), subDays(t, 7));
    return { bars, total, prevTotal, periodLabel: "this week", prevLabel: "last week" };
  }

  // month: last 4 weeks
  const bars: BarDatum[] = [];
  for (let w = 3; w >= 0; w--) {
    const end = subDays(t, w * 7);
    const start = subDays(end, 6);
    bars.push({
      label: w === 0 ? "This wk" : `${w}w ago`,
      sublabel: `${format(start, "MMM d")}–${format(end, "MMM d")}`,
      amount: sumSpendsBetween(spends, start, end),
    });
  }
  const total = bars.reduce((a, b) => a + b.amount, 0);
  const prevTotal = sumSpendsBetween(spends, subDays(t, 55), subDays(t, 28));
  return { bars, total, prevTotal, periodLabel: "this month", prevLabel: "last month" };
}
