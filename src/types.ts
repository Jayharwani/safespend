export type PayFrequency = "weekly" | "fortnightly" | "monthly";

export type EntryType = "bill" | "income" | "spend";

export interface Bill {
  id: string;
  name: string;
  amount: number;
  dayOfMonth: number;
}

export interface OneOffEntry {
  id: string;
  name: string;
  amount: number;
  date: string;
  type: EntryType;
}

export interface AppData {
  balance: number;
  payAmount: number;
  nextPayday: string;
  payFrequency: PayFrequency;
  bills: Bill[];
  oneOffs: OneOffEntry[];
  welcomeSeen: boolean;
  onboardingComplete: boolean;
  signedUp: boolean;
  permissionsSeen: boolean;
  allSetSeen: boolean;
  lastPaydayCelebrated: string;
  setupComplete: boolean;
}

export type OverlayScreen = "insights" | "payday" | null;

export type BudgetStatus = "healthy" | "tight" | "over";
export type TabId = "today" | "plan" | "menu";

export interface DayProjection {
  date: Date;
  dateLabel: string;
  balance: number;
  events: string[];
}

export interface BudgetProjection {
  safeToSpend: number;
  dailyAllowance: number;
  daysUntilPayday: number;
  totalBillsBeforePayday: number;
  upcomingBills: { name: string; amount: number; date: Date; dateLabel: string }[];
  status: BudgetStatus;
  lowestBalance: number;
  lowestBalanceDate: Date | null;
  lowestBalanceLabel: string;
  goesNegative: boolean;
  negativeDate: Date | null;
  negativeDateLabel: string;
  chartData: DayProjection[];
}
