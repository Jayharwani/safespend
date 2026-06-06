import { useState } from "react";
import { format, addDays } from "date-fns";
import { ChevronRight, Plus, Trash2, Wallet, Calendar, Receipt } from "lucide-react";
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

const inputClass =
  "w-full h-[52px] bg-surface border border-border-subtle rounded-[var(--r-md)] px-4 text-[17px] focus:outline-none focus:ring-2 focus:ring-[var(--focus-ring)]";

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
    { icon: Wallet, title: "Current balance", subtitle: "What's in your account right now?" },
    { icon: Calendar, title: "Your pay", subtitle: "When does money come in?" },
    { icon: Receipt, title: "Recurring bills", subtitle: "What comes out automatically?" },
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
      <div className="flex-1 flex flex-col px-5 pt-8 pb-8">
        <div className="animate-fade-in mb-8">
          <p className="text-[14px] font-medium text-secondary mb-2">Step {step + 1} of 3</p>
          <div className="flex gap-2 mb-6">
            {[0, 1, 2].map((i) => (
              <div
                key={i}
                className={`h-1 flex-1 rounded-full transition-all duration-500 ${
                  i <= step ? "bg-brand" : "bg-border-subtle"
                }`}
              />
            ))}
          </div>
          <div className="flex items-center gap-3 mb-2">
            <div className="w-11 h-11 rounded-[var(--r-lg)] bg-brand-tint flex items-center justify-center">
              <StepIcon className="w-5 h-5 text-brand" strokeWidth={1.75} />
            </div>
            <div>
              <h1 className="text-[22px] leading-7 font-semibold">{steps[step].title}</h1>
              <p className="text-secondary text-[15px]">{steps[step].subtitle}</p>
            </div>
          </div>
        </div>

        <div className="flex-1 animate-fade-in" style={{ animationDelay: "0.1s" }}>
          {step === 0 && (
            <div className="space-y-4">
              <label className="block">
                <span className="text-[14px] font-medium text-secondary mb-2 block">
                  Account balance
                </span>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-secondary text-[28px]">
                    $
                  </span>
                  <input
                    type="number"
                    inputMode="decimal"
                    placeholder="1,200"
                    value={balance}
                    onChange={(e) => setBalance(e.target.value)}
                    className="money w-full h-[52px] bg-surface border border-border-subtle rounded-[var(--r-md)] pl-10 pr-4 text-[28px] font-semibold focus:outline-none focus:ring-2 focus:ring-[var(--focus-ring)]"
                    autoFocus
                  />
                </div>
              </label>
              <p className="text-[13px] text-tertiary leading-relaxed">
                This is the number your bank shows — we'll adjust it for bills coming up.
              </p>
            </div>
          )}

          {step === 1 && (
            <div className="space-y-5">
              <label className="block">
                <span className="text-[14px] font-medium text-secondary mb-2 block">
                  Paycheck amount
                </span>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-secondary">$</span>
                  <input
                    type="number"
                    inputMode="decimal"
                    placeholder="2,400"
                    value={payAmount}
                    onChange={(e) => setPayAmount(e.target.value)}
                    className={`money ${inputClass} pl-9 text-[22px] font-semibold`}
                  />
                </div>
              </label>

              <label className="block">
                <span className="text-[14px] font-medium text-secondary mb-2 block">
                  Next payday
                </span>
                <input
                  type="date"
                  value={nextPayday}
                  onChange={(e) => setNextPayday(e.target.value)}
                  className={inputClass}
                />
              </label>

              <div>
                <span className="text-[14px] font-medium text-secondary mb-3 block">
                  How often?
                </span>
                <div className="flex gap-1 p-1 bg-[var(--n-100)] rounded-[var(--r-pill)]">
                  {FREQUENCIES.map((f) => (
                    <button
                      key={f.value}
                      type="button"
                      onClick={() => setPayFrequency(f.value)}
                      className={`flex-1 h-[44px] rounded-[var(--r-pill)] text-[15px] font-medium ${
                        payFrequency === f.value
                          ? "bg-surface text-primary shadow-e1"
                          : "text-secondary"
                      }`}
                    >
                      {f.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-3">
              {bills.map((bill, idx) => (
                <div
                  key={bill.id}
                  className="bg-surface border border-border-subtle rounded-[var(--r-lg)] p-4 space-y-3 shadow-e1"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-[13px] font-medium text-secondary">Bill {idx + 1}</span>
                    {bills.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeBill(bill.id)}
                        className="text-tertiary min-w-[44px] min-h-[44px] flex items-center justify-center"
                      >
                        <Trash2 className="w-4 h-4" strokeWidth={1.75} />
                      </button>
                    )}
                  </div>
                  <input
                    type="text"
                    placeholder="Phone bill"
                    value={bill.name}
                    onChange={(e) => updateBill(bill.id, { name: e.target.value })}
                    className={inputClass}
                  />
                  <div className="flex gap-2">
                    <div className="relative flex-1">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-secondary">
                        $
                      </span>
                      <input
                        type="number"
                        inputMode="decimal"
                        placeholder="60"
                        value={bill.amount || ""}
                        onChange={(e) =>
                          updateBill(bill.id, { amount: Number(e.target.value) || 0 })
                        }
                        className={`money ${inputClass} pl-7`}
                      />
                    </div>
                    <div className="flex items-center gap-1.5 bg-[var(--n-50)] border border-border-subtle rounded-[var(--r-md)] px-3 h-[52px]">
                      <span className="text-secondary text-[13px]">Day</span>
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
                        className="money w-10 bg-transparent text-[17px] text-center focus:outline-none"
                      />
                    </div>
                  </div>
                </div>
              ))}

              <button
                type="button"
                onClick={addBill}
                className="w-full flex items-center justify-center gap-2 h-[52px] rounded-[var(--r-md)] border border-dashed border-border-strong text-secondary text-[15px] font-medium"
              >
                <Plus className="w-4 h-4" strokeWidth={2} />
                Add another bill
              </button>

              <p className="text-[13px] text-tertiary leading-relaxed pt-2">
                Skip any you don't have — you can always add more later.
              </p>
            </div>
          )}
        </div>

        <div className="mt-8 space-y-3 animate-fade-in" style={{ animationDelay: "0.2s" }}>
          {step < 2 ? (
            <button
              type="button"
              disabled={!canProceed()}
              onClick={() => setStep(step + 1)}
              className="w-full h-[52px] flex items-center justify-center gap-2 bg-brand text-white font-semibold text-[17px] rounded-[var(--r-md)] disabled:opacity-40 disabled:cursor-not-allowed"
            >
              Continue
              <ChevronRight className="w-5 h-5" strokeWidth={2} />
            </button>
          ) : (
            <button
              type="button"
              onClick={handleFinish}
              className="w-full h-[52px] flex items-center justify-center gap-2 bg-brand text-white font-semibold text-[17px] rounded-[var(--r-md)]"
            >
              See my number
              <ChevronRight className="w-5 h-5" strokeWidth={2} />
            </button>
          )}

          <p className="text-center text-tertiary text-[13px]">You can change all of this later</p>
        </div>
      </div>
    </div>
  );
}
