import { useEffect } from "react";
import confetti from "canvas-confetti";
import { motion } from "framer-motion";
import AnimatedNumber from "./AnimatedNumber";
import { formatMoney } from "../lib/finance";
import { prefersReducedMotion } from "../lib/motion";

interface PaydayScreenProps {
  safeToSpend: number;
  onDismiss: () => void;
}

export default function PaydayScreen({ safeToSpend, onDismiss }: PaydayScreenProps) {
  useEffect(() => {
    if (prefersReducedMotion()) return;
    confetti({
      particleCount: 80,
      spread: 70,
      startVelocity: 30,
      scalar: 0.95,
      ticks: 180,
      origin: { y: 0.4 },
      colors: ["#3b5e8c", "#5e89c3", "#eef3f8", "#d68a47"],
    });
  }, []);

  return (
    <motion.div
      className="fixed inset-0 z-[70] flex items-center justify-center px-6"
      style={{ background: "rgba(14, 18, 16, 0.45)", backdropFilter: "blur(6px)" }}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <motion.div
        className="w-full max-w-[360px] hero-panel text-center py-10 px-6 border border-border-subtle"
        initial={{ scale: 0.92, y: 15 }}
        animate={{ scale: 1, y: 0 }}
        transition={{ type: "spring", stiffness: 280, damping: 28 }}
      >
        <h1 className="text-[32px] font-bold tracking-tight text-primary mb-2">Payday!</h1>
        <p className="text-[14px] text-secondary font-medium">Your new Safe to Spend total is:</p>
        <AnimatedNumber
          value={safeToSpend}
          format={formatMoney}
          className="text-[56px] leading-none font-bold tracking-[-1.5px] text-safe my-4"
        />
        <p className="text-[13px] text-secondary mb-8">All reset for your next paycheck cycle.</p>
        <button
          type="button"
          onClick={onDismiss}
          className="btn-primary w-full h-[52px]"
        >
          Got it
        </button>
      </motion.div>
    </motion.div>
  );
}
