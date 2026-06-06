import { Mail } from "lucide-react";

interface SignUpScreenProps {
  onGuest: () => void;
}

export default function SignUpScreen({ onGuest }: SignUpScreenProps) {
  return (
    <div className="app-shell">
      <div className="flex-1 flex flex-col px-6 pt-12 pb-8">
        <div className="rise mb-8" style={{ animationDelay: "0ms" }}>
          <h1 className="text-[30px] leading-[1.15] font-semibold tracking-[-0.5px] mb-2">
            Create your account
          </h1>
          <p className="text-secondary text-[15px]">Takes less than a minute.</p>
        </div>

        <div className="space-y-3 rise" style={{ animationDelay: "70ms" }}>
          <button
            type="button"
            onClick={onGuest}
            className="w-full h-[54px] rounded-[var(--r-button)] bg-surface border border-border-subtle font-semibold text-[17px] shadow-e1"
          >
            Continue with Apple
          </button>
          <button
            type="button"
            onClick={onGuest}
            className="w-full h-[54px] rounded-[var(--r-button)] bg-surface border border-border-subtle font-semibold text-[17px] shadow-e1"
          >
            Continue with Google
          </button>
        </div>

        <div className="flex items-center gap-4 my-6 rise" style={{ animationDelay: "140ms" }}>
          <div className="flex-1 h-px bg-border-subtle" />
          <span className="text-[13px] text-tertiary">or</span>
          <div className="flex-1 h-px bg-border-subtle" />
        </div>

        <div className="rise space-y-4" style={{ animationDelay: "210ms" }}>
          <label className="block">
            <span className="text-[14px] font-medium text-secondary mb-2 block">Email</span>
            <div className="relative">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-tertiary" />
              <input
                type="email"
                placeholder="you@email.com"
                className="w-full h-[54px] bg-surface border border-border-subtle rounded-[var(--r-button)] pl-12 pr-4 text-[17px]"
              />
            </div>
          </label>
          <button type="button" onClick={onGuest} className="btn-primary">
            Continue as guest
          </button>
          <p className="text-[12px] text-tertiary text-center leading-relaxed">
            By continuing you agree to our terms. No bank connection required for the demo.
          </p>
        </div>
      </div>
    </div>
  );
}
