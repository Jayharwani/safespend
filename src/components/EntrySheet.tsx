import { useEffect, useState } from "react";
import { format } from "date-fns";
import { AnimatePresence, motion } from "framer-motion";
import { X } from "lucide-react";
import type { EntryType } from "../types";
import { springSoft } from "../lib/motion";

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
  { value: "spend", label: "Spend", description: "Something you bought today" },
  { value: "bill", label: "Bill", description: "A payment coming soon" },
  { value: "income", label: "Income", description: "Bonus, refund, side gig" },
];

const inputClass =
  "w-full h-[54px] bg-surface border border-border-subtle rounded-[var(--r-button)] px-4 text-[17px] focus:outline-none";

export default function EntrySheet({ open, onClose, onSubmit, initial }: EntrySheetProps) {
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

  const titles: Record<EntryType, string> = {
    spend: "Log a spend",
    bill: "Add a bill",
    income: "Add income",
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !amount || Number(amount) <= 0) return;
    onSubmit({ name: name.trim(), amount: Number(amount), date, type });
    onClose();
  };

  return (
    <AnimatePresence>
      {open && (
        <div className="fixed inset-0 z-50 flex items-end justify-center">
          <motion.div
            className="absolute inset-0"
            style={{ background: "rgba(20,30,24,0.45)" }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            aria-hidden
          />
          <motion.div
            role="dialog"
            aria-modal
            aria-labelledby="sheet-title"
            className="relative w-full max-w-[430px] bg-surface rounded-t-[28px] px-6 pt-3"
            style={{
              boxShadow: "var(--shadow-lg)",
              paddingBottom: "max(2rem, env(safe-area-inset-bottom))",
            }}
            drag="y"
            dragConstraints={{ top: 0 }}
            dragElastic={0.2}
            onDragEnd={(_, info) => info.offset.y > 120 && onClose()}
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%" }}
            transition={springSoft}
          >
            <div
              className="w-9 h-1 rounded-full mx-auto mb-5 cursor-grab"
              style={{ background: "var(--hairline)" }}
            />

            <div className="flex items-center justify-between mb-5">
              <h2 id="sheet-title" className="text-[22px] font-semibold">
                {titles[type]}
              </h2>
              <motion.button
                type="button"
                onClick={onClose}
                whileTap={{ scale: 0.97 }}
                className="w-11 h-11 rounded-full bg-canvas flex items-center justify-center text-secondary shadow-e1"
              >
                <X className="w-5 h-5" strokeWidth={1.75} />
              </motion.button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="flex gap-1 p-1 bg-canvas rounded-[var(--r-pill)]">
                {TYPES.map((t) => (
                  <button
                    key={t.value}
                    type="button"
                    onClick={() => setType(t.value)}
                    className={`flex-1 h-[40px] rounded-[var(--r-pill)] text-[13px] font-medium ${
                      type === t.value ? "bg-surface text-brand shadow-e1" : "text-secondary"
                    }`}
                  >
                    {t.label}
                  </button>
                ))}
              </div>
              <p className="text-tertiary text-[13px] -mt-2">
                {TYPES.find((t) => t.value === type)?.description}
              </p>

              <label className="block">
                <span className="text-[14px] font-medium text-secondary mb-1.5 block">Name</span>
                <input
                  type="text"
                  placeholder={
                    type === "spend" ? "New shoes" : type === "bill" ? "Car repair" : "Freelance gig"
                  }
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className={inputClass}
                  autoFocus
                />
              </label>

              <label className="block">
                <span className="text-[14px] font-medium text-secondary mb-1.5 block">Amount</span>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-secondary">$</span>
                  <input
                    type="number"
                    inputMode="decimal"
                    placeholder="120"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    className={`money ${inputClass} pl-9 text-[22px] font-semibold`}
                  />
                </div>
              </label>

              <label className="block">
                <span className="text-[14px] font-medium text-secondary mb-1.5 block">Date</span>
                <input
                  type="date"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  className={inputClass}
                />
              </label>

              <motion.button
                type="submit"
                disabled={!name.trim() || !amount || Number(amount) <= 0}
                whileTap={{ scale: 0.97 }}
                className="btn-primary mt-2 disabled:opacity-40 disabled:cursor-not-allowed"
              >
                {type === "spend" ? "Log spend" : type === "bill" ? "Add bill" : "Add income"}
              </motion.button>
            </form>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
