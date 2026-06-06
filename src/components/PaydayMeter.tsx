import { format } from "date-fns";
import type { BudgetStatus } from "../types";

interface PaydayMeterProps {
  daysUntil: number;
  nextPayday: string;
  status: BudgetStatus;
}

const barColor: Record<BudgetStatus, string> = {
  healthy: "var(--brand)",
  tight: "var(--tight)",
  over: "var(--over)",
};

export default function PaydayMeter({ daysUntil, nextPayday, status }: PaydayMeterProps) {
  const label = daysUntil === 0 ? "Payday today" : format(new Date(nextPayday), "MMM d");

  return (
    <div className="mt-4 pt-4 border-t border-border-subtle">
      <div className="flex justify-between items-center mb-2">
        <span className="text-[13px] text-secondary">Until payday</span>
        <span className="text-[13px] font-medium text-primary">{label}</span>
      </div>
      <div className="h-1.5 rounded-full bg-canvas overflow-hidden">
        <div
          className="h-full rounded-full meter-fill"
          style={{
            width: `${Math.max(8, Math.min(100, 100 - daysUntil * 4))}%`,
            background: barColor[status],
          }}
        />
      </div>
    </div>
  );
}
