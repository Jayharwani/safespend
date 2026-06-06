import { Bell } from "lucide-react";

interface PermissionsScreenProps {
  onAllow: () => void;
  onSkip: () => void;
}

export default function PermissionsScreen({ onAllow, onSkip }: PermissionsScreenProps) {
  return (
    <div className="app-shell">
      <div className="flex-1 flex flex-col items-center justify-center px-6 pb-8 text-center">
        <div className="rise mb-8" style={{ animationDelay: "0ms" }}>
          <div className="w-24 h-24 rounded-full bg-brand-tint flex items-center justify-center mx-auto mb-6 shadow-e1">
            <Bell className="w-10 h-10 text-brand" strokeWidth={1.75} />
          </div>
          <h1 className="text-[22px] font-semibold mb-3">Get a heads-up before you dip</h1>
          <p className="text-[17px] text-secondary leading-relaxed max-w-[280px] mx-auto">
            We'll only ping you when a bill would push you low. Nothing else.
          </p>
        </div>

        <div className="w-full space-y-3 rise mt-auto" style={{ animationDelay: "140ms" }}>
          <button type="button" onClick={onAllow} className="btn-primary">
            Turn on alerts
          </button>
          <button
            type="button"
            onClick={onSkip}
            className="w-full text-brand text-[17px] font-semibold min-h-[44px]"
          >
            Maybe later
          </button>
        </div>
      </div>
    </div>
  );
}
