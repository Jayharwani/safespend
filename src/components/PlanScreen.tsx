import { useState } from "react";
import { format } from "date-fns";
import { Plus, Receipt, Wallet } from "lucide-react";
import { motion } from "framer-motion";
import type { AppData, BudgetProjection } from "../types";
import { formatMoney } from "../lib/finance";
import BalanceChart from "./BalanceChart";
import MonthStrip from "./MonthStrip";
import EmptyBillsIllustration from "./illustrations/EmptyBillsIllustration";

interface PlanScreenProps {
  data: AppData;
  projection: BudgetProjection;
  onAddBill: () => void;
  onAddIncome: () => void;
}

type PlanView = "month" | "items";

export default function PlanScreen({ data, projection, onAddBill, onAddIncome }: PlanScreenProps) {
  const [view, setView] = useState<PlanView>("month");
  const spends = data.oneOffs
    .filter((e) => e.type === "spend")
    .sort((a, b) => b.date.localeCompare(a.date));

  return (
    <div className="flex-1 flex flex-col tab-content">
      <header className="px-6 pt-5 pb-2">
        <h1 className="text-[32px] font-bold tracking-tight text-primary leading-tight">Plan</h1>
        <p className="text-secondary text-[14px] mt-0.5">Bills, income, and your monthly forecast</p>
      </header>

      {/* Segmented Control */}
      <div className="px-6 mb-5">
        <div className="flex gap-1 p-1 bg-canvas border border-border-subtle rounded-full relative">
          {(["month", "items"] as const).map((v) => {
            const isTabActive = view === v;
            return (
              <button
                key={v}
                type="button"
                aria-selected={isTabActive}
                onClick={() => setView(v)}
                className="relative flex-1 h-[40px] rounded-full text-[14px] font-semibold z-10 cursor-pointer outline-none"
                style={{ color: isTabActive ? "var(--brand)" : "var(--ink-soft)" }}
              >
                {isTabActive && (
                  <motion.div
                    layoutId="planTabActiveIndicator"
                    className="absolute inset-0 bg-surface shadow-sm rounded-full -z-10 border border-border-subtle"
                    transition={{ type: "spring", stiffness: 350, damping: 30 }}
                  />
                )}
                {v === "month" ? "This month" : "All items"}
              </button>
            );
          })}
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 overflow-y-auto px-6 pb-32 space-y-6">
        {view === "month" && (
          <div className="space-y-6">
            <section>
              <h2 className="text-[12px] font-bold uppercase tracking-wider text-secondary mb-3 pl-1">
                Daily Calendar
              </h2>
              <div className="rich-card mb-5">
                <MonthStrip projection={projection} />
              </div>
            </section>
            
            <section>
              <h2 className="text-[12px] font-bold uppercase tracking-wider text-secondary mb-3 pl-1">
                Balance Forecast
              </h2>
              <div className="rich-card">
                <BalanceChart data={projection.chartData} status={projection.status} />
              </div>
            </section>
          </div>
        )}

        {view === "items" && (
          <div className="space-y-6">
            <section>
              <div className="flex items-center justify-between mb-3 px-1">
                <h2 className="text-[12px] font-bold uppercase tracking-wider text-secondary">
                  Recurring expenses
                </h2>
                <button
                  type="button"
                  onClick={onAddBill}
                  className="text-brand text-[13px] font-semibold flex items-center gap-0.5 min-h-[32px] hover:opacity-85 cursor-pointer"
                >
                  + Add bill
                </button>
              </div>

              {data.bills.length === 0 ? (
                <div className="rich-card text-center py-8">
                  <EmptyBillsIllustration />
                  <p className="text-[16px] font-bold mb-1">No recurring expenses</p>
                  <p className="text-secondary text-[13px] mb-5 max-w-[240px] mx-auto">
                    Add your bills, subscriptions, or rent to get an accurate spending projection.
                  </p>
                  <button
                    type="button"
                    onClick={onAddBill}
                    className="btn-primary max-w-[200px] mx-auto h-[48px]"
                  >
                    Add a bill
                  </button>
                </div>
              ) : (
                <ul className="rich-card p-0 overflow-hidden divide-y divide-border-subtle">
                  {data.bills.map((bill) => (
                    <li
                      key={bill.id}
                      className="flex items-center gap-4 px-5 py-4 hover:bg-canvas/20 transition-colors"
                    >
                      <div className="chip-ico">
                        <Receipt className="w-[19px] h-[19px]" strokeWidth={2} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-[16px] font-semibold text-primary truncate">{bill.name}</p>
                        <p className="text-[12px] text-secondary mt-0.5">Day {bill.dayOfMonth} each month</p>
                      </div>
                      <p className="money text-[16px] font-bold text-secondary">
                        {formatMoney(bill.amount)}
                      </p>
                    </li>
                  ))}
                </ul>
              )}
            </section>

            {spends.length > 0 && (
              <section>
                <h2 className="text-[12px] font-bold uppercase tracking-wider text-secondary mb-3 pl-1">
                  Recent spending logs
                </h2>
                <ul className="rich-card p-0 overflow-hidden divide-y divide-border-subtle">
                  {spends.slice(0, 8).map((spend) => (
                    <li
                      key={spend.id}
                      className="flex items-center gap-4 px-5 py-4 hover:bg-canvas/20 transition-colors"
                    >
                      <div className="chip-ico">
                        <Wallet className="w-[19px] h-[19px]" strokeWidth={2} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-[16px] font-semibold text-primary truncate">{spend.name}</p>
                        <p className="text-[12px] text-secondary mt-0.5">
                          {format(new Date(spend.date), "MMM d, yyyy")}
                        </p>
                      </div>
                      <p className="money text-[16px] font-bold text-secondary">
                        −{formatMoney(spend.amount)}
                      </p>
                    </li>
                  ))}
                </ul>
              </section>
            )}

            <button
              type="button"
              onClick={onAddIncome}
              className="w-full h-[52px] rounded-2xl bg-brand-tint dark:bg-brand-soft text-brand hover:bg-brand/15 font-semibold text-[15px] flex items-center justify-center gap-2 transition-all cursor-pointer border border-border-subtle"
            >
              <Plus className="w-4.5 h-4.5" strokeWidth={2.5} />
              Add one-off income
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
