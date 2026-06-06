import { useEffect } from "react";
import { X, RotateCcw } from "lucide-react";

interface SettingsSheetProps {
  open: boolean;
  onClose: () => void;
  onReset: () => void;
  onLoadDemo: (scenario: "healthy" | "tight" | "danger") => void;
}

const DEMOS = [
  { id: "healthy" as const, label: "Healthy ($1,200)", desc: "The worked example — $885 safe" },
  { id: "tight" as const, label: "Tight ($400)", desc: "Bills eat most of it — $85 safe" },
  { id: "danger" as const, label: "Over budget ($200)", desc: "Red alert before payday" },
];

export default function SettingsSheet({ open, onClose, onReset, onLoadDemo }: SettingsSheetProps) {
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

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center">
      <div className="absolute inset-0 bg-black/60 animate-backdrop" onClick={onClose} aria-hidden />
      <div
        role="dialog"
        aria-modal
        className="relative w-full max-w-md bg-surface-raised border-t border-border rounded-t-3xl px-5 pt-5 pb-8 animate-slide-up max-h-[85dvh] overflow-y-auto"
        style={{ paddingBottom: "max(2rem, env(safe-area-inset-bottom))" }}
      >
        <div className="w-10 h-1 bg-border rounded-full mx-auto mb-5" />

        <div className="flex items-center justify-between mb-5">
          <h2 className="text-lg font-semibold">Settings</h2>
          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-surface-overlay flex items-center justify-center text-text-muted hover:text-text transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="space-y-5">
          <div>
            <p className="text-text-muted text-xs font-medium uppercase tracking-wider mb-3">
              Preview scenarios
            </p>
            <p className="text-text-muted text-xs mb-3 leading-relaxed">
              Load the worked examples to see healthy, tight, and danger states.
            </p>
            <div className="space-y-2">
              {DEMOS.map((demo) => (
                <button
                  key={demo.id}
                  type="button"
                  onClick={() => {
                    onLoadDemo(demo.id);
                    onClose();
                  }}
                  className="w-full text-left bg-surface border border-border rounded-xl px-4 py-3 hover:border-safe/30 transition-colors"
                >
                  <p className="text-sm font-medium">{demo.label}</p>
                  <p className="text-text-muted text-xs mt-0.5">{demo.desc}</p>
                </button>
              ))}
            </div>
          </div>

          <div className="border-t border-border pt-5">
            <button
              type="button"
              onClick={() => {
                onReset();
                onClose();
              }}
              className="w-full flex items-center justify-center gap-2 py-3 rounded-xl border border-border text-text-muted hover:text-danger hover:border-danger/30 transition-colors text-sm"
            >
              <RotateCcw className="w-4 h-4" />
              Reset & run setup again
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
