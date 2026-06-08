import { useEffect, useState } from "react";
import { format } from "date-fns";
import { AnimatePresence, motion } from "framer-motion";
import { X, Trash, CalendarBlank } from "../lib/icons";
import type { Bill, PayFrequency } from "../types";
import { springSoft } from "../lib/motion";
import { currencySymbol } from "../lib/finance";

export type EditTarget =
  | { kind: "balance"; balance: number }
  | { kind: "paycheck"; payAmount: number; payFrequency: PayFrequency; nextPayday: string }
  | { kind: "bill"; bill: Bill };

interface EditSheetProps {
  target: EditTarget | null;
  onClose: () => void;
  onSaveBalance: (balance: number) => void;
  onSavePaycheck: (p: { payAmount: number; payFrequency: PayFrequency; nextPayday: string }) => void;
  onSaveBill: (bill: Bill) => void;
  onDeleteBill: (id: string) => void;
}

const FREQUENCIES: { value: PayFrequency; label: string }[] = [
  { value: "weekly", label: "Weekly" },
  { value: "fortnightly", label: "Fortnightly" },
  { value: "monthly", label: "Monthly" },
];

export default function EditSheet({
  target,
  onClose,
  onSaveBalance,
  onSavePaycheck,
  onSaveBill,
  onDeleteBill,
}: EditSheetProps) {
  const [amount, setAmount] = useState("");
  const [name, setName] = useState("");
  const [freq, setFreq] = useState<PayFrequency>("fortnightly");
  const [date, setDate] = useState(format(new Date(), "yyyy-MM-dd"));
  const [day, setDay] = useState("1");

  const clampDay = (v: string) => Math.min(31, Math.max(1, parseInt(v, 10) || 1));

  useEffect(() => {
    if (!target) return;
    if (target.kind === "balance") {
      setAmount(String(target.balance || ""));
    } else if (target.kind === "paycheck") {
      setAmount(String(target.payAmount || ""));
      setFreq(target.payFrequency);
      setDate(target.nextPayday);
    } else {
      setName(target.bill.name);
      setAmount(String(target.bill.amount || ""));
      setDay(String(target.bill.dayOfMonth));
    }
  }, [target]);

  useEffect(() => {
    if (!target) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [target, onClose]);

  const titles: Record<EditTarget["kind"], string> = {
    balance: "Current balance",
    paycheck: "Your paycheck",
    bill: "Edit bill",
  };

  const valid = () => {
    if (!target) return false;
    if (target.kind === "bill") return name.trim() !== "" && Number(amount) > 0;
    return Number(amount) >= 0 && amount !== "";
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!target || !valid()) return;
    if (target.kind === "balance") onSaveBalance(Number(amount));
    else if (target.kind === "paycheck")
      onSavePaycheck({ payAmount: Number(amount), payFrequency: freq, nextPayday: date });
    else
      onSaveBill({
        id: target.bill.id,
        name: name.trim(),
        amount: Number(amount),
        dayOfMonth: clampDay(day),
      });
    onClose();
  };

  return (
    <AnimatePresence>
      {target && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            zIndex: 55,
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
              <h2 style={{ fontSize: 22, fontWeight: 600, letterSpacing: "-0.02em" }}>
                {titles[target.kind]}
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

            <form onSubmit={handleSave} style={{ display: "grid", gap: 18 }}>
              {target.kind === "bill" && (
                <div className="field">
                  <label>Name</label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Rent, internet…"
                    autoFocus
                  />
                </div>
              )}

              <div className="field">
                <label>{target.kind === "bill" ? "Amount" : target.kind === "paycheck" ? "Paycheck amount" : "Amount"}</label>
                <div style={{ position: "relative" }}>
                  <span
                    style={{
                      position: "absolute",
                      left: 18,
                      top: "50%",
                      transform: "translateY(-50%)",
                      color: "var(--ink-soft)",
                      fontWeight: 600,
                    }}
                  >
                    {currencySymbol()}                  </span>
                  <input
                    type="number"
                    inputMode="decimal"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    placeholder="0"
                    className="money"
                    style={{ paddingLeft: 30, fontWeight: 600 }}
                    autoFocus={target.kind !== "bill"}
                  />
                </div>
              </div>

              {target.kind === "paycheck" && (
                <>
                  <div className="field">
                    <label>How often</label>
                    <div className="segmented">
                      {FREQUENCIES.map((f) => (
                        <button
                          key={f.value}
                          type="button"
                          aria-selected={freq === f.value}
                          onClick={() => setFreq(f.value)}
                          style={{ position: "relative" }}
                        >
                          {freq === f.value && (
                            <motion.span
                              layoutId="edit-freq-pill"
                              style={{
                                position: "absolute",
                                inset: 0,
                                borderRadius: 10,
                                background: "var(--surface)",
                                boxShadow: "var(--shadow-sm)",
                                zIndex: -1,
                              }}
                              transition={{ type: "spring", stiffness: 420, damping: 36 }}
                            />
                          )}
                          {f.label}
                        </button>
                      ))}
                    </div>
                  </div>
                  <div className="field">
                    <label>Next payday</label>
                    <div style={{ position: "relative" }}>
                      <div
                        className="input"
                        style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}
                      >
                        <span style={{ color: "var(--ink)" }}>
                          {format(new Date(date + "T00:00:00"), "EEE, MMM d, yyyy")}
                        </span>
                        <CalendarBlank size={18} weight="regular" color="var(--ink-faint)" />
                      </div>
                      <input
                        type="date"
                        value={date}
                        onChange={(e) => setDate(e.target.value)}
                        aria-label="Next payday"
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
                </>
              )}

              {target.kind === "bill" && (
                <div className="field">
                  <label>Due day of month</label>
                  <input
                    type="text"
                    inputMode="numeric"
                    value={day}
                    onFocus={(e) => e.target.select()}
                    onChange={(e) => setDay(e.target.value.replace(/[^0-9]/g, "").slice(0, 2))}
                    onBlur={() => setDay(String(clampDay(day)))}
                    className="money"
                    placeholder="1"
                    aria-label="Due day of month (1 to 31)"
                  />
                  <p style={{ fontSize: 12, color: "var(--ink-faint)", marginTop: 6, paddingLeft: 4 }}>
                    The day each month this bill is due (1–31).
                  </p>
                </div>
              )}

              <button type="submit" disabled={!valid()} className="btn-primary" style={{ marginTop: 4 }}>
                Save
              </button>

              {target.kind === "bill" && (
                <button
                  type="button"
                  onClick={() => {
                    onDeleteBill(target.bill.id);
                    onClose();
                  }}
                  style={{
                    width: "100%",
                    height: 50,
                    border: "none",
                    background: "none",
                    color: "var(--over)",
                    fontSize: 15,
                    fontWeight: 600,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: 6,
                  }}
                >
                  <Trash size={18} weight="regular" />
                  Delete bill
                </button>
              )}
            </form>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
