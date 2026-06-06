import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { OnboardingIllustration } from "./illustrations/OnboardingIllustrations";
import { easeOut } from "../lib/motion";

const CARDS = [
  {
    scene: "balance" as const,
    title: "See what is actually yours",
    body: "Your bank balance lies. We subtract upcoming bills so you know what is truly safe to spend right now.",
  },
  {
    scene: "calendar" as const,
    title: "No budgets. No categories.",
    body: "Enter your recurring expenses once. We handle all the daily math so you can focus on living.",
  },
  {
    scene: "shield" as const,
    title: "Never get caught short",
    body: "Get gentle, predictive alerts before a bill would push your account into a tight or over-budget zone.",
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
        {/* Skip button */}
        <div className="flex justify-end mb-2">
          <button
            type="button"
            onClick={onSkip}
            className="text-secondary hover:text-brand text-[15px] font-semibold min-h-[40px] px-3 transition-colors cursor-pointer"
          >
            Skip
          </button>
        </div>

        {/* Card Content Slider */}
        <div className="flex-1 flex flex-col justify-center">
          <AnimatePresence mode="wait">
            <motion.div
              key={index}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.35, ease: easeOut }}
              className="flex-1 flex flex-col justify-center"
            >
              <div className="flex-1 flex items-center justify-center py-6 min-h-[220px]">
                <div className="w-full max-w-[280px] filter drop-shadow-sm">
                  <OnboardingIllustration scene={card.scene} />
                </div>
              </div>
              
              <div className="text-center px-2">
                <h2 className="text-[30px] leading-[1.2] font-bold tracking-tight text-primary mb-3">
                  {card.title}
                </h2>
                <p className="text-[15px] text-secondary leading-relaxed mb-6">
                  {card.body}
                </p>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Indicators and Action button */}
        <div className="mt-auto">
          {/* Dot Indicators */}
          <div className="flex justify-center gap-2 mb-8">
            {CARDS.map((_, i) => (
              <button
                key={i}
                type="button"
                onClick={() => setIndex(i)}
                className="h-2 rounded-full transition-all duration-300 cursor-pointer outline-none"
                style={{
                  width: i === index ? 24 : 8,
                  background: i === index ? "var(--brand)" : "var(--hairline)",
                }}
                aria-label={`Go to slide ${i + 1}`}
              />
            ))}
          </div>

          {/* Action button */}
          {isLast ? (
            <button
              type="button"
              onClick={onComplete}
              className="btn-primary"
            >
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
    </div>
  );
}
