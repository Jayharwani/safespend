import { motion } from "framer-motion";
import AnimatedNumber from "./AnimatedNumber";
import { formatMoney } from "../lib/finance";
import { easeOut } from "../lib/motion";
import FloatingOrb from "./FloatingOrb";
import AuroraBackground from "./AuroraBackground";

interface AllSetScreenProps {
  safeToSpend: number;
  onContinue: () => void;
}

export default function AllSetScreen({ safeToSpend, onContinue }: AllSetScreenProps) {
  const variant =
    safeToSpend > 200 ? "safe" : safeToSpend > 0 ? "tight" : "over";

  return (
    <>
      <AuroraBackground />
      <div className="app-shell">
        <div
          style={{
            flex: 1,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            padding: "32px 24px",
            textAlign: "center",
          }}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.85 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.7, ease: easeOut }}
            style={{ marginBottom: 36 }}
          >
            <FloatingOrb size={140} variant={variant as "safe" | "tight" | "over"} />
          </motion.div>

          <motion.p
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.5 }}
            style={{
              fontSize: 12,
              fontWeight: 600,
              color: "var(--ink-faint)",
              textTransform: "uppercase",
              letterSpacing: "0.16em",
              marginBottom: 8,
            }}
          >
            You're all set
          </motion.p>

          <motion.h1
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.35, duration: 0.5 }}
            style={{
              fontSize: 22,
              fontWeight: 600,
              letterSpacing: "-0.02em",
              color: "var(--ink-soft)",
              marginBottom: 14,
            }}
          >
            Here's your safe-to-spend until payday
          </motion.h1>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.5, duration: 0.6, ease: easeOut }}
            style={{ marginBottom: 48 }}
          >
            <AnimatedNumber
              value={safeToSpend}
              format={formatMoney}
              className="num"
              style={{
                fontSize: 64,
                fontWeight: 600,
                lineHeight: 1,
                letterSpacing: "-0.03em",
                color:
                  variant === "safe"
                    ? "var(--accent)"
                    : variant === "tight"
                      ? "var(--tight)"
                      : "var(--over)",
              }}
            />
          </motion.div>

          <motion.button
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7, duration: 0.5 }}
            type="button"
            onClick={onContinue}
            className="btn-primary"
            style={{ maxWidth: 320 }}
          >
            Go to Headroom
          </motion.button>
        </div>
      </div>
    </>
  );
}
