import { Bell } from "../lib/icons";
import { motion } from "framer-motion";
import { staggerContainer, staggerItem } from "../lib/motion";
import AuroraBackground from "./AuroraBackground";

interface PermissionsScreenProps {
  onAllow: () => void;
  onSkip: () => void;
}

export default function PermissionsScreen({ onAllow, onSkip }: PermissionsScreenProps) {
  return (
    <>
      <AuroraBackground />
      <div className="app-shell">
        <motion.div
          variants={staggerContainer}
          initial="initial"
          animate="animate"
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
          <motion.div variants={staggerItem} style={{ marginBottom: "auto" }} />

          <motion.div variants={staggerItem}>
            <motion.div
              animate={{ scale: [1, 1.06, 1] }}
              transition={{ duration: 3.5, repeat: Infinity, ease: "easeInOut" }}
              style={{
                width: 92,
                height: 92,
                borderRadius: 26,
                background: "var(--accent)",
                color: "var(--on-accent)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                margin: "0 auto 28px",
                boxShadow: "var(--shadow-sm), inset 0 1px 0 rgba(255,255,255,0.22)",
              }}
            >
              <Bell size={40} weight="duotone" />
            </motion.div>
            <h1
              style={{
                fontSize: 26,
                fontWeight: 600,
                letterSpacing: "-0.03em",
                marginBottom: 12,
              }}
            >
              Get a heads-up before you dip
            </h1>
            <p
              style={{
                fontSize: 16,
                color: "var(--ink-soft)",
                lineHeight: 1.5,
                maxWidth: 320,
                margin: "0 auto",
                fontWeight: 500,
              }}
            >
              We'll only ping you when an upcoming bill would push your balance low. Nothing else.
            </p>
          </motion.div>

          <motion.div
            variants={staggerItem}
            style={{
              width: "100%",
              display: "grid",
              gap: 10,
              marginTop: "auto",
            }}
          >
            <button type="button" onClick={onAllow} className="btn-primary">
              Turn on alerts
            </button>
            <button type="button" onClick={onSkip} className="btn-text">
              Maybe later
            </button>
          </motion.div>
        </motion.div>
      </div>
    </>
  );
}
