import { useState } from "react";
import { format, addDays } from "date-fns";
import { CaretLeft, Plus, Trash, Wallet, CalendarBlank, Receipt } from "../lib/icons";
import { motion, AnimatePresence } from "framer-motion";
import type { AppData, Bill, PayFrequency } from "../types";
import { generateId } from "../lib/storage";
import { formatMoney, currencySymbol } from "../lib/finance";
import { easeOut } from "../lib/motion";
import AuroraBackground from "./AuroraBackground";

interface SetupFlowProps {
  onComplete: (data: Partial<AppData>) => void;
}

const FREQUENCIES: { value: PayFrequency; label: string }[] = [
  { value: "weekly", label: "Weekly" },
  { value: "fortnightly", label: "Fortnightly" },
  { value: "monthly", label: "Monthly" },
];

const STEPS = [
  { icon: Wallet, eyebrow: "Your money", title: "What's in your account?", sub: "A rough number is fine — edit it anytime." },
  { icon: CalendarBlank, eyebrow: "Your income", title: "When do you get paid?", sub: "We use this to mark the end of each cycle." },
  { icon: Receipt, eyebrow: "Your bills", title: "What's coming up?", sub: "Add the big regulars — rent, phone, car." },
];

export default function SetupFlow({ onComplete }: SetupFlowProps) {
  const [step, setStep] = useState(0);
  const [balance, setBalance] = useState("");
  const [payAmount, setPayAmount] = useState("");
  const [nextPayday, setNextPayday] = useState(
    format(addDays(new Date(), 15), "yyyy-MM-dd")
  );
  const [payFrequency, setPayFrequency] = useState<PayFrequency>("fortnightly");
  const [bills, setBills] = useState<Bill[]>([
    { id: generateId(), name: "", amount: 0, dayOfMonth: 1 },
  ]);

  const canProceed = () => {
    if (step === 0) return balance !== "" && Number(balance) >= 0;
    if (step === 1) return payAmount !== "" && Number(payAmount) > 0 && nextPayday !== "";
    return true;
  };

  const handleFinish = () => {
    const validBills = bills.filter((b) => b.name.trim() && b.amount > 0);
    onComplete({
      balance: Number(balance),
      payAmount: Number(payAmount),
      nextPayday,
      payFrequency,
      bills: validBills,
      setupComplete: true,
      welcomeSeen: true,
    });
  };

  const addBill = () =>
    setBills([...bills, { id: generateId(), name: "", amount: 0, dayOfMonth: 1 }]);
  const updateBill = (id: string, patch: Partial<Bill>) =>
    setBills(bills.map((b) => (b.id === id ? { ...b, ...patch } : b)));
  const removeBill = (id: string) =>
    bills.length > 1 && setBills(bills.filter((b) => b.id !== id));

  const StepIcon = STEPS[step].icon;
  const validBillCount = bills.filter((b) => b.name.trim() && b.amount > 0).length;

  return (
    <>
      <AuroraBackground />
      <div className="app-shell" role="main">
        <div
          style={{
            flex: 1,
            display: "flex",
            flexDirection: "column",
            padding: "16px 24px 28px",
          }}
        >
          {/* Top bar */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              marginBottom: 20,
            }}
          >
            {step > 0 ? (
              <button
                type="button"
                onClick={() => setStep(step - 1)}
                className="icon-btn"
                aria-label="Back"
                style={{ width: 40, height: 40 }}
              >
                <CaretLeft size={18} weight="bold" />
              </button>
            ) : (
              <span style={{ width: 40 }} />
            )}
            <div className="steps" style={{ flex: 1, margin: "0 16px" }}>
              {[0, 1, 2].map((i) => (
                <span key={i} className={i <= step ? "done" : ""} />
              ))}
            </div>
            <span
              style={{
                fontSize: 13,
                color: "var(--ink-soft)",
                fontWeight: 700,
                minWidth: 40,
                textAlign: "right",
              }}
            >
              {step + 1}/3
            </span>
          </div>

          <AnimatePresence mode="wait">
            <motion.div
              key={step}
              initial={{ opacity: 0, x: 24 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -16 }}
              transition={{ duration: 0.42, ease: easeOut }}
              style={{ flex: 1, display: "flex", flexDirection: "column" }}
            >
              {/* Contextual icon badge */}
              <div
                style={{
                  width: 60,
                  height: 60,
                  borderRadius: 18,
                  background: "var(--surface)",
                  border: "1px solid var(--hairline)",
                  boxShadow: "var(--shadow-sm), var(--edge-light)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: "var(--accent)",
                  marginBottom: 20,
                }}
              >
                <StepIcon size={28} weight="duotone" />
              </div>

              {/* Heading */}
              <p
                style={{
                  fontSize: 12,
                  fontWeight: 700,
                  color: "var(--accent)",
                  letterSpacing: "0.1em",
                  textTransform: "uppercase",
                  marginBottom: 8,
                }}
              >
                {STEPS[step].eyebrow}
              </p>
              <h1
                style={{
                  fontSize: 28,
                  fontWeight: 600,
                  letterSpacing: "-0.03em",
                  lineHeight: 1.15,
                }}
              >
                {STEPS[step].title}
              </h1>
              <p style={{ fontSize: 15, color: "var(--ink-soft)", marginTop: 10, fontWeight: 500 }}>
                {STEPS[step].sub}
              </p>

              {/* Body */}
              <div style={{ flex: 1, marginTop: 28 }}>
                {step === 0 && (
                  <div
                    className="card"
                    style={{
                      padding: "36px 24px",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      gap: 4,
                      background: "var(--surface-2)",
                    }}
                  >
                    <span
                      className="wordmark"
                      style={{ fontSize: 44, fontWeight: 600 }}
                    >
                      {currencySymbol()}                    </span>
                    <input
                      type="number"
                      inputMode="decimal"
                      placeholder="0"
                      value={balance}
                      onChange={(e) => setBalance(e.target.value)}
                      className="amount-input money"
                      style={{ fontSize: 60, maxWidth: 260 }}
                      autoFocus
                    />
                  </div>
                )}

                {step === 1 && (
                  <div style={{ display: "grid", gap: 18 }}>
                    <div className="field">
                      <label>Paycheck amount</label>
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
                          {currencySymbol()}                        </span>
                        <input
                          type="number"
                          inputMode="decimal"
                          placeholder="2,400"
                          value={payAmount}
                          onChange={(e) => setPayAmount(e.target.value)}
                          className="money"
                          style={{ paddingLeft: 32, fontWeight: 600 }}
                        />
                      </div>
                    </div>

                    <div className="field">
                      <label>Next payday</label>
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
                            {format(new Date(nextPayday + "T00:00:00"), "EEE, MMM d, yyyy")}
                          </span>
                          <CalendarBlank size={18} weight="regular" color="var(--ink-faint)" />
                        </div>
                        <input
                          type="date"
                          value={nextPayday}
                          onChange={(e) => setNextPayday(e.target.value)}
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

                    <div className="field">
                      <label>How often</label>
                      <div className="segmented">
                        {FREQUENCIES.map((f) => (
                          <button
                            key={f.value}
                            type="button"
                            aria-selected={payFrequency === f.value}
                            onClick={() => setPayFrequency(f.value)}
                            style={{ position: "relative" }}
                          >
                            {payFrequency === f.value && (
                              <motion.span
                                layoutId="freq-pill"
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
                            {f.label}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                {step === 2 && (
                  <div style={{ display: "grid", gap: 12 }}>
                    {bills.map((bill, idx) => (
                      <motion.div
                        key={bill.id}
                        initial={{ opacity: 0, y: 8 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="card"
                        style={{ padding: 16, display: "grid", gap: 12 }}
                      >
                        <div
                          style={{
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "space-between",
                          }}
                        >
                          <span
                            style={{
                              fontSize: 12,
                              color: "var(--ink-faint)",
                              fontWeight: 700,
                              letterSpacing: "0.06em",
                              textTransform: "uppercase",
                            }}
                          >
                            Bill {idx + 1}
                          </span>
                          {bills.length > 1 && (
                            <button
                              type="button"
                              onClick={() => removeBill(bill.id)}
                              aria-label="Remove bill"
                              style={{
                                background: "none",
                                border: "none",
                                color: "var(--over)",
                                padding: 4,
                                display: "flex",
                              }}
                            >
                              <Trash size={17} weight="regular" />
                            </button>
                          )}
                        </div>
                        <input
                          type="text"
                          placeholder="e.g. Rent, Internet"
                          value={bill.name}
                          onChange={(e) => updateBill(bill.id, { name: e.target.value })}
                          className="input"
                          style={{ height: 50 }}
                        />
                        <div style={{ display: "flex", gap: 10 }}>
                          <div style={{ position: "relative", flex: 1 }}>
                            <span
                              style={{
                                position: "absolute",
                                left: 14,
                                top: "50%",
                                transform: "translateY(-50%)",
                                color: "var(--ink-soft)",
                                fontWeight: 600,
                              }}
                            >
                              {currencySymbol()}                            </span>
                            <input
                              type="number"
                              inputMode="decimal"
                              placeholder="Amount"
                              value={bill.amount || ""}
                              onChange={(e) =>
                                updateBill(bill.id, { amount: Number(e.target.value) || 0 })
                              }
                              className="input money"
                              style={{ paddingLeft: 28, height: 50 }}
                            />
                          </div>
                          <div
                            style={{
                              display: "flex",
                              alignItems: "center",
                              gap: 8,
                              padding: "0 14px",
                              background: "var(--surface)",
                              border: "1px solid var(--hairline)",
                              borderRadius: "var(--r-input)",
                              height: 50,
                              minWidth: 104,
                            }}
                          >
                            <span
                              style={{
                                fontSize: 11,
                                color: "var(--ink-faint)",
                                fontWeight: 700,
                                letterSpacing: "0.06em",
                                textTransform: "uppercase",
                              }}
                            >
                              Day
                            </span>
                            <input
                              type="number"
                              inputMode="numeric"
                              min={1}
                              max={31}
                              value={bill.dayOfMonth}
                              onChange={(e) =>
                                updateBill(bill.id, {
                                  dayOfMonth: Math.min(31, Math.max(1, Number(e.target.value) || 1)),
                                })
                              }
                              className="money"
                              style={{
                                width: 36,
                                background: "transparent",
                                border: "none",
                                outline: "none",
                                fontSize: 16,
                                fontWeight: 700,
                                color: "var(--ink)",
                                textAlign: "center",
                              }}
                            />
                          </div>
                        </div>
                      </motion.div>
                    ))}

                    <button
                      type="button"
                      onClick={addBill}
                      style={{
                        width: "100%",
                        height: 50,
                        border: "1.5px dashed var(--hairline-strong)",
                        borderRadius: "var(--r-input)",
                        background: "transparent",
                        color: "var(--accent)",
                        fontSize: 15,
                        fontWeight: 600,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        gap: 6,
                      }}
                    >
                      <Plus size={18} weight="bold" />
                      Add another bill
                    </button>
                  </div>
                )}
              </div>
            </motion.div>
          </AnimatePresence>

          {/* Footer */}
          <div style={{ marginTop: 20 }}>
            {step === 2 && validBillCount > 0 && (
              <p
                style={{
                  textAlign: "center",
                  fontSize: 13,
                  color: "var(--ink-soft)",
                  marginBottom: 12,
                  fontWeight: 500,
                }}
              >
                {validBillCount} bill{validBillCount !== 1 ? "s" : ""} ·{" "}
                <span className="money" style={{ color: "var(--ink)", fontWeight: 700 }}>
                  {formatMoney(bills.reduce((s, b) => s + (b.amount || 0), 0))}
                </span>{" "}
                a month
              </p>
            )}
            <button
              type="button"
              disabled={!canProceed()}
              onClick={() => (step < 2 ? setStep(step + 1) : handleFinish())}
              className="btn-primary"
            >
              {step < 2 ? "Continue" : "See my number"}
            </button>
            <p
              style={{
                textAlign: "center",
                color: "var(--ink-faint)",
                fontSize: 12,
                marginTop: 14,
                fontWeight: 500,
              }}
            >
              All data stays on your device.
            </p>
          </div>
        </div>
      </div>
    </>
  );
}
