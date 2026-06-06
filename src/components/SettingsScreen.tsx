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
  { id: "healthy" as const, label: "Healthy ($1,200)", desc: "$885 safe to spend" },
  { id: "tight" as const, label: "Tight ($400)", desc: "$85 safe — amber state" },
  { id: "danger" as const, label: "Over budget ($200)", desc: "Red alert before payday" },
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
      <header className="px-5 pt-4 pb-2">
        <h1 className="text-[28px] leading-[34px] font-semibold tracking-tight">Settings</h1>
      </header>

      <div className="flex-1 overflow-y-auto px-5 pb-4 space-y-6">
        <section>
          <h2 className="text-[14px] font-medium text-secondary uppercase tracking-wide mb-3">
            Account
          </h2>
          <div className="bg-surface rounded-[var(--r-lg)] shadow-e1 border border-border-subtle overflow-hidden">
            <label className="flex items-center justify-between min-h-[56px] px-5">
              <span className="text-[17px]">Current balance</span>
              <div className="flex items-center">
                <span className="text-secondary mr-1">$</span>
                <input
                  type="number"
                  inputMode="decimal"
                  value={data.balance || ""}
                  onChange={(e) => onUpdateBalance(Number(e.target.value) || 0)}
                  className="money w-24 text-right text-[17px] bg-transparent focus:outline-none focus:ring-2 focus:ring-[var(--focus-ring)] rounded-[var(--r-xs)] px-1"
                />
              </div>
            </label>
            <div className="border-t border-border-subtle flex items-center justify-between min-h-[56px] px-5">
              <span className="text-[17px]">Next payday</span>
              <span className="text-secondary text-[15px]">
                {format(new Date(data.nextPayday), "MMM d, yyyy")}
              </span>
            </div>
            <div className="border-t border-border-subtle flex items-center justify-between min-h-[56px] px-5">
              <span className="text-[17px]">Pay amount</span>
              <span className="money text-secondary text-[15px]">{formatMoney(data.payAmount)}</span>
            </div>
            <div className="border-t border-border-subtle flex items-center justify-between min-h-[56px] px-5">
              <span className="text-[17px]">Frequency</span>
              <span className="text-secondary text-[15px]">
                {FREQUENCY_LABELS[data.payFrequency]}
              </span>
            </div>
          </div>
          <p className="text-tertiary text-[13px] mt-2 px-1">
            Run setup again to change pay schedule
          </p>
        </section>

        <section>
          <h2 className="text-[14px] font-medium text-secondary uppercase tracking-wide mb-3">
            Preview scenarios
          </h2>
          <div className="space-y-2">
            {DEMOS.map((demo) => (
              <button
                key={demo.id}
                type="button"
                onClick={() => onLoadDemo(demo.id)}
                className="w-full text-left bg-surface rounded-[var(--r-lg)] px-5 py-4 shadow-e1 border border-border-subtle min-h-[56px]"
              >
                <p className="text-[17px] font-medium">{demo.label}</p>
                <p className="text-[13px] text-secondary mt-0.5">{demo.desc}</p>
              </button>
            ))}
          </div>
        </section>

        <button
          type="button"
          onClick={onPreviewPayday}
          className="w-full text-left rich-card min-h-[56px] flex flex-col justify-center"
        >
          <p className="text-[17px] font-medium">Preview payday moment</p>
          <p className="text-[13px] text-secondary mt-0.5">See the celebratory reset screen</p>
        </button>

        <button
          type="button"
          onClick={onReset}
          className="w-full flex items-center justify-center gap-2 h-[52px] rounded-[var(--r-md)] border border-border-subtle text-secondary text-[15px]"
        >
          <RotateCcw className="w-4 h-4" strokeWidth={1.75} />
          Reset & run setup again
        </button>
      </div>
    </div>
  );
}
