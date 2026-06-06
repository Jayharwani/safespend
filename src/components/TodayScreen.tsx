import { format } from "date-fns";
import { motion } from "framer-motion";
import { List, Plus, Settings, Sparkles, Calendar, DollarSign } from "lucide-react";
import type { AppData, BudgetProjection, BudgetStatus } from "../types";
import { formatMoney } from "../lib/finance";
import { getBillIcon } from "../lib/billIcon";
import { timeGreeting } from "../lib/greeting";
import { staggerContainer, staggerItem } from "../lib/motion";
import AnimatedNumber from "./AnimatedNumber";
import BalanceChart from "./BalanceChart";
import EmptyBillsIllustration from "./illustrations/EmptyBillsIllustration";
import PaydayMeter from "./PaydayMeter";
import PaydayRing from "./PaydayRing";
import SparkleField from "./SparkleField";
import StatePill from "./StatePill";
import TiltCard from "./TiltCard";

interface TodayScreenProps {
  data: AppData;
  projection: BudgetProjection;
  onLogSpend: () => void;
  onOpenSpendLog: () => void;
  onOpenSettings: () => void;
}

const statusColor: Record<BudgetStatus, string> = {
  healthy: "var(--brand)",
  tight: "var(--tight)",
  over: "var(--over)",
};

const statusSubcopy = {
  healthy: (amount: string) => `You are well within your safe zone with ${amount} left.`,
  tight: (amount: string, date: string) =>
    `Flowing slightly tight — you have ${amount} left until ${date}.`,
  over: (short: string) =>
    `Careful — you'll be about ${short} short before payday. Consider adjusting.`,
};

const heroStatusClass: Record<BudgetStatus, string> = {
  healthy: "hero-panel--healthy",
  tight: "hero-panel--tight",
  over: "hero-panel--over",
};

export default function TodayScreen({
  data,
  projection,
  onLogSpend,
  onOpenSpendLog,
  onOpenSettings,
}: TodayScreenProps) {
  const { safeToSpend, dailyAllowance, daysUntilPayday, upcomingBills } = projection;
  const paydayLabel = format(new Date(data.nextPayday), "MMM d");

  const subcopy =
    projection.status === "healthy"
      ? statusSubcopy.healthy(formatMoney(safeToSpend))
      : projection.status === "tight"
        ? statusSubcopy.tight(formatMoney(safeToSpend), paydayLabel)
        : statusSubcopy.over(formatMoney(Math.abs(projection.lowestBalance)));

  const noBills = data.bills.length === 0 && upcomingBills.length === 0;

  return (
    <motion.div
      className="flex-1 flex flex-col tab-content"
      variants={staggerContainer}
      initial="initial"
      animate="animate"
    >
      <div className="flex-1 overflow-y-auto px-5 pt-4 pb-32 space-y-6">
        {/* Header */}
        <motion.header variants={staggerItem} className="flex justify-between items-center">
          <div>
            <p className="text-[12px] font-semibold uppercase tracking-wider text-secondary">
              {timeGreeting()} · {format(new Date(), "EEEE, MMM d")}
            </p>
            <h1 className="text-[32px] font-bold tracking-tight text-primary leading-tight mt-0.5">Today</h1>
          </div>
          <div className="flex items-center gap-3">
            <PaydayRing
              daysUntil={daysUntilPayday}
              payFrequency={data.payFrequency}
              status={projection.status}
            />
            <button
              type="button"
              onClick={onOpenSettings}
              className="w-10 h-10 rounded-full bg-surface border border-border-subtle shadow-e1 flex items-center justify-center text-secondary hover:text-primary transition-colors cursor-pointer"
              aria-label="Settings"
            >
              <Settings className="w-5 h-5" strokeWidth={1.75} />
            </button>
          </div>
        </motion.header>

        {/* Hero Card */}
        <motion.div variants={staggerItem}>
          <TiltCard className={`hero-panel ${heroStatusClass[projection.status]}`}>
            <SparkleField active={projection.status === "healthy"} />

            {noBills ? (
              <div className="text-center py-6 relative z-[1]">
                <EmptyBillsIllustration />
                <p className="text-[18px] font-bold mb-1">Add your bills to forecast</p>
                <p className="text-[14px] text-secondary mb-6 max-w-[260px] mx-auto">
                  Your current balance is {formatMoney(data.balance)}. Add bills to see what's safe to spend.
                </p>
              </div>
            ) : (
              <>
                <div className="flex items-center gap-1.5 text-[13px] font-semibold uppercase tracking-wider text-secondary relative z-[1]">
                  <Sparkles className="w-4 h-4 text-brand" />
                  Safe to Spend
                </div>
                <motion.div
                  animate={{ color: statusColor[projection.status] }}
                  transition={{ duration: 0.5 }}
                  className="relative z-[1]"
                >
                  <AnimatedNumber
                    value={safeToSpend}
                    format={formatMoney}
                    className="text-[60px] leading-none font-bold tracking-[-1.5px] my-3"
                    aria-label={`Safe to spend: ${safeToSpend} dollars until ${paydayLabel}`}
                  />
                </motion.div>
                <div className="mt-3.5 relative z-[1] flex items-center justify-between">
                  <StatePill status={projection.status} />
                  <span className="text-[13px] text-secondary font-medium">{subcopy}</span>
                </div>

                {/* Lowest Point Warning Alert */}
                <div className="mt-4 pt-4 border-t border-border-subtle relative z-[1] text-[13px]">
                  {projection.status === "healthy" && (
                    <p className="text-secondary">
                      Lowest projected balance: <strong className="font-semibold text-primary">{formatMoney(projection.lowestBalance)}</strong> on {projection.lowestBalanceLabel}
                    </p>
                  )}
                  {projection.status === "tight" && (
                    <p className="text-tight font-medium">
                      ⚠️ Heads up — on {projection.lowestBalanceLabel}, your balance will dip to <strong className="font-bold">{formatMoney(projection.lowestBalance)}</strong>
                    </p>
                  )}
                  {projection.status === "over" && (
                    <p className="text-over font-semibold">
                      🚨 Alert — you will be <strong className="font-bold">{formatMoney(Math.abs(projection.lowestBalance))}</strong> short on {projection.lowestBalanceLabel}
                    </p>
                  )}
                </div>
              </>
            )}

            <div className="relative z-[1] mt-5">
              <PaydayMeter
                daysUntil={daysUntilPayday}
                nextPayday={data.nextPayday}
                status={projection.status}
              />
            </div>
          </TiltCard>
        </motion.div>

        {/* Actions Group right below the Hero card */}
        <motion.div variants={staggerItem} className="flex gap-3">
          <button
            type="button"
            onClick={onLogSpend}
            className="btn-primary flex-1 h-[52px]"
          >
            <Plus className="w-5 h-5" strokeWidth={2.25} />
            Log a spend
          </button>
        </motion.div>

        {!noBills && (
          <>
            {/* Bento Grid Stats */}
            <motion.div variants={staggerItem} className="grid grid-cols-2 gap-4">
              <div className="rich-card flex flex-col justify-between p-5 min-h-[110px]">
                <div className="flex justify-between items-start">
                  <span className="text-[12px] font-bold uppercase tracking-wider text-secondary">
                    Daily Limit
                  </span>
                  <div className="w-7 h-7 rounded-full bg-brand-tint flex items-center justify-center text-brand">
                    <DollarSign className="w-4 h-4" />
                  </div>
                </div>
                <div>
                  <p className="money text-[22px] font-bold mt-2 leading-none">
                    {daysUntilPayday > 0 ? formatMoney(dailyAllowance) : formatMoney(safeToSpend)}
                  </p>
                  <p className="text-[11px] text-secondary mt-1">per day remaining</p>
                </div>
              </div>

              <div className="rich-card flex flex-col justify-between p-5 min-h-[110px]">
                <div className="flex justify-between items-start">
                  <span className="text-[12px] font-bold uppercase tracking-wider text-secondary">
                    Payday In
                  </span>
                  <div className="w-7 h-7 rounded-full bg-brand-tint flex items-center justify-center text-brand">
                    <Calendar className="w-4 h-4" />
                  </div>
                </div>
                <div>
                  <p className="money text-[22px] font-bold mt-2 leading-none">
                    {daysUntilPayday} Day{daysUntilPayday !== 1 ? "s" : ""}
                  </p>
                  <p className="text-[11px] text-secondary mt-1">until {paydayLabel}</p>
                </div>
              </div>
            </motion.div>

            {/* Balance Forecast Chart */}
            <motion.section variants={staggerItem} className="rich-card">
              <div className="flex justify-between items-center mb-4">
                <div>
                  <h3 className="text-[14px] font-bold uppercase tracking-wider text-secondary">
                    Forecast Trend
                  </h3>
                  <p className="text-[12px] text-secondary mt-0.5">
                    Projected balance trajectory
                  </p>
                </div>
                <span className="money text-[15px] font-semibold text-secondary bg-canvas px-2.5 py-1 rounded-full border border-border-subtle">
                  Bank: {formatMoney(data.balance)}
                </span>
              </div>
              <BalanceChart data={projection.chartData} status={projection.status} />
            </motion.section>

            {/* Upcoming Bills */}
            <motion.section variants={staggerItem} className="rich-card p-0 overflow-hidden">
              <div className="flex items-center justify-between px-5 pt-5 pb-2">
                <div>
                  <h3 className="text-[14px] font-bold uppercase tracking-wider text-secondary">
                    Coming Up
                  </h3>
                  <p className="text-[12px] text-secondary mt-0.5">Bills before payday</p>
                </div>
                <button
                  type="button"
                  onClick={onOpenSpendLog}
                  className="text-brand text-[13px] font-semibold flex items-center gap-1 min-h-[36px] hover:opacity-80 transition-opacity cursor-pointer"
                >
                  <List className="w-4 h-4" />
                  History log
                </button>
              </div>

              {upcomingBills.length === 0 ? (
                <p className="text-secondary text-[14px] px-5 py-6">
                  No upcoming bills before your next paycheck.
                </p>
              ) : (
                <ul className="divide-y divide-border-subtle">
                  {upcomingBills.map((bill, i) => {
                    const Icon = getBillIcon(bill.name);
                    return (
                      <li
                        key={`${bill.name}-${bill.dateLabel}-${i}`}
                        className="flex items-center gap-4 px-5 py-4 hover:bg-canvas/30 transition-colors"
                      >
                        <span className="chip-ico">
                          <Icon className="w-5 h-5" strokeWidth={2} />
                        </span>
                        <div className="flex-1 min-w-0">
                          <p className="text-[16px] font-semibold text-primary truncate">
                            {bill.name}
                          </p>
                          <p className="text-[12px] text-secondary mt-0.5">
                            {bill.dateLabel}
                          </p>
                        </div>
                        <span className="money text-[16px] font-bold text-primary">
                          {formatMoney(bill.amount)}
                        </span>
                      </li>
                    );
                  })}
                </ul>
              )}
            </motion.section>
          </>
        )}
      </div>
    </motion.div>
  );
}
