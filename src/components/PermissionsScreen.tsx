import { Bell } from "lucide-react";

interface PermissionsScreenProps {
  onAllow: () => void;
  onSkip: () => void;
}

export default function PermissionsScreen({ onAllow, onSkip }: PermissionsScreenProps) {
  return (
    <div className="app-shell">
      <div className="flex-1 flex flex-col items-center justify-center px-6 pb-8 text-center">
        
        {/* Content */}
        <div className="rise my-auto" style={{ animationDelay: "0ms" }}>
          <div className="w-20 h-20 rounded-3xl bg-brand-tint dark:bg-brand-soft flex items-center justify-center mx-auto mb-6 shadow-sm border border-border-subtle">
            <Bell className="w-8 h-8 text-brand" strokeWidth={2} />
          </div>
          <h1 className="text-[26px] font-bold text-primary tracking-tight mb-3">
            Get alert notifications
          </h1>
          <p className="text-[14px] text-secondary leading-relaxed max-w-[280px] mx-auto">
            We will only ping you when an upcoming bill is predicted to push your balance low. No spam or marketing, guaranteed.
          </p>
        </div>

        {/* Buttons */}
        <div className="w-full space-y-3 rise mt-auto" style={{ animationDelay: "140ms" }}>
          <button type="button" onClick={onAllow} className="btn-primary">
            Allow notifications
          </button>
          <button
            type="button"
            onClick={onSkip}
            className="w-full text-brand hover:opacity-85 text-[15px] font-semibold min-h-[44px] cursor-pointer bg-transparent border-none"
          >
            Maybe later
          </button>
        </div>
      </div>
    </div>
  );
}
