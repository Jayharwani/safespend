import { useEffect, useState } from "react";
import { format } from "date-fns";
import { AnimatePresence, motion } from "framer-motion";
import { X, CalendarBlank } from "../lib/icons";
import type { EntryType } from "../types";
import { springSoft } from "../lib/motion";
import { currencySymbol } from "../lib/finance";

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

const TYPES: { value: EntryType; label: string; hint: string }[] = [
  { value: "spend", label: "Spend", hint: "Something you bought today" },
  { value: "bill", label: "Bill", hint: "A payment coming soon" },
  { value: "income", label: "Income", hint: "Bonus, refund, side gig" },
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
        <div
          style={{
            position: "fixed",
            inset: 0,
            zIndex: 50,
            display: "flex",
            alignItems: "flex-end",
            justifyContent: "center",
          }}
        >
          <motion.div
            className="sheet-backdrop"
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
            className="sheet"
            style={{
              position: "relative",
              width: "100%",
              maxWidth: 430,
              paddingBottom: "max(2rem, env(safe-area-inset-bottom) + 16px)",
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
            <div className="grab" />

            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                marginBottom: 22,
              }}
            >
              <h2
                id="sheet-title"
                style={{ fontSize: 22, fontWeight: 600, letterSpacing: "-0.02em" }}
              >
                {titles[type]}
              </h2>
              <button
                type="button"
                onClick={onClose}
                className="icon-btn"
                aria-label="Close"
                style={{ width: 36, height: 36 }}
              >
                <X size={16} weight="bold" />
              </button>
            </div>

            <form onSubmit={handleSubmit} style={{ display: "grid", gap: 18 }}>
              <div>
                <div className="segmented" role="tablist" aria-label="Entry type">
                  {TYPES.map((t) => (
                    <button
                      key={t.value}
                      type="button"
                      role="tab"
                      aria-selected={type === t.value}
                      onClick={() => setType(t.value)}
                      style={{ position: "relative" }}
                    >
                      {type === t.value && (
                        <motion.span
                          layoutId="sheet-type-pill"
                          style={{
                            position: "absolute",
                            inset: 0,
                            borderRadius: 10,
                            background: "var(--surface-2)",
                            boxShadow: "var(--shadow-sm), var(--edge-light)",
                            zIndex: -1,
                          }}
                          transition={{ type: "spring", stiffness: 420, damping: 36 }}
                        />
                      )}
                      {t.label}
                    </button>
                  ))}
                </div>
                <p
                  style={{
                    fontSize: 12,
                    color: "var(--ink-faint)",
                    marginTop: 10,
                    paddingLeft: 6,
                    fontWeight: 500,
                  }}
                >
                  {TYPES.find((t) => t.value === type)?.hint}
                </p>
              </div>

              <div className="field">
                <label htmlFor="entry-name">Name</label>
                <input
                  id="entry-name"
                  type="text"
                  placeholder={
                    type === "spend"
                      ? "Groceries, coffee…"
                      : type === "bill"
                        ? "Rent, internet…"
                        : "Refund, side gig…"
                  }
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  autoFocus
                />
              </div>

              <div className="field">
                <label htmlFor="entry-amount">Amount</label>
                <div style={{ position: "relative" }}>
                  <span
                    style={{
                      position: "absolute",
                      left: 18,
                      top: "50%",
                      transform: "translateY(-50%)",
                      color: "var(--ink-soft)",
                      fontWeight: 600,
                      fontSize: 17,
                    }}
                  >
                    {currencySymbol()}                  </span>
                  <input
                    id="entry-amount"
                    type="number"
                    inputMode="decimal"
                    placeholder="0.00"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    className="money"
                    style={{ paddingLeft: 30, fontSize: 18, fontWeight: 700 }}
                  />
                </div>
              </div>

              <div className="field">
                <label htmlFor="entry-date">Date</label>
                <div style={{ position: "relative" }}>
                  <div
                    className="input"
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                    }}
                  >
                    <span style={{ color: "var(--ink)" }}>
                      {format(new Date(date + "T00:00:00"), "EEE, MMM d, yyyy")}
                    </span>
                    <CalendarBlank size={18} weight="regular" color="var(--ink-faint)" />
                  </div>
                  <input
                    id="entry-date"
                    type="date"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    aria-label="Date"
                    style={{
                      position: "absolute",
                      inset: 0,
                      width: "100%",
                      height: "100%",
                      opacity: 0,
                      border: "none",
                      background: "transparent",
                    }}
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={!name.trim() || !amount || Number(amount) <= 0}
                className="btn-primary"
                style={{ marginTop: 6 }}
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
