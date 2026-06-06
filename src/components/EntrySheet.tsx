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
          {/* Backdrop */}
          <motion.div
            className="absolute inset-0 bg-[#0e1210]/40 dark:bg-[#000000]/60 backdrop-blur-[6px]"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            aria-hidden
          />
          
          {/* Sheet Drawer */}
          <motion.div
            role="dialog"
            aria-modal
            aria-labelledby="sheet-title"
            className="relative w-full max-w-[430px] bg-surface rounded-t-[32px] px-6 pt-3 border-t border-border-subtle"
            style={{
              boxShadow: "var(--shadow-lg)",
              paddingBottom: "max(2rem, env(safe-area-inset-bottom) + 12px)",
            }}
            drag="y"
            dragConstraints={{ top: 0 }}
            dragElastic={0.25}
            onDragEnd={(_, info) => info.offset.y > 140 && onClose()}
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%" }}
            transition={springSoft}
          >
            {/* Grab handle */}
            <div
              className="w-10 h-1.5 rounded-full mx-auto mb-4 cursor-grab bg-border-subtle"
            />

            {/* Header */}
            <div className="flex items-center justify-between mb-5">
              <h2 id="sheet-title" className="text-[22px] font-bold text-primary">
                {titles[type]}
              </h2>
              <button
                type="button"
                onClick={onClose}
                className="w-9 h-9 rounded-full bg-canvas border border-border-subtle flex items-center justify-center text-secondary hover:text-primary transition-colors cursor-pointer"
                aria-label="Close modal"
              >
                <X className="w-4 h-4" strokeWidth={2.5} />
              </button>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-5">
              
              {/* Sliding Entry Type Selector */}
              <div className="space-y-2">
                <div className="flex gap-1 p-1 bg-canvas border border-border-subtle rounded-full relative">
                  {TYPES.map((t) => {
                    const isTypeActive = type === t.value;
                    return (
                      <button
                        key={t.value}
                        type="button"
                        onClick={() => setType(t.value)}
                        className="relative flex-1 h-[38px] rounded-full text-[13px] font-bold z-10 cursor-pointer outline-none"
                        style={{ color: isTypeActive ? "var(--brand)" : "var(--ink-soft)" }}
                      >
                        {isTypeActive && (
                          <motion.div
                            layoutId="sheetTypeActiveIndicator"
                            className="absolute inset-0 bg-surface shadow-sm rounded-full -z-10 border border-border-subtle"
                            transition={{ type: "spring", stiffness: 350, damping: 30 }}
                          />
                        )}
                        {t.label}
                      </button>
                    );
                  })}
                </div>
                <p className="text-secondary text-[12px] pl-1.5 font-medium">
                  {TYPES.find((t) => t.value === type)?.description}
                </p>
              </div>

              {/* Inputs */}
              <div className="space-y-4">
                <div className="space-y-1.5">
                  <label className="text-[12px] font-bold uppercase tracking-wider text-secondary pl-1 block">
                    Description
                  </label>
                  <input
                    type="text"
                    placeholder={
                      type === "spend" ? "E.g. New shoes, Grocery" : type === "bill" ? "E.g. Rent, Internet" : "E.g. Salary, Refund"
                    }
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="form-input w-full h-[50px]"
                    autoFocus
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-[12px] font-bold uppercase tracking-wider text-secondary pl-1 block">
                    Amount
                  </label>
                  <div className="relative">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-secondary font-medium">$</span>
                    <input
                      type="number"
                      inputMode="decimal"
                      placeholder="0.00"
                      value={amount}
                      onChange={(e) => setAmount(e.target.value)}
                      className="form-input money w-full h-[50px] !pl-8 text-[18px] font-bold"
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-[12px] font-bold uppercase tracking-wider text-secondary pl-1 block">
                    Date
                  </label>
                  <input
                    type="date"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    className="form-input w-full h-[50px]"
                  />
                </div>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={!name.trim() || !amount || Number(amount) <= 0}
                className="btn-primary w-full h-[52px] mt-4 disabled:opacity-40 disabled:cursor-not-allowed disabled:pointer-events-none"
              >
                {type === "spend" ? "Log spend" : type === "bill" ? "Add bill" : "Add income"}
              </button>
            </form>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
