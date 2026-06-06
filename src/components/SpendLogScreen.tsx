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
      <header className="flex items-center gap-2 px-4 pt-4 pb-2 min-h-[44px]">
        <button
          type="button"
          onClick={onBack}
          className="icon-btn w-10 h-10 rounded-full bg-surface shadow-e1 flex items-center justify-center text-secondary"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>
        <h1 className="text-[17px] font-semibold">This cycle</h1>
      </header>

      <div className="px-6 pb-8">
        <div className="rich-card mb-6 text-center py-5">
          <p className="text-[14px] text-secondary mb-1">Total logged</p>
          <p className="money text-[36px] font-semibold text-primary">−{formatMoney(total)}</p>
        </div>

        {spends.length === 0 ? (
          <div className="rich-card text-center py-8">
            <p className="text-[17px] font-semibold mb-1">Nothing logged yet</p>
            <p className="text-secondary text-[15px]">Spends you log will show up here</p>
          </div>
        ) : (
          <ul className="rich-card p-0 overflow-hidden">
            {spends.map((spend, i) => (
              <li
                key={spend.id}
                className={`flex justify-between items-center min-h-[60px] px-[22px] py-3 ${
                  i > 0 ? "border-t border-border-subtle" : ""
                }`}
              >
                <div>
                  <p className="text-[17px]">{spend.name}</p>
                  <p className="text-[13px] text-secondary">
                    {format(new Date(spend.date), "MMM d, yyyy")}
                  </p>
                </div>
                <span className="money text-[17px] font-semibold text-secondary">
                  −{formatMoney(spend.amount)}
                </span>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
