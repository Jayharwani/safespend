import { motion } from "framer-motion";
import { easeOut } from "../lib/motion";
import FloatingOrb from "./FloatingOrb";
import AuroraBackground from "./AuroraBackground";

export default function SplashScreen() {
  return (
    <>
      <AuroraBackground />
      <div
        className="app-shell"
        role="main"
        style={{
          alignItems: "center",
          justifyContent: "center",
          minHeight: "100dvh",
        }}
      >
        <div style={{ textAlign: "center" }}>
          <motion.div
            initial={{ opacity: 0, scale: 0.7 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1.4, ease: easeOut }}
            style={{ display: "flex", justifyContent: "center", marginBottom: 36 }}
          >
            <FloatingOrb size={132} variant="brand" />
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.7, ease: easeOut }}
            className="wordmark"
            style={{
              fontSize: 40,
              fontWeight: 600,
              letterSpacing: "-0.045em",
              marginBottom: 10,
            }}
          >
            Headroom
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, delay: 1.1, ease: easeOut }}
            style={{
              fontSize: 14,
              color: "var(--ink-soft)",
              fontWeight: 500,
              letterSpacing: "0.01em",
            }}
          >
            What you can actually spend.
          </motion.p>

          {/* Subtle loading hint */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 1.6 }}
            style={{
              width: 36,
              height: 4,
              borderRadius: 999,
              background: "var(--hairline-strong)",
              margin: "32px auto 0",
              overflow: "hidden",
              position: "relative",
            }}
          >
            <motion.div
              initial={{ x: "-100%" }}
              animate={{ x: "120%" }}
              transition={{ duration: 1.4, delay: 1.6, ease: easeOut }}
              style={{
                position: "absolute",
                inset: 0,
                background: "var(--accent)",
                borderRadius: 999,
              }}
            />
          </motion.div>
        </div>
      </div>
    </>
  );
}
