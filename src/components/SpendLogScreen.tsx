import { format } from "date-fns";
import { ChevronLeft } from "lucide-react";
import type { AppData } from "../types";
import { formatMoney } from "../lib/finance";

interface SpendLogScreenProps {
  data: AppData;
  onBack: () => void;
}

export default function SpendLogScreen({ data, onBack }: SpendLogScreenProps) {
  const spends = data.oneOffs
    .filter((e) => e.type === "spend")
    .sort((a, b) => b.date.localeCompare(a.date));

  const total = spends.reduce((s, e) => s + e.amount, 0);

  return (
    <div className="app-shell">
      <header className="flex items-center gap-3 px-5 pt-6 pb-2">
        <button
          type="button"
          onClick={onBack}
          className="w-10 h-10 rounded-full bg-surface border border-border-subtle shadow-e1 flex items-center justify-center text-secondary hover:text-primary transition-colors cursor-pointer"
          aria-label="Go back"
        >
          <ChevronLeft className="w-5 h-5" strokeWidth={2} />
        </button>
        <h1 className="text-[20px] font-bold text-primary">Spending History</h1>
      </header>

      <div className="flex-1 overflow-y-auto px-6 pb-12 pt-3 space-y-6">
        <div className="rich-card text-center py-6">
          <p className="text-[12px] font-bold uppercase tracking-wider text-secondary mb-1">Total spend logged</p>
          <p className="money text-[40px] font-bold text-primary">−{formatMoney(total)}</p>
          <p className="text-[11px] text-secondary mt-1">in this payment cycle</p>
        </div>

        {spends.length === 0 ? (
          <div className="rich-card text-center py-10">
            <p className="text-[16px] font-bold mb-1">No spending logged</p>
            <p className="text-secondary text-[13px]">Transactions you log on the dashboard will appear here.</p>
          </div>
        ) : (
          <div className="space-y-3">
            <h2 className="text-[12px] font-bold uppercase tracking-wider text-secondary pl-1">Logged expenses</h2>
            <ul className="rich-card p-0 overflow-hidden divide-y divide-border-subtle">
              {spends.map((spend) => (
                <li
                  key={spend.id}
                  className="flex justify-between items-center px-5 py-4 hover:bg-canvas/20 transition-colors"
                >
                  <div className="min-w-0 flex-1 pr-4">
                    <p className="text-[15px] font-semibold text-primary truncate">{spend.name}</p>
                    <p className="text-[12px] text-secondary mt-0.5">
                      {format(new Date(spend.date), "MMM d, yyyy")}
                    </p>
                  </div>
                  <span className="money text-[15px] font-bold text-secondary shrink-0">
                    −{formatMoney(spend.amount)}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}
