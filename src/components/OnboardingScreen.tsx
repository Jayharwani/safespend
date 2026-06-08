import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { OnboardingIllustration } from "./illustrations/OnboardingIllustrations";
import { easeOut } from "../lib/motion";
import AuroraBackground from "./AuroraBackground";

const CARDS = [
  {
    scene: "balance" as const,
    eyebrow: "Clarity",
    title: "See what's actually yours.",
    body: "Your balance lies. Headroom subtracts what's coming so you know what's safe to spend right now.",
  },
  {
    scene: "calendar" as const,
    eyebrow: "Effortless",
    title: "No budgets. No categories.",
    body: "Enter your bills once. We do the daily math so you can stay in flow.",
  },
  {
    scene: "shield" as const,
    eyebrow: "Confidence",
    title: "Never get caught short.",
    body: "Predictive alerts warn you before a bill would push your balance under.",
  },
];

interface OnboardingScreenProps {
  onComplete: () => void;
  onSkip: () => void;
}

export default function OnboardingScreen({ onComplete, onSkip }: OnboardingScreenProps) {
  const [index, setIndex] = useState(0);
  const card = CARDS[index];
  const isLast = index === CARDS.length - 1;

  return (
    <>
      <AuroraBackground />
      <div className="app-shell">
        <div
          style={{
            flex: 1,
            display: "flex",
            flexDirection: "column",
            padding: "16px 24px 32px",
          }}
        >
          {/* Top bar */}
          <div style={{ display: "flex", justifyContent: "flex-end", height: 44 }}>
            {!isLast ? (
              <button type="button" onClick={onSkip} className="btn-text" style={{ padding: 8 }}>
                Skip
              </button>
            ) : null}
          </div>

          {/* Content */}
          <div
            style={{
              flex: 1,
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
            }}
          >
            <AnimatePresence mode="wait">
              <motion.div
                key={index}
                initial={{ opacity: 0, x: 28 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.45, ease: easeOut }}
              >
                <div
                  style={{
                    display: "flex",
                    justifyContent: "center",
                    padding: "12px 0 36px",
                  }}
                >
                  <div style={{ width: "100%", maxWidth: 320 }}>
                    <OnboardingIllustration scene={card.scene} />
                  </div>
                </div>

                <div style={{ textAlign: "center", padding: "0 4px" }}>
                  <p
                    style={{
                      fontSize: 12,
                      fontWeight: 700,
                      color: "var(--accent)",
                      textTransform: "uppercase",
                      letterSpacing: "0.16em",
                      marginBottom: 12,
                    }}
                  >
                    {card.eyebrow}
                  </p>
                  <h2
                    style={{
                      fontSize: 30,
                      fontWeight: 600,
                      letterSpacing: "-0.03em",
                      lineHeight: 1.15,
                      color: "var(--ink)",
                      marginBottom: 14,
                    }}
                  >
                    {card.title}
                  </h2>
                  <p
                    style={{
                      fontSize: 16,
                      color: "var(--ink-soft)",
                      lineHeight: 1.5,
                      maxWidth: 340,
                      margin: "0 auto",
                      fontWeight: 500,
                    }}
                  >
                    {card.body}
                  </p>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Dots + action */}
          <div style={{ marginTop: "auto" }}>
            <div
              style={{
                display: "flex",
                justifyContent: "center",
                gap: 8,
                marginBottom: 28,
              }}
            >
              {CARDS.map((_, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => setIndex(i)}
                  aria-label={`Slide ${i + 1}`}
                  style={{
                    height: 8,
                    width: i === index ? 28 : 8,
                    borderRadius: 999,
                    border: "none",
                    background: i === index ? "var(--accent)" : "var(--hairline-strong)",
                    transition:
                      "width 360ms cubic-bezier(0.16, 1, 0.3, 1), background 280ms ease",
                  }}
                />
              ))}
            </div>

            <button
              type="button"
              onClick={isLast ? onComplete : () => setIndex(index + 1)}
              className="btn-primary"
            >
              {isLast ? "Get started" : "Continue"}
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
