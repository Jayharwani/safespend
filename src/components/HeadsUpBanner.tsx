import { motion } from "framer-motion";
import { Warning, Sparkle, X } from "../lib/icons";
import type { HeadsUp } from "../lib/headsup";

interface HeadsUpBannerProps {
  headsUp: HeadsUp;
  onAdjust?: () => void;
  onDismiss: () => void;
}

const tone = {
  over: { bg: "var(--over-bg)", fg: "var(--over)" },
  tight: { bg: "var(--tight-bg)", fg: "var(--tight)" },
  payday: { bg: "var(--accent-soft)", fg: "var(--accent-deep)" },
};

export default function HeadsUpBanner({ headsUp, onAdjust, onDismiss }: HeadsUpBannerProps) {
  const t = tone[headsUp.level];
  const Icon = headsUp.level === "payday" ? Sparkle : Warning;

  return (
    <motion.div
      initial={{ opacity: 0, y: -8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -8 }}
      transition={{ duration: 0.42, ease: [0.16, 1, 0.3, 1] }}
      role="status"
      style={{
        display: "flex",
        gap: 12,
        alignItems: "flex-start",
        background: t.bg,
        borderRadius: 16,
        padding: "14px 14px 14px 16px",
      }}
    >
      <span
        style={{
          width: 32,
          height: 32,
          borderRadius: 10,
          background: "var(--surface)",
          color: t.fg,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          flexShrink: 0,
        }}
      >
        <Icon size={17} weight="bold" />
      </span>
      <div style={{ flex: 1, minWidth: 0 }}>
        <p style={{ fontSize: 14, lineHeight: 1.4, color: t.fg, fontWeight: 500 }}>
          {headsUp.message}
        </p>
        {headsUp.level === "over" && onAdjust && (
          <button
            type="button"
            onClick={onAdjust}
            style={{
              marginTop: 8,
              background: "none",
              border: "none",
              padding: 0,
              color: t.fg,
              fontWeight: 600,
              fontSize: 14,
              textDecoration: "underline",
              textUnderlineOffset: 3,
            }}
          >
            Adjust in Plan
          </button>
        )}
      </div>
      <button
        type="button"
        onClick={onDismiss}
        aria-label="Dismiss"
        style={{
          background: "none",
          border: "none",
          color: t.fg,
          opacity: 0.7,
          padding: 2,
          flexShrink: 0,
        }}
      >
        <X size={16} weight="bold" />
      </button>
    </motion.div>
  );
}
