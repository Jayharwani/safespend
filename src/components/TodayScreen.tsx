import { format } from "date-fns";
import { motion } from "framer-motion";
import { List, Plus, Settings } from "lucide-react";
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
  healthy: "var(--safe)",
  tight: "var(--tight)",
  over: "var(--over)",
};

const statusSubcopy = {
  healthy: (amount: string) => `You've got ${amount} to spend before payday.`,
  tight: (amount: string, date: string) =>
    `Getting tight — about ${amount} until ${date}. Easy does it.`,
  over: (short: string) =>
    `Heads up — you'll be about ${short} short before payday. Want to adjust?`,
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
    <motion.div className="flex-1 flex flex-col" variants={staggerContainer} initial="initial" animate="animate">
      <div className="flex-1 overflow-y-auto px-6 pb-32">
        <motion.header variants={staggerItem} className="flex justify-between items-center mb-7">
          <div>
            <p className="text-[14px] font-medium tracking-[0.2px] text-secondary">
              {timeGreeting()} · {format(new Date(), "MMM d")}
            </p>
            <h1 className="text-[30px] leading-[1.15] font-semibold tracking-[-0.5px]">Today</h1>
          </div>
          <div className="flex items-center gap-2">
            <PaydayRing
              daysUntil={daysUntilPayday}
              payFrequency={data.payFrequency}
              status={projection.status}
            />
            <button
              type="button"
              onClick={onOpenSettings}
              className="icon-btn w-10 h-10 rounded-full bg-surface shadow-e1 flex items-center justify-center text-secondary"
              aria-label="Settings"
            >
              <Settings className="w-5 h-5" strokeWidth={1.75} />
            </button>
          </div>
        </motion.header>

        <motion.div variants={staggerItem}>
          <TiltCard className={`hero-panel mb-7 ${heroStatusClass[projection.status]}`}>
            <SparkleField active={projection.status === "healthy"} />

            {noBills ? (
              <div className="text-center py-4 relative z-[1]">
                <EmptyBillsIllustration />
                <p className="text-[17px] font-semibold mb-2">Add your bills and I'll start forecasting</p>
                <p className="text-[13px] text-secondary mb-4">
                  Bank shows {formatMoney(data.balance)} — we need bills to calculate what's safe.
                </p>
              </div>
            ) : (
              <>
                <p className="text-[14px] font-medium tracking-[0.2px] text-secondary relative z-[1]">
                  Safe to spend until payday
                </p>
                <motion.div
                  animate={{ color: statusColor[projection.status] }}
                  transition={{ duration: 0.5 }}
                  className="relative z-[1]"
                >
                  <AnimatedNumber
                    value={safeToSpend}
                    format={formatMoney}
                    className="text-[64px] leading-none font-semibold tracking-[-1.5px] my-2"
                    aria-label={`Safe to spend: ${safeToSpend} dollars until ${paydayLabel}, ${projection.status}`}
                  />
                </motion.div>
                <p className="text-[13px] text-secondary relative z-[1]">
                  {daysUntilPayday > 0 ? (
                    <>
                      about <span className="money">{formatMoney(dailyAllowance)}/day</span>
                      {" · "}
                      {daysUntilPayday} day{daysUntilPayday !== 1 ? "s" : ""} left
                    </>
                  ) : (
                    "Payday is today"
                  )}
                </p>
                <div className="mt-3.5 relative z-[1]">
                  <StatePill status={projection.status} />
                </div>
                <p className="text-[13px] mt-3 relative z-[1] text-secondary">{subcopy}</p>
              </>
            )}

            <div className="relative z-[1]">
              <PaydayMeter
                daysUntil={daysUntilPayday}
                nextPayday={data.nextPayday}
                status={projection.status}
              />
            </div>
          </TiltCard>
        </motion.div>

        {!noBills && (
          <>
            <motion.section variants={staggerItem} className="rich-card mb-7">
              <p className="text-[14px] font-medium tracking-[0.2px] text-secondary mb-2.5">
                Balance until payday
              </p>
              <BalanceChart data={projection.chartData} status={projection.status} />
              <p className="text-[13px] text-tertiary mt-2">
                Bank shows <span className="money">{formatMoney(data.balance)}</span>
              </p>
            </motion.section>

            <motion.section variants={staggerItem} className="rich-card p-0 overflow-hidden mb-4">
              <div className="flex items-center justify-between px-[22px] pt-[18px] pb-1">
                <p className="text-[14px] font-medium tracking-[0.2px] text-secondary">
                  Coming up before payday
                </p>
                <button
                  type="button"
                  onClick={onOpenSpendLog}
                  className="text-brand text-[13px] font-medium flex items-center gap-1 min-h-[44px]"
                >
                  <List className="w-4 h-4" />
                  Log
                </button>
              </div>

              {upcomingBills.length === 0 ? (
                <p className="text-secondary text-[15px] px-[22px] py-5">
                  Nothing coming before payday
                </p>
              ) : (
                <ul>
                  {upcomingBills.map((bill, i) => {
                    const Icon = getBillIcon(bill.name);
                    return (
                      <li
                        key={`${bill.name}-${bill.dateLabel}-${i}`}
                        className={`flex items-center gap-3.5 min-h-[60px] px-[22px] py-3.5 ${
                          i > 0 ? "border-t border-border-subtle" : ""
                        }`}
                      >
                        <span className="chip-ico">
                          <Icon className="w-[19px] h-[19px]" strokeWidth={1.75} />
                        </span>
                        <div className="flex-1 min-w-0">
                          <p className="text-[17px] leading-snug">{bill.name}</p>
                          <p className="text-[13px] text-secondary">{bill.dateLabel}</p>
                        </div>
                        <span className="money text-[17px] font-semibold">
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

      <motion.div
        variants={staggerItem}
        className="fixed left-1/2 -translate-x-1/2 w-full max-w-[430px] px-6 z-30"
        style={{ bottom: "calc(58px + env(safe-area-inset-bottom) + 12px)" }}
      >
        <motion.button
          type="button"
          onClick={onLogSpend}
          className="btn-primary btn-primary-glow"
          whileTap={{ scale: 0.97 }}
        >
          <Plus className="w-5 h-5" strokeWidth={2} />
          Log a spend
        </motion.button>
      </motion.div>
    </motion.div>
  );
}
