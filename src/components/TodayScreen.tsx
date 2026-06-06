import { Plus, Settings, AlertTriangle, TrendingDown } from "lucide-react";
import type { AppData, BudgetProjection } from "../types";
import { formatMoney } from "../lib/finance";
import BalanceChart from "./BalanceChart";

interface TodayScreenProps {
  data: AppData;
  projection: BudgetProjection;
  onLogSpend: () => void;
  onSettings: () => void;
}

const statusConfig = {
  healthy: {
    bg: "bg-safe-bg",
    text: "text-safe",
    message: "You've got room",
    sub: "Spend freely — bills are covered",
  },
  tight: {
    bg: "bg-tight-bg",
    text: "text-tight",
    message: "Ease off a bit",
    sub: "You're tighter than usual until payday",
  },
  danger: {
    bg: "bg-danger-bg",
    text: "text-danger",
    message: "Heads up — you're short",
    sub: "You'll dip below zero before payday",
  },
};

export default function TodayScreen({
  data,
  projection,
  onLogSpend,
  onSettings,
}: TodayScreenProps) {
  const config = statusConfig[projection.status];
  const { safeToSpend, dailyAllowance, daysUntilPayday, upcomingBills } = projection;

  return (
    <div className="min-h-dvh flex flex-col max-w-md mx-auto">
      <header className="flex items-center justify-between px-5 pt-12 pb-4">
        <div>
          <p className="text-text-muted text-sm">Safe to spend</p>
          <p className="font-display text-lg italic text-text-muted/80">until payday</p>
        </div>
        <button
          type="button"
          onClick={onSettings}
          className="w-10 h-10 rounded-full bg-surface-raised border border-border flex items-center justify-center text-text-muted hover:text-text transition-colors"
          aria-label="Settings"
        >
          <Settings className="w-4 h-4" />
        </button>
      </header>

      <section
        className={`mx-5 rounded-3xl ${config.bg} border border-white/5 p-6 mb-5 animate-fade-in`}
      >
        <div className="flex items-start justify-between mb-1">
          <p className={`text-sm font-medium ${config.text}`}>{config.message}</p>
          {projection.status !== "healthy" && (
            <AlertTriangle className={`w-4 h-4 ${config.text} opacity-70`} />
          )}
        </div>

        <p
          className={`font-semibold tracking-tight leading-none ${config.text}`}
          style={{ fontSize: "clamp(3rem, 12vw, 4.5rem)" }}
        >
          {formatMoney(safeToSpend)}
        </p>

        <p className="text-text-muted text-sm mt-3">
          {daysUntilPayday > 0 ? (
            <>
              about <span className="text-text font-medium">{formatMoney(dailyAllowance)}/day</span>{" "}
              for {daysUntilPayday} day{daysUntilPayday !== 1 ? "s" : ""}
            </>
          ) : (
            "Payday is today"
          )}
        </p>

        <p className={`text-xs mt-2 ${config.text} opacity-70`}>{config.sub}</p>

        {projection.status === "danger" && projection.negativeDateLabel && (
          <div className="mt-4 flex items-center gap-2 bg-danger/10 rounded-xl px-3 py-2.5">
            <TrendingDown className="w-4 h-4 text-danger shrink-0" />
            <p className="text-danger text-xs leading-snug">
              You'll go below $0 on <strong>{projection.negativeDateLabel}</strong>
              {projection.lowestBalanceDate && (
                <> — lowest point {formatMoney(projection.lowestBalance)}</>
              )}
            </p>
          </div>
        )}

        {projection.status === "tight" && projection.lowestBalanceDate && (
          <div className="mt-4 flex items-center gap-2 bg-tight/10 rounded-xl px-3 py-2.5">
            <TrendingDown className="w-4 h-4 text-tight shrink-0" />
            <p className="text-tight text-xs leading-snug">
              Lowest point on <strong>{projection.lowestBalanceLabel}</strong> —{" "}
              {formatMoney(projection.lowestBalance)} left
            </p>
          </div>
        )}
      </section>

      <section className="mx-5 mb-5 animate-fade-in" style={{ animationDelay: "0.1s" }}>
        <div className="bg-surface-raised border border-border rounded-2xl p-4">
          <div className="flex items-center justify-between mb-3">
            <p className="text-text-muted text-xs font-medium uppercase tracking-wider">
              Balance to payday
            </p>
            <p className="text-text-muted text-xs">
              Bank shows {formatMoney(data.balance)}
            </p>
          </div>
          <BalanceChart data={projection.chartData} status={projection.status} />
        </div>
      </section>

      <section className="mx-5 flex-1 animate-fade-in" style={{ animationDelay: "0.15s" }}>
        <p className="text-text-muted text-xs font-medium uppercase tracking-wider mb-3">
          Bills before payday
          <span className="normal-case font-normal ml-2">
            −{formatMoney(projection.totalBillsBeforePayday)}
          </span>
        </p>

        {upcomingBills.length === 0 ? (
          <p className="text-text-muted text-sm py-4">No bills coming before payday</p>
        ) : (
          <ul className="space-y-2">
            {upcomingBills.map((bill, i) => (
              <li
                key={`${bill.name}-${bill.dateLabel}-${i}`}
                className="flex items-center justify-between bg-surface-raised border border-border rounded-xl px-4 py-3"
              >
                <div>
                  <p className="text-sm font-medium">{bill.name}</p>
                  <p className="text-text-muted text-xs">{bill.dateLabel}</p>
                </div>
                <p className="text-sm font-medium text-text-muted">
                  −{formatMoney(bill.amount)}
                </p>
              </li>
            ))}
          </ul>
        )}
      </section>

      <div
        className="sticky bottom-0 px-5 pt-4 pb-6 bg-gradient-to-t from-surface via-surface to-transparent"
        style={{ paddingBottom: "max(1.5rem, env(safe-area-inset-bottom))" }}
      >
        <button
          type="button"
          onClick={onLogSpend}
          className="w-full flex items-center justify-center gap-2 bg-safe text-surface font-semibold py-4 rounded-2xl hover:brightness-110 active:scale-[0.98] transition-all shadow-lg shadow-safe/20"
        >
          <Plus className="w-5 h-5" />
          Log a spend
        </button>
      </div>
    </div>
  );
}
