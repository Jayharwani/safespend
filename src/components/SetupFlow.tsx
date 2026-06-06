import { useState } from "react";
import { format, addDays } from "date-fns";
import { ChevronLeft, ChevronRight, Plus, Trash2, Wallet, Calendar, Receipt } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import type { AppData, Bill, PayFrequency } from "../types";
import { generateId } from "../lib/storage";

interface SetupFlowProps {
  onComplete: (data: Partial<AppData>) => void;
}

const FREQUENCIES: { value: PayFrequency; label: string }[] = [
  { value: "weekly", label: "Weekly" },
  { value: "fortnightly", label: "Fortnightly" },
  { value: "monthly", label: "Monthly" },
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

  const steps = [
    { icon: Wallet, title: "Account balance", subtitle: "What is in your bank account right now?" },
    { icon: Calendar, title: "Your paycheck", subtitle: "When and how much is your income?" },
    { icon: Receipt, title: "Recurring bills", subtitle: "What are your fixed upcoming expenses?" },
  ];

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

  const addBill = () => {
    setBills([...bills, { id: generateId(), name: "", amount: 0, dayOfMonth: 1 }]);
  };

  const updateBill = (id: string, patch: Partial<Bill>) => {
    setBills(bills.map((b) => (b.id === id ? { ...b, ...patch } : b)));
  };

  const removeBill = (id: string) => {
    if (bills.length > 1) setBills(bills.filter((b) => b.id !== id));
  };

  const StepIcon = steps[step].icon;

  return (
    <div className="app-shell">
      <div className="flex-1 flex flex-col px-6 pt-8 pb-8">
        
        {/* Navigation / Progress header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            {step > 0 ? (
              <button
                type="button"
                onClick={() => setStep(step - 1)}
                className="flex items-center gap-1 text-secondary text-[14px] font-semibold cursor-pointer py-1.5"
              >
                <ChevronLeft className="w-4 h-4" />
                Back
              </button>
            ) : (
              <div className="w-10 h-1.5" />
            )}
            <span className="text-[12px] font-bold uppercase tracking-wider text-secondary">
              Step {step + 1} of 3
            </span>
          </div>

          <div className="flex gap-1.5 mb-6">
            {[0, 1, 2].map((i) => (
              <div
                key={i}
                className="h-1 flex-1 rounded-full relative bg-border-subtle overflow-hidden"
              >
                <motion.div
                  className="absolute inset-y-0 left-0 bg-brand rounded-full"
                  initial={{ width: "0%" }}
                  animate={{ width: i <= step ? "100%" : "0%" }}
                  transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                />
              </div>
            ))}
          </div>

          {/* Heading */}
          <div className="flex items-start gap-3.5 mt-2">
            <div className="w-11 h-11 rounded-2xl bg-brand-tint dark:bg-brand-soft flex items-center justify-center shrink-0">
              <StepIcon className="w-5 h-5 text-brand" strokeWidth={2} />
            </div>
            <div>
              <h1 className="text-[22px] font-bold text-primary leading-snug">{steps[step].title}</h1>
              <p className="text-secondary text-[14px] mt-0.5">{steps[step].subtitle}</p>
            </div>
          </div>
        </div>

        {/* Content Box with transition */}
        <div className="flex-1">
          <AnimatePresence mode="wait">
            <motion.div
              key={step}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
              className="h-full"
            >
              {step === 0 && (
                <div className="space-y-6 pt-4 text-center">
                  <div className="space-y-2">
                    <span className="text-[13px] font-bold uppercase tracking-wider text-secondary">
                      Current balance
                    </span>
                    <div className="relative flex items-center justify-center">
                      <span className="text-secondary text-[36px] font-medium mr-1 select-none">$</span>
                      <input
                        type="number"
                        inputMode="decimal"
                        placeholder="0.00"
                        value={balance}
                        onChange={(e) => setBalance(e.target.value)}
                        className="money bg-transparent border-none text-[56px] font-bold text-primary focus:outline-none text-center w-full max-w-[280px]"
                        autoFocus
                      />
                    </div>
                  </div>
                  <p className="text-[13px] text-secondary leading-relaxed max-w-[300px] mx-auto">
                    Enter the current total amount showing in your bank account. We'll adjust it automatically as upcoming bills approach.
                  </p>
                </div>
              )}

              {step === 1 && (
                <div className="space-y-5 pt-2">
                  <div className="space-y-1.5">
                    <label className="text-[13px] font-bold uppercase tracking-wider text-secondary block pl-1">
                      Paycheck amount
                    </label>
                    <div className="relative">
                      <span className="absolute left-4 top-1/2 -translate-y-1/2 text-secondary font-medium">$</span>
                      <input
                        type="number"
                        inputMode="decimal"
                        placeholder="2,400"
                        value={payAmount}
                        onChange={(e) => setPayAmount(e.target.value)}
                        className="form-input money w-full h-[52px] pl-9 text-[18px] font-bold"
                      />
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[13px] font-bold uppercase tracking-wider text-secondary block pl-1">
                      Next payday
                    </label>
                    <input
                      type="date"
                      value={nextPayday}
                      onChange={(e) => setNextPayday(e.target.value)}
                      className="form-input w-full h-[52px]"
                    />
                  </div>

                  <div className="space-y-2.5">
                    <label className="text-[13px] font-bold uppercase tracking-wider text-secondary block pl-1">
                      Pay Frequency
                    </label>
                    <div className="flex gap-1 p-1 bg-canvas border border-border-subtle rounded-full relative">
                      {FREQUENCIES.map((f) => {
                        const isFreqActive = payFrequency === f.value;
                        return (
                          <button
                            key={f.value}
                            type="button"
                            onClick={() => setPayFrequency(f.value)}
                            className="relative flex-1 h-[42px] rounded-full text-[14px] font-semibold z-10 cursor-pointer outline-none"
                            style={{ color: isFreqActive ? "var(--brand)" : "var(--ink-soft)" }}
                          >
                            {isFreqActive && (
                              <motion.div
                                layoutId="freqActiveIndicator"
                                className="absolute inset-0 bg-surface shadow-sm rounded-full -z-10 border border-border-subtle"
                                transition={{ type: "spring", stiffness: 350, damping: 30 }}
                              />
                            )}
                            {f.label}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                </div>
              )}

              {step === 2 && (
                <div className="space-y-4 pt-1 max-h-[50dvh] overflow-y-auto pr-1">
                  {bills.map((bill, idx) => (
                    <div
                      key={bill.id}
                      className="bg-surface border border-border-subtle rounded-2xl p-4 space-y-3 shadow-sm relative"
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-[12px] font-bold uppercase tracking-wider text-secondary">
                          Bill #{idx + 1}
                        </span>
                        {bills.length > 1 && (
                          <button
                            type="button"
                            onClick={() => removeBill(bill.id)}
                            className="text-secondary hover:text-over min-w-[36px] min-h-[36px] flex items-center justify-center cursor-pointer transition-colors"
                            aria-label="Remove bill"
                          >
                            <Trash2 className="w-4 h-4" strokeWidth={2} />
                          </button>
                        )}
                      </div>
                      <input
                        type="text"
                        placeholder="E.g. Rent, Internet, Spotify"
                        value={bill.name}
                        onChange={(e) => updateBill(bill.id, { name: e.target.value })}
                        className="form-input w-full h-[48px]"
                      />
                      <div className="flex gap-3">
                        <div className="relative flex-1">
                          <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-secondary font-medium">
                            $
                          </span>
                          <input
                            type="number"
                            inputMode="decimal"
                            placeholder="Amount"
                            value={bill.amount || ""}
                            onChange={(e) =>
                              updateBill(bill.id, { amount: Number(e.target.value) || 0 })
                            }
                            className="form-input money w-full h-[48px] pl-8"
                          />
                        </div>
                        <div className="flex items-center gap-2 bg-canvas border border-border-subtle rounded-2xl px-3.5 h-[48px] min-w-[110px]">
                          <span className="text-secondary text-[12px] font-semibold uppercase">Day</span>
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
                            className="money w-8 bg-transparent text-[16px] font-bold text-center focus:outline-none"
                          />
                        </div>
                      </div>
                    </div>
                  ))}

                  <button
                    type="button"
                    onClick={addBill}
                    className="w-full flex items-center justify-center gap-2 h-[50px] rounded-2xl border-2 border-dashed border-border-strong text-secondary hover:text-primary hover:border-brand text-[14px] font-semibold transition-all cursor-pointer"
                  >
                    <Plus className="w-4 h-4" strokeWidth={2.5} />
                    Add another expense
                  </button>

                  <p className="text-[12px] text-secondary leading-relaxed pt-1 text-center">
                    No bills yet? You can skip this and add them later in settings.
                  </p>
                </div>
              )}
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Action Button footer */}
        <div className="mt-8 space-y-3">
          {step < 2 ? (
            <button
              type="button"
              disabled={!canProceed()}
              onClick={() => setStep(step + 1)}
              className="btn-primary"
            >
              Continue
              <ChevronRight className="w-5 h-5" strokeWidth={2.25} />
            </button>
          ) : (
            <button
              type="button"
              onClick={handleFinish}
              className="btn-primary"
            >
              See my Safe Spend
              <ChevronRight className="w-5 h-5" strokeWidth={2.25} />
            </button>
          )}

          <p className="text-center text-secondary text-[12px] font-medium">
            All data is stored locally on your device
          </p>
        </div>
      </div>
    </div>
  );
}
