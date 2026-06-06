import {
  addDays,
  addWeeks,
  addMonths,
  differenceInCalendarDays,
  format,
  isBefore,
  isSameDay,
  startOfDay,
} from "date-fns";
import type { AppData, BudgetProjection, BudgetStatus, DayProjection } from "../types";

function nextOccurrence(dayOfMonth: number, from: Date): Date {
  const fromStart = startOfDay(from);
  const year = fromStart.getFullYear();
  const month = fromStart.getMonth();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const safeDay = Math.min(dayOfMonth, daysInMonth);

  let candidate = startOfDay(new Date(year, month, safeDay));

  if (candidate < fromStart) {
    const nextMonth = month + 1;
    const daysInNext = new Date(year, nextMonth + 1, 0).getDate();
    candidate = startOfDay(new Date(year, nextMonth, Math.min(dayOfMonth, daysInNext)));
  }

  return candidate;
}

function getNextPayday(data: AppData, today: Date): Date {
  let payday = startOfDay(new Date(data.nextPayday));

  while (isBefore(payday, today) || isSameDay(payday, today)) {
    switch (data.payFrequency) {
      case "weekly":
        payday = addWeeks(payday, 1);
        break;
      case "fortnightly":
        payday = addWeeks(payday, 2);
        break;
      case "monthly":
        payday = addMonths(payday, 1);
        break;
    }
  }

  return payday;
}

export function projectBudget(data: AppData, today = new Date()): BudgetProjection {
  const todayStart = startOfDay(today);
  const nextPayday = getNextPayday(data, todayStart);
  const daysUntilPayday = differenceInCalendarDays(nextPayday, todayStart);

  const upcomingBills: { name: string; amount: number; date: Date; dateLabel: string }[] = [];

  for (const bill of data.bills) {
    const date = nextOccurrence(bill.dayOfMonth, todayStart);
    if (isBefore(date, nextPayday)) {
      upcomingBills.push({
        name: bill.name,
        amount: bill.amount,
        date,
        dateLabel: format(date, "MMM d"),
      });
    }
  }

  for (const entry of data.oneOffs) {
    const date = startOfDay(new Date(entry.date));
    if (
      (entry.type === "bill" || entry.type === "spend") &&
      (isSameDay(date, todayStart) || date > todayStart) &&
      isBefore(date, nextPayday)
    ) {
      upcomingBills.push({
        name: entry.name,
        amount: entry.amount,
        date,
        dateLabel: format(date, "MMM d"),
      });
    }
  }

  upcomingBills.sort((a, b) => a.date.getTime() - b.date.getTime());

  const totalBillsBeforePayday = upcomingBills.reduce((sum, b) => sum + b.amount, 0);
  const safeToSpend = data.balance - totalBillsBeforePayday;
  const dailyAllowance = daysUntilPayday > 0 ? safeToSpend / daysUntilPayday : safeToSpend;

  const chartData: DayProjection[] = [];
  let runningBalance = data.balance;
  let lowestBalance = runningBalance;
  let lowestBalanceDate: Date | null = todayStart;
  let goesNegative = false;
  let negativeDate: Date | null = null;

  for (let i = 0; i <= daysUntilPayday; i++) {
    const date = addDays(todayStart, i);
    const dayEvents: string[] = [];

    if (i > 0) {
      const dayBills = upcomingBills.filter((b) => isSameDay(b.date, date));
      for (const bill of dayBills) {
        runningBalance -= bill.amount;
        dayEvents.push(`${bill.name} −$${bill.amount}`);
      }
    }

    if (runningBalance < lowestBalance) {
      lowestBalance = runningBalance;
      lowestBalanceDate = date;
    }

    if (runningBalance < 0 && !goesNegative) {
      goesNegative = true;
      negativeDate = date;
    }

    chartData.push({
      date,
      dateLabel: i === 0 ? "Today" : i === daysUntilPayday ? "Payday" : format(date, "MMM d"),
      balance: runningBalance,
      events: dayEvents,
    });
  }

  let status: BudgetStatus = "healthy";
  if (goesNegative || safeToSpend < 0) {
    status = "over";
  } else if (safeToSpend < 150 || dailyAllowance < 30 || lowestBalance < 100) {
    status = "tight";
  }

  return {
    safeToSpend,
    dailyAllowance,
    daysUntilPayday,
    totalBillsBeforePayday,
    upcomingBills,
    status,
    lowestBalance,
    lowestBalanceDate,
    lowestBalanceLabel: lowestBalanceDate ? format(lowestBalanceDate, "MMM d") : "",
    goesNegative,
    negativeDate,
    negativeDateLabel: negativeDate ? format(negativeDate, "MMM d") : "",
    chartData,
  };
}

export function formatMoney(amount: number): string {
  const abs = Math.abs(amount);
  const formatted = abs.toLocaleString("en-US", {
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  });
  return amount < 0 ? `−$${formatted}` : `$${formatted}`;
}
