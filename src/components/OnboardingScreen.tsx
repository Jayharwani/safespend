import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { OnboardingIllustration } from "./illustrations/OnboardingIllustrations";
import { easeOut } from "../lib/motion";

const CARDS = [
  {
    scene: "balance" as const,
    title: "See what's actually yours",
    body: "Your balance lies. We subtract what's coming so you know what's safe to spend.",
  },
  {
    scene: "calendar" as const,
    title: "No budgets. No categories.",
    body: "Enter your bills once. We do the math every day.",
  },
  {
    scene: "shield" as const,
    title: "Never get caught short",
    body: "We warn you before a bill would push you under.",
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
    <div className="app-shell">
      <div className="flex-1 flex flex-col px-6 pt-10 pb-8">
        <div className="flex justify-end mb-2">
          <button type="button" onClick={onSkip} className="text-brand text-[17px] font-semibold min-h-[44px] px-2">
            Skip
          </button>
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={index}
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -30 }}
            transition={{ duration: 0.42, ease: easeOut }}
            className="flex-1 flex flex-col"
          >
            <div className="flex-1 flex items-center justify-center py-6">
              <OnboardingIllustration scene={card.scene} />
            </div>
            <h2 className="text-[30px] leading-[1.15] font-semibold tracking-[-0.5px] mb-3">
              {card.title}
            </h2>
            <p className="text-[17px] text-secondary leading-relaxed mb-8">{card.body}</p>
          </motion.div>
        </AnimatePresence>

        <div className="flex justify-center gap-2 mb-6">
          {CARDS.map((_, i) => (
            <div
              key={i}
              className="h-1.5 rounded-full transition-all duration-300"
              style={{
                width: i === index ? 24 : 8,
                background: i === index ? "var(--brand)" : "var(--hairline)",
              }}
            />
          ))}
        </div>

        {isLast ? (
          <button type="button" onClick={onComplete} className="btn-primary">
            Get started
          </button>
        ) : (
          <button
            type="button"
            onClick={() => setIndex(index + 1)}
            className="btn-primary"
          >
            Next
          </button>
        )}
      </div>
    </div>
  );
}
