import { motion } from "framer-motion";
import AnimatedNumber from "./AnimatedNumber";
import { formatMoney } from "../lib/finance";
import { easeOut } from "../lib/motion";

interface AllSetScreenProps {
  safeToSpend: number;
  onContinue: () => void;
}

export default function AllSetScreen({ safeToSpend, onContinue }: AllSetScreenProps) {
  return (
    <div className="app-shell">
      <div className="flex-1 flex flex-col items-center justify-center px-6 pb-8 text-center">
        
        {/* Animated Checkmark */}
        <motion.svg
          width="72"
          height="72"
          viewBox="0 0 72 72"
          className="mb-6"
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5, ease: easeOut }}
        >
          <circle cx="36" cy="36" r="34" fill="var(--brand-soft)" stroke="var(--brand)" strokeWidth="2.5" />
          <motion.path
            d="M24 37 L32 45 L48 27"
            fill="none"
            stroke="var(--brand-deep)"
            strokeWidth="3.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 0.5, delay: 0.2, ease: easeOut }}
          />
        </motion.svg>

        {/* Text */}
        <h1 className="text-[30px] font-bold text-primary tracking-tight mb-2">You are all set</h1>
        <p className="text-secondary text-[14px] mb-8 font-medium">Your current Safe to Spend total is:</p>

        {/* Big Number */}
        <AnimatedNumber
          value={safeToSpend}
          format={formatMoney}
          className="text-[64px] leading-none font-bold tracking-[-1.5px] text-safe mb-10"
        />

        {/* Button */}
        <button
          type="button"
          onClick={onContinue}
          className="btn-primary w-full max-w-[320px] h-[52px]"
        >
          Go to Dashboard
        </button>
      </div>
    </div>
  );
}
