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
    <div className="min-h-dvh flex flex-col max-w-md mx-auto px-5 pt-12 pb-8">
      <div className="animate-fade-in mb-8">
        <p className="text-text-muted text-sm font-medium mb-1">
          Step {step + 1} of 3
        </p>
        <div className="flex gap-2 mb-6">
          {[0, 1, 2].map((i) => (
            <div
              key={i}
              className={`h-1 flex-1 rounded-full transition-all duration-500 ${
                i <= step ? "bg-safe" : "bg-border"
              }`}
            />
          ))}
        </div>
        <div className="flex items-center gap-3 mb-2">
          <div className="w-10 h-10 rounded-2xl bg-surface-overlay flex items-center justify-center">
            <StepIcon className="w-5 h-5 text-safe" />
          </div>
          <div>
            <h1 className="text-2xl font-semibold tracking-tight">{steps[step].title}</h1>
            <p className="text-text-muted text-sm">{steps[step].subtitle}</p>
          </div>
        </div>
      </div>

      <div className="flex-1 animate-fade-in" style={{ animationDelay: "0.1s" }}>
        {step === 0 && (
          <div className="space-y-4">
            <label className="block">
              <span className="text-text-muted text-sm mb-2 block">Account balance</span>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-text-muted text-2xl">
                  $
                </span>
                <input
                  type="number"
                  inputMode="decimal"
                  placeholder="1,200"
                  value={balance}
                  onChange={(e) => setBalance(e.target.value)}
                  className="w-full bg-surface-raised border border-border rounded-2xl pl-10 pr-4 py-5 text-3xl font-semibold focus:outline-none focus:ring-2 focus:ring-safe/40 focus:border-safe transition-all"
                  autoFocus
                />
              </div>
            </label>
            <p className="text-text-muted text-xs leading-relaxed">
              This is the number your bank shows — we'll adjust it for bills coming up.
            </p>
          </div>
        )}

        {step === 1 && (
          <div className="space-y-5">
            <label className="block">
              <span className="text-text-muted text-sm mb-2 block">Paycheck amount</span>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-text-muted text-xl">
                  $
                </span>
                <input
                  type="number"
                  inputMode="decimal"
                  placeholder="2,400"
                  value={payAmount}
                  onChange={(e) => setPayAmount(e.target.value)}
                  className="w-full bg-surface-raised border border-border rounded-2xl pl-10 pr-4 py-4 text-2xl font-semibold focus:outline-none focus:ring-2 focus:ring-safe/40 focus:border-safe transition-all"
                />
              </div>
            </label>

            <label className="block">
              <span className="text-text-muted text-sm mb-2 block">Next payday</span>
              <input
                type="date"
                value={nextPayday}
                onChange={(e) => setNextPayday(e.target.value)}
                className="w-full bg-surface-raised border border-border rounded-2xl px-4 py-4 text-lg font-medium focus:outline-none focus:ring-2 focus:ring-safe/40 focus:border-safe transition-all [color-scheme:dark]"
              />
            </label>

            <div>
              <span className="text-text-muted text-sm mb-3 block">How often?</span>
              <div className="flex gap-2">
                {FREQUENCIES.map((f) => (
                  <button
                    key={f.value}
                    type="button"
                    onClick={() => setPayFrequency(f.value)}
                    className={`flex-1 py-3 px-3 rounded-xl text-sm font-medium transition-all ${
                      payFrequency === f.value
                        ? "bg-safe text-surface font-semibold"
                        : "bg-surface-raised border border-border text-text-muted hover:border-safe/30"
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
                className="bg-surface-raised border border-border rounded-2xl p-4 space-y-3"
              >
                <div className="flex items-center justify-between">
                  <span className="text-text-muted text-xs font-medium">Bill {idx + 1}</span>
                  {bills.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeBill(bill.id)}
                      className="text-text-muted hover:text-danger transition-colors p-1"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </div>
                <input
                  type="text"
                  placeholder="Phone bill"
                  value={bill.name}
                  onChange={(e) => updateBill(bill.id, { name: e.target.value })}
                  className="w-full bg-surface border border-border rounded-xl px-3 py-3 text-base focus:outline-none focus:ring-2 focus:ring-safe/40 focus:border-safe"
                />
                <div className="flex gap-2">
                  <div className="relative flex-1">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted">$</span>
                    <input
                      type="number"
                      inputMode="decimal"
                      placeholder="60"
                      value={bill.amount || ""}
                      onChange={(e) =>
                        updateBill(bill.id, { amount: Number(e.target.value) || 0 })
                      }
                      className="w-full bg-surface border border-border rounded-xl pl-7 pr-3 py-3 text-base focus:outline-none focus:ring-2 focus:ring-safe/40 focus:border-safe"
                    />
                  </div>
                  <div className="flex items-center gap-1.5 bg-surface border border-border rounded-xl px-3">
                    <span className="text-text-muted text-xs whitespace-nowrap">Day</span>
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
                      className="w-12 bg-transparent py-3 text-base text-center focus:outline-none"
                    />
                  </div>
                </div>
              </div>
            ))}

            <button
              type="button"
              onClick={addBill}
              className="w-full flex items-center justify-center gap-2 py-3 rounded-2xl border border-dashed border-border text-text-muted hover:border-safe/40 hover:text-safe transition-all text-sm font-medium"
            >
              <Plus className="w-4 h-4" />
              Add another bill
            </button>

            <p className="text-text-muted text-xs leading-relaxed pt-2">
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
            className="w-full flex items-center justify-center gap-2 bg-safe text-surface font-semibold py-4 rounded-2xl disabled:opacity-40 disabled:cursor-not-allowed hover:brightness-110 active:scale-[0.98] transition-all"
          >
            Continue
            <ChevronRight className="w-5 h-5" />
          </button>
        ) : (
          <button
            type="button"
            onClick={handleFinish}
            className="w-full flex items-center justify-center gap-2 bg-safe text-surface font-semibold py-4 rounded-2xl hover:brightness-110 active:scale-[0.98] transition-all"
          >
            See what I can spend
            <ChevronRight className="w-5 h-5" />
          </button>
        )}

        <p className="text-center text-text-muted text-xs">
          You can change all of this later
        </p>
      </div>
    </div>
  );
}
