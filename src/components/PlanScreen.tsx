import { useState } from "react";
import { format } from "date-fns";
import { Plus, Receipt, Wallet } from "lucide-react";
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
      <header className="px-6 pt-4 pb-2">
        <h1 className="text-[30px] leading-[1.15] font-semibold tracking-[-0.5px]">Plan</h1>
        <p className="text-secondary text-[15px] mt-1">Bills, income, and your forecast</p>
      </header>

      <div className="px-6 mb-5">
        <div className="flex gap-1 p-1 bg-canvas rounded-[14px]">
          {(["month", "items"] as const).map((v) => (
            <button
              key={v}
              type="button"
              aria-selected={view === v}
              onClick={() => setView(v)}
              className={`flex-1 h-[40px] rounded-[10px] text-[15px] font-medium ${
                view === v ? "bg-surface-raised text-primary shadow-e1" : "text-secondary"
              }`}
              style={view === v ? { background: "var(--surface-raised)" } : undefined}
            >
              {v === "month" ? "This month" : "All items"}
            </button>
          ))}
        </div>
      </div>

      <div className="flex-1 overflow-y-auto px-6 pb-6 space-y-7">
        {view === "month" && (
          <section>
            <h2 className="text-[14px] font-medium text-secondary uppercase tracking-wide mb-3">
              Daily balance
            </h2>
            <div className="rich-card mb-4">
              <MonthStrip projection={projection} />
            </div>
            <div className="rich-card">
              <BalanceChart data={projection.chartData} status={projection.status} />
            </div>
          </section>
        )}

        {view === "items" && (
          <section>
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-[14px] font-medium text-secondary uppercase tracking-wide">
                Recurring bills
              </h2>
              <button
                type="button"
                onClick={onAddBill}
                className="text-brand text-[15px] font-medium min-h-[44px] px-2"
              >
                + Add
              </button>
            </div>

            {data.bills.length === 0 ? (
              <div className="rich-card text-center py-6">
                <EmptyBillsIllustration />
                <p className="text-[17px] font-semibold mb-1">No bills yet</p>
                <p className="text-secondary text-[15px] mb-5 max-w-[240px] mx-auto">
                  Add your first bill and I'll start forecasting
                </p>
                <button type="button" onClick={onAddBill} className="btn-primary max-w-[220px] mx-auto">
                  Add a bill
                </button>
              </div>
            ) : (
              <ul className="rich-card p-0 overflow-hidden">
                {data.bills.map((bill, i) => (
                  <li
                    key={bill.id}
                    className={`flex items-center min-h-[60px] px-[22px] py-3 ${
                      i > 0 ? "border-t border-border-subtle" : ""
                    }`}
                  >
                    <div className="chip-ico mr-3.5">
                      <Receipt className="w-[19px] h-[19px]" strokeWidth={1.75} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-[17px] truncate">{bill.name}</p>
                      <p className="text-[13px] text-secondary">Day {bill.dayOfMonth} each month</p>
                    </div>
                    <p className="money text-[17px] font-semibold text-secondary">
                      {formatMoney(bill.amount)}
                    </p>
                  </li>
                ))}
              </ul>
            )}
          </section>
        )}

        {view === "items" && spends.length > 0 && (
          <section>
            <h2 className="text-[14px] font-medium text-secondary uppercase tracking-wide mb-3">
              Recent spends
            </h2>
            <ul className="rich-card p-0 overflow-hidden">
              {spends.slice(0, 8).map((spend, i) => (
                <li
                  key={spend.id}
                  className={`flex items-center min-h-[60px] px-[22px] py-3 ${
                    i > 0 ? "border-t border-border-subtle" : ""
                  }`}
                >
                  <div className="chip-ico mr-3.5">
                    <Wallet className="w-[19px] h-[19px]" strokeWidth={1.75} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-[17px] truncate">{spend.name}</p>
                    <p className="text-[13px] text-secondary">
                      {format(new Date(spend.date), "MMM d")}
                    </p>
                  </div>
                  <p className="money text-[17px] font-semibold text-secondary">
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
          className="w-full h-[54px] rounded-[var(--r-button)] bg-brand-tint text-brand font-semibold text-[17px] flex items-center justify-center gap-2"
        >
          <Plus className="w-5 h-5" strokeWidth={2} />
          Add income
        </button>
      </div>
    </div>
  );
}
