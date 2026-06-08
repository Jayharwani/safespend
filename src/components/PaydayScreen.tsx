import { useEffect } from "react";
import confetti from "canvas-confetti";
import { motion } from "framer-motion";
import AnimatedNumber from "./AnimatedNumber";
import { formatMoney } from "../lib/finance";
import { prefersReducedMotion, springSoft } from "../lib/motion";
import FloatingOrb from "./FloatingOrb";

interface PaydayScreenProps {
  safeToSpend: number;
  onDismiss: () => void;
}

export default function PaydayScreen({ safeToSpend, onDismiss }: PaydayScreenProps) {
  useEffect(() => {
    if (prefersReducedMotion()) return;
    const fire = (origin: { x?: number; y: number }) =>
      confetti({
        particleCount: 60,
        spread: 80,
        startVelocity: 32,
        scalar: 0.95,
        ticks: 200,
        origin,
        colors: ["#35C28D", "#1F8E63", "#D9A441", "#5FD9AC", "#F4F6F4"],
      });
    fire({ x: 0.2, y: 0.4 });
    setTimeout(() => fire({ x: 0.8, y: 0.4 }), 180);
    setTimeout(() => fire({ x: 0.5, y: 0.35 }), 360);
  }, []);

  return (
    <motion.div
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 70,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: 24,
        background: "rgba(7, 7, 13, 0.78)",
        backdropFilter: "blur(20px)",
        WebkitBackdropFilter: "blur(20px)",
      }}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <motion.div
        className="hero"
        style={{
          width: "100%",
          maxWidth: 380,
          textAlign: "center",
          padding: "36px 28px 32px",
        }}
        initial={{ scale: 0.88, y: 16 }}
        animate={{ scale: 1, y: 0 }}
        transition={springSoft}
      >
        <div style={{ display: "flex", justifyContent: "center", marginBottom: 20 }}>
          <FloatingOrb size={110} variant="brand" />
        </div>

        <h1
          style={{
            fontSize: 32,
            fontWeight: 600,
            letterSpacing: "-0.03em",
            marginBottom: 6,
            color: "var(--ink)",
          }}
        >
          Payday.
        </h1>
        <p style={{ fontSize: 14, color: "var(--ink-soft)", marginBottom: 22 }}>
          New cycle — here's your room.
        </p>

        <AnimatedNumber
          value={safeToSpend}
          format={formatMoney}
          className="num"
          style={{
            fontSize: 56,
            fontWeight: 600,
            lineHeight: 1,
            letterSpacing: "-0.03em",
            color: "var(--accent-deep)",
            marginBottom: 32,
          }}
        />

        <button type="button" onClick={onDismiss} className="btn-primary">
          Nice
        </button>
      </motion.div>
    </motion.div>
  );
}
