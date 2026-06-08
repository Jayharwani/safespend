import { EnvelopeSimple, AppleLogo, GoogleLogo } from "../lib/icons";
import { motion } from "framer-motion";
import { staggerContainer, staggerItem } from "../lib/motion";
import AuroraBackground from "./AuroraBackground";
import Wordmark from "./Wordmark";

interface SignUpScreenProps {
  onGuest: () => void;
}

export default function SignUpScreen({ onGuest }: SignUpScreenProps) {
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
            justifyContent: "center",
            padding: "32px 24px",
          }}
        >
          <motion.div
            variants={staggerItem}
            style={{ display: "flex", justifyContent: "center", marginBottom: 36 }}
          >
            <Wordmark size={48} showText={false} />
          </motion.div>

          <motion.div variants={staggerItem} style={{ marginBottom: 32, textAlign: "center" }}>
            <h1
              style={{
                fontSize: 32,
                fontWeight: 600,
                letterSpacing: "-0.03em",
                lineHeight: 1.1,
              }}
            >
              Welcome to <span className="wordmark">Headroom</span>
            </h1>
            <p style={{ fontSize: 15, color: "var(--ink-soft)", marginTop: 10, fontWeight: 500 }}>
              Less than a minute to set up.
            </p>
          </motion.div>

          <motion.div variants={staggerItem} style={{ display: "grid", gap: 10 }}>
            <button type="button" onClick={onGuest} className="btn-secondary">
              <AppleLogo size={20} weight="fill" />
              Continue with Apple
            </button>
            <button type="button" onClick={onGuest} className="btn-secondary">
              <GoogleLogo size={20} weight="bold" />
              Continue with Google
            </button>
          </motion.div>

          <motion.div
            variants={staggerItem}
            style={{
              display: "flex",
              alignItems: "center",
              gap: 14,
              margin: "26px 0",
            }}
          >
            <div style={{ flex: 1, height: 1, background: "var(--hairline)" }} />
            <span
              style={{
                fontSize: 11,
                color: "var(--ink-faint)",
                fontWeight: 700,
                textTransform: "uppercase",
                letterSpacing: "0.1em",
              }}
            >
              or
            </span>
            <div style={{ flex: 1, height: 1, background: "var(--hairline)" }} />
          </motion.div>

          <motion.div variants={staggerItem} className="field" style={{ marginBottom: 14 }}>
            <label htmlFor="signup-email">Email</label>
            <div style={{ position: "relative" }}>
              <EnvelopeSimple
                size={19}
                weight="regular"
                style={{
                  position: "absolute",
                  left: 18,
                  top: "50%",
                  transform: "translateY(-50%)",
                  color: "var(--ink-faint)",
                }}
              />
              <input
                id="signup-email"
                type="email"
                placeholder="you@example.com"
                style={{ paddingLeft: 46 }}
              />
            </div>
          </motion.div>

          <motion.button
            variants={staggerItem}
            type="button"
            onClick={onGuest}
            className="btn-primary"
          >
            Continue
          </motion.button>

          <motion.button
            variants={staggerItem}
            type="button"
            onClick={onGuest}
            className="btn-text"
            style={{ marginTop: 12, width: "100%" }}
          >
            Continue as guest
          </motion.button>

          <motion.p
            variants={staggerItem}
            style={{
              fontSize: 12,
              color: "var(--ink-faint)",
              textAlign: "center",
              marginTop: 22,
              maxWidth: 300,
              marginInline: "auto",
              lineHeight: 1.5,
              fontWeight: 500,
            }}
          >
            By continuing you agree to our terms.
            <br />
            No bank connection required.
          </motion.p>
        </motion.div>
      </div>
    </>
  );
}
