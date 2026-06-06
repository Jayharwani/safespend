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
        <motion.svg
          width="72"
          height="72"
          viewBox="0 0 72 72"
          className="mb-6"
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5, ease: easeOut }}
        >
          <circle cx="36" cy="36" r="34" fill="#E3F1EA" stroke="#2E9E78" strokeWidth="2" />
          <motion.path
            d="M22 37 L32 47 L52 27"
            fill="none"
            stroke="#1C6F53"
            strokeWidth="3"
            strokeLinecap="round"
            strokeLinejoin="round"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 0.5, delay: 0.2, ease: easeOut }}
          />
        </motion.svg>

        <h1 className="text-[30px] font-semibold tracking-[-0.5px] mb-2">You're all set</h1>
        <p className="text-secondary text-[15px] mb-6">Here's what you can safely spend</p>

        <AnimatedNumber
          value={safeToSpend}
          format={formatMoney}
          className="text-[64px] leading-none font-semibold tracking-[-1.5px] text-safe mb-8"
        />

        <button type="button" onClick={onContinue} className="btn-primary w-full max-w-[320px]">
          Go to Headroom
        </button>
      </div>
    </div>
  );
}
