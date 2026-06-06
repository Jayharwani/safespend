import type { BudgetStatus, PayFrequency } from "../types";

interface PaydayRingProps {
  daysUntil: number;
  payFrequency: PayFrequency;
  status: BudgetStatus;
}

const periodDays: Record<PayFrequency, number> = {
  weekly: 7,
  fortnightly: 14,
  monthly: 30,
};

const statusStroke: Record<BudgetStatus, string> = {
  healthy: "var(--brand)",
  tight: "var(--tight)",
  over: "var(--over)",
};

export default function PaydayRing({ daysUntil, payFrequency, status }: PaydayRingProps) {
  const total = periodDays[payFrequency];
  const remaining = Math.min(Math.max(daysUntil / total, 0), 1);
  const size = 52;
  const stroke = 4;
  const radius = (size - stroke) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference * (1 - remaining);

  return (
    <div className="relative shrink-0" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="-rotate-90">
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="var(--hairline)"
          strokeWidth={stroke}
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={statusStroke[status]}
          strokeWidth={stroke}
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          className="ring-draw"
          style={
            {
              "--ring-len": `${circumference}`,
              "--ring-offset": `${offset}`,
            } as React.CSSProperties
          }
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="money text-[15px] font-semibold leading-none text-primary">{daysUntil}</span>
        <span className="text-[9px] text-tertiary leading-tight">days</span>
      </div>
    </div>
  );
}
