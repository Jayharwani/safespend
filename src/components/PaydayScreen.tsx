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
      particleCount: 70,
      spread: 60,
      startVelocity: 28,
      scalar: 0.9,
      ticks: 160,
      origin: { y: 0.35 },
      colors: ["#2E9E78", "#5FC49C", "#E3F1EA", "#B07A1E"],
    });
  }, []);

  return (
    <motion.div
      className="fixed inset-0 z-[70] flex items-center justify-center px-6"
      style={{ background: "rgba(20,30,24,0.55)" }}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <motion.div
        className="w-full max-w-[360px] hero-panel text-center py-10 px-6"
        initial={{ scale: 0.9, y: 20 }}
        animate={{ scale: 1, y: 0 }}
        transition={{ type: "spring", stiffness: 240, damping: 28 }}
      >
        <h1 className="text-[30px] font-semibold tracking-[-0.5px] mb-2">Payday.</h1>
        <AnimatedNumber
          value={safeToSpend}
          format={formatMoney}
          className="text-[56px] leading-none font-semibold tracking-[-1.5px] text-safe my-4"
        />
        <p className="text-[15px] text-secondary mb-8">New cycle — here's your room.</p>
        <button type="button" onClick={onDismiss} className="btn-primary">
          Nice
        </button>
      </motion.div>
    </motion.div>
  );
}
