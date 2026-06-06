import { Mail } from "lucide-react";

interface SignUpScreenProps {
  onGuest: () => void;
}

export default function SignUpScreen({ onGuest }: SignUpScreenProps) {
  return (
    <div className="app-shell">
      <div className="flex-1 flex flex-col justify-center px-6 pt-12 pb-8">
        
        {/* Title */}
        <div className="rise mb-8" style={{ animationDelay: "0ms" }}>
          <h1 className="text-[32px] font-bold tracking-tight text-primary leading-tight">
            Create your account
          </h1>
          <p className="text-secondary text-[14px] mt-1">Setup takes less than a minute.</p>
        </div>

        {/* Social SSO buttons */}
        <div className="space-y-3 rise animate-push-in" style={{ animationDelay: "70ms" }}>
          <button
            type="button"
            onClick={onGuest}
            className="w-full h-[52px] rounded-2xl bg-surface border border-border-subtle hover:bg-canvas/30 font-semibold text-[15px] shadow-sm flex items-center justify-center gap-2 cursor-pointer transition-colors"
          >
            Continue with Apple
          </button>
          <button
            type="button"
            onClick={onGuest}
            className="w-full h-[52px] rounded-2xl bg-surface border border-border-subtle hover:bg-canvas/30 font-semibold text-[15px] shadow-sm flex items-center justify-center gap-2 cursor-pointer transition-colors"
          >
            Continue with Google
          </button>
        </div>

        {/* Divider */}
        <div className="flex items-center gap-4 my-7 rise" style={{ animationDelay: "140ms" }}>
          <div className="flex-1 h-px bg-border-subtle" />
          <span className="text-[12px] font-bold uppercase tracking-wider text-secondary">or</span>
          <div className="flex-1 h-px bg-border-subtle" />
        </div>

        {/* Form Inputs */}
        <div className="rise space-y-5" style={{ animationDelay: "210ms" }}>
          <div className="space-y-1.5">
            <label className="text-[12px] font-bold uppercase tracking-wider text-secondary pl-1 block">
              Email Address
            </label>
            <div className="relative">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-secondary" strokeWidth={2} />
              <input
                type="email"
                placeholder="you@example.com"
                className="form-input w-full h-[52px] pl-12"
              />
            </div>
          </div>

          <button
            type="button"
            onClick={onGuest}
            className="btn-primary w-full h-[52px]"
          >
            Continue as Guest
          </button>
          
          <p className="text-[11px] text-secondary text-center leading-relaxed max-w-[280px] mx-auto">
            By continuing, you agree to our Terms of Service. No bank connection or credit card required.
          </p>
        </div>
      </div>
    </div>
  );
}
