import { useEffect } from "react";
import { Check } from "lucide-react";

interface ToastProps {
  message: string;
  onDone: () => void;
}

export default function Toast({ message, onDone }: ToastProps) {
  useEffect(() => {
    const t = setTimeout(onDone, 2500);
    return () => clearTimeout(t);
  }, [onDone]);

  return (
    <div
      className="fixed left-1/2 -translate-x-1/2 z-[60] animate-toast"
      style={{ bottom: "calc(72px + env(safe-area-inset-bottom))" }}
      role="status"
    >
      <div className="flex items-center gap-2.5 bg-surface text-primary text-[15px] pl-3 pr-4 py-3 rounded-[var(--r-button)] shadow-e2 border border-border-subtle">
        <span className="w-7 h-7 rounded-full bg-brand-tint flex items-center justify-center shrink-0">
          <Check className="w-4 h-4 text-brand" strokeWidth={2.5} />
        </span>
        {message}
      </div>
    </div>
  );
}
