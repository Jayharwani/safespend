import { formatMoney } from "../lib/finance";
import type { BudgetProjection, BudgetStatus } from "../types";

interface MonthStripProps {
  projection: BudgetProjection;
}

const dotColor: Record<BudgetStatus, string> = {
  healthy: "var(--brand)",
  tight: "var(--tight)",
  over: "var(--over)",
};

export default function MonthStrip({ projection }: MonthStripProps) {
  const { chartData, lowestBalance, status } = projection;
  const minBal = Math.min(...chartData.map((d) => d.balance));

  return (
    <div className="overflow-x-auto -mx-1 px-1 pb-1">
      <div className="flex gap-2 min-w-max">
        {chartData.map((day, i) => {
          const isLow = day.balance === minBal;
          const isPayday = i === chartData.length - 1;
          return (
            <div
              key={day.dateLabel + i}
              className="flex flex-col items-center w-[52px] shrink-0"
            >
              <div
                className="w-10 h-10 rounded-[12px] flex items-center justify-center text-[11px] font-medium mb-1.5 transition-colors"
                style={{
                  background: isLow ? "var(--tight-bg)" : isPayday ? "var(--brand-soft)" : "var(--canvas)",
                  color: isLow ? "var(--tight)" : isPayday ? "var(--brand-deep)" : "var(--ink-soft)",
                  border: isLow ? `2px solid var(--tight)` : "1px solid var(--hairline)",
                }}
              >
                {isPayday ? "Pay" : day.dateLabel === "Today" ? "Now" : day.dateLabel.split(" ")[1] ?? "·"}
              </div>
              <span className="money text-[10px] text-tertiary leading-tight text-center">
                {formatMoney(day.balance).replace("$", "")}
              </span>
              {isLow && (
                <span
                  className="w-1.5 h-1.5 rounded-full mt-1 breathe"
                  style={{ background: dotColor[status] }}
                />
              )}
            </div>
          );
        })}
      </div>
      <p className="text-[12px] text-tertiary mt-3">
        Lowest point: <span className="money font-medium">{formatMoney(lowestBalance)}</span>
      </p>
    </div>
  );
}
