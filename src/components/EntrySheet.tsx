import { useEffect, useState } from "react";
import { format } from "date-fns";
import { X } from "lucide-react";
import type { EntryType } from "../types";

export interface SheetEntry {
  name: string;
  amount: number;
  date: string;
  type: EntryType;
}

interface EntrySheetProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (entry: SheetEntry) => void;
  initial?: Partial<SheetEntry>;
}

const TYPES: { value: EntryType; label: string; description: string }[] = [
  { value: "spend", label: "One-off spend", description: "Something you bought today" },
  { value: "bill", label: "Upcoming bill", description: "A payment coming soon" },
  { value: "income", label: "Extra income", description: "Bonus, refund, side gig" },
];

export default function EntrySheet({
  open,
  onClose,
  onSubmit,
  initial,
}: EntrySheetProps) {
  const [name, setName] = useState("");
  const [amount, setAmount] = useState("");
  const [date, setDate] = useState(format(new Date(), "yyyy-MM-dd"));
  const [type, setType] = useState<EntryType>("spend");

  useEffect(() => {
    if (open) {
      setName(initial?.name ?? "");
      setAmount(initial?.amount ? String(initial.amount) : "");
      setDate(initial?.date ?? format(new Date(), "yyyy-MM-dd"));
      setType(initial?.type ?? "spend");
    }
  }, [open, initial]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [open, onClose]);

  if (!open) return null;

  const titles: Record<EntryType, string> = {
    spend: "Log a spend",
    bill: "Add a bill",
    income: "Add income",
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !amount || Number(amount) <= 0) return;
    onSubmit({
      name: name.trim(),
      amount: Number(amount),
      date,
      type,
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center">
      <div
        className="absolute inset-0 bg-black/60 animate-backdrop"
        onClick={onClose}
        aria-hidden
      />
      <div
        role="dialog"
        aria-modal
        aria-labelledby="sheet-title"
        className="relative w-full max-w-md bg-surface-raised border-t border-border rounded-t-3xl px-5 pt-5 pb-8 animate-slide-up"
        style={{ paddingBottom: "max(2rem, env(safe-area-inset-bottom))" }}
      >
        <div className="w-10 h-1 bg-border rounded-full mx-auto mb-5" />

        <div className="flex items-center justify-between mb-5">
          <h2 id="sheet-title" className="text-lg font-semibold">
            {titles[type]}
          </h2>
          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-surface-overlay flex items-center justify-center text-text-muted hover:text-text transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="flex gap-2">
            {TYPES.map((t) => (
              <button
                key={t.value}
                type="button"
                onClick={() => setType(t.value)}
                className={`flex-1 py-2.5 px-2 rounded-xl text-xs font-medium transition-all leading-tight ${
                  type === t.value
                    ? "bg-safe/20 text-safe border border-safe/40"
                    : "bg-surface border border-border text-text-muted"
                }`}
              >
                {t.label}
              </button>
            ))}
          </div>
          <p className="text-text-muted text-xs -mt-2">
            {TYPES.find((t) => t.value === type)?.description}
          </p>

          <label className="block">
            <span className="text-text-muted text-sm mb-1.5 block">Name</span>
            <input
              type="text"
              placeholder={type === "spend" ? "New shoes" : type === "bill" ? "Car repair" : "Freelance gig"}
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full bg-surface border border-border rounded-xl px-4 py-3.5 text-base focus:outline-none focus:ring-2 focus:ring-safe/40 focus:border-safe"
              autoFocus
            />
          </label>

          <label className="block">
            <span className="text-text-muted text-sm mb-1.5 block">Amount</span>
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-text-muted">$</span>
              <input
                type="number"
                inputMode="decimal"
                placeholder="120"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="w-full bg-surface border border-border rounded-xl pl-9 pr-4 py-3.5 text-xl font-semibold focus:outline-none focus:ring-2 focus:ring-safe/40 focus:border-safe"
              />
            </div>
          </label>

          <label className="block">
            <span className="text-text-muted text-sm mb-1.5 block">Date</span>
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="w-full bg-surface border border-border rounded-xl px-4 py-3.5 text-base focus:outline-none focus:ring-2 focus:ring-safe/40 focus:border-safe [color-scheme:dark]"
            />
          </label>

          <button
            type="submit"
            disabled={!name.trim() || !amount || Number(amount) <= 0}
            className="w-full bg-safe text-surface font-semibold py-4 rounded-2xl mt-2 disabled:opacity-40 disabled:cursor-not-allowed hover:brightness-110 active:scale-[0.98] transition-all"
          >
            {type === "spend" ? "Log spend" : type === "bill" ? "Add bill" : "Add income"}
          </button>
        </form>
      </div>
    </div>
  );
}
