import { AlertTriangle, Check } from "lucide-react";
import type { BudgetStatus } from "../types";

const config: Record<
  BudgetStatus,
  { label: string; icon: typeof Check; className: string }
> = {
  healthy: {
    label: "Looking good",
    icon: Check,
    className: "bg-safe-bg text-safe",
  },
  tight: {
    label: "Getting tight",
    icon: AlertTriangle,
    className: "bg-tight-bg text-tight",
  },
  over: {
    label: "Heads up",
    icon: AlertTriangle,
    className: "bg-over-bg text-over",
  },
};

interface StatePillProps {
  status: BudgetStatus;
}

export default function StatePill({ status }: StatePillProps) {
  const { label, icon: Icon, className } = config[status];
  return (
    <span
      className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[13px] font-medium ${className}`}
    >
      <Icon className="w-[15px] h-[15px]" strokeWidth={2} />
      {label}
    </span>
  );
}
