import { format } from "date-fns";
import { RotateCcw } from "lucide-react";
import type { AppData } from "../types";
import { formatMoney } from "../lib/finance";

interface SettingsScreenProps {
  data: AppData;
  onUpdateBalance: (balance: number) => void;
  onLoadDemo: (scenario: "healthy" | "tight" | "danger") => void;
  onReset: () => void;
  onPreviewPayday: () => void;
}

const FREQUENCY_LABELS = {
  weekly: "Weekly",
  fortnightly: "Fortnightly",
  monthly: "Monthly",
};

const DEMOS = [
  { id: "healthy" as const, label: "Healthy balance ($1,200)", desc: "$885 safe to spend" },
  { id: "tight" as const, label: "Tight balance ($400)", desc: "$85 safe — amber warning state" },
  { id: "danger" as const, label: "Over budget ($200)", desc: "Negative balance warning before payday" },
];

export default function SettingsScreen({
  data,
  onUpdateBalance,
  onLoadDemo,
  onReset,
  onPreviewPayday,
}: SettingsScreenProps) {
  return (
    <div className="flex-1 flex flex-col tab-content">
      <header className="px-6 pt-5 pb-2">
        <h1 className="text-[32px] font-bold tracking-tight text-primary leading-tight">Settings</h1>
      </header>

      <div className="flex-1 overflow-y-auto px-6 pb-32 space-y-6">
        
        {/* Account settings */}
        <section>
          <h2 className="text-[12px] font-bold uppercase tracking-wider text-secondary mb-3 pl-1">
            Account settings
          </h2>
          <div className="bg-surface rounded-2xl shadow-sm border border-border-subtle overflow-hidden divide-y divide-border-subtle">
            <label className="flex items-center justify-between min-h-[56px] px-5 hover:bg-canvas/10 transition-colors">
              <span className="text-[15px] font-semibold text-primary">Current balance</span>
              <div className="flex items-center">
                <span className="text-secondary font-medium mr-1">$</span>
                <input
                  type="number"
                  inputMode="decimal"
                  value={data.balance || ""}
                  onChange={(e) => onUpdateBalance(Number(e.target.value) || 0)}
                  className="money w-24 text-right text-[16px] font-bold bg-transparent focus:outline-none focus:ring-2 focus:ring-[var(--focus-ring)] rounded-md px-1 py-0.5 border border-transparent focus:border-brand"
                />
              </div>
            </label>
            
            <div className="flex items-center justify-between min-h-[56px] px-5">
              <span className="text-[15px] font-semibold text-primary">Next payday</span>
              <span className="text-secondary text-[14px] font-medium">
                {format(new Date(data.nextPayday), "MMM d, yyyy")}
              </span>
            </div>
            
            <div className="flex items-center justify-between min-h-[56px] px-5">
              <span className="text-[15px] font-semibold text-primary">Paycheck amount</span>
              <span className="money text-secondary text-[14px] font-bold">{formatMoney(data.payAmount)}</span>
            </div>
            
            <div className="flex items-center justify-between min-h-[56px] px-5">
              <span className="text-[15px] font-semibold text-primary">Pay frequency</span>
              <span className="text-secondary text-[14px] font-medium">
                {FREQUENCY_LABELS[data.payFrequency]}
              </span>
            </div>
          </div>
          <p className="text-secondary text-[12px] mt-2 px-1">
            To change your payday details or schedule, please reset and run setup again.
          </p>
        </section>

        {/* Demo Scenarios */}
        <section>
          <h2 className="text-[12px] font-bold uppercase tracking-wider text-secondary mb-3 pl-1">
            Preview demo scenarios
          </h2>
          <div className="space-y-2.5">
            {DEMOS.map((demo) => (
              <button
                key={demo.id}
                type="button"
                onClick={() => onLoadDemo(demo.id)}
                className="w-full text-left bg-surface hover:bg-canvas/20 rounded-2xl px-5 py-3.5 shadow-sm border border-border-subtle min-h-[56px] transition-colors cursor-pointer"
              >
                <p className="text-[15px] font-semibold text-primary">{demo.label}</p>
                <p className="text-[12px] text-secondary mt-0.5">{demo.desc}</p>
              </button>
            ))}
          </div>
        </section>

        {/* Actions */}
        <section className="space-y-3">
          <button
            type="button"
            onClick={onPreviewPayday}
            className="w-full text-left bg-surface hover:bg-canvas/20 rounded-2xl px-5 py-3.5 shadow-sm border border-border-subtle min-h-[56px] flex flex-col justify-center transition-colors cursor-pointer"
          >
            <p className="text-[15px] font-semibold text-primary">Preview payday celebration</p>
            <p className="text-[12px] text-secondary mt-0.5">Show the interactive payday reset screen</p>
          </button>

          <button
            type="button"
            onClick={onReset}
            className="w-full flex items-center justify-center gap-2 h-[50px] rounded-2xl border border-border-subtle hover:border-over hover:text-over text-secondary text-[14px] font-semibold transition-colors cursor-pointer bg-transparent"
          >
            <RotateCcw className="w-4 h-4" strokeWidth={2} />
            Reset app & clear all data
          </button>
        </section>

      </div>
    </div>
  );
}
