import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import { CaretLeft, TrendDown, TrendUp } from "../lib/icons";
import type { AppData } from "../types";
import { formatMoney } from "../lib/finance";
import { aggregateSpends } from "../lib/insights";
import { staggerContainer, staggerItem, prefersReducedMotion } from "../lib/motion";

interface InsightsScreenProps {
  data: AppData;
  onBack: () => void;
}

type Range = "week" | "month";

export default function InsightsScreen({ data, onBack }: InsightsScreenProps) {
  const [range, setRange] = useState<Range>("week");
  const reduced = prefersReducedMotion();

  const agg = useMemo(() => aggregateSpends(data.oneOffs, range), [data.oneOffs, range]);
  // Default selection = current (last) bar.
  const [selected, setSelected] = useState<number | null>(null);
  const currentIdx = agg.bars.length - 1;
  const activeIdx = selected ?? currentIdx;

  const maxAmount = Math.max(...agg.bars.map((b) => b.amount), 1);
  const delta = agg.total - agg.prevTotal;
  const down = delta <= 0;
  const deltaAbs = Math.abs(delta);

  const advice = down
    ? `Nice — you're under ${agg.prevLabel}. You've got a little room.`
    : `You're spending faster than ${agg.prevLabel}. Easing off for a day or two keeps you on track.`;

  return (
    <motion.div
      className="app-shell"
      role="main"
      variants={staggerContainer}
      initial="initial"
      animate="animate"
    >
      <motion.header
        variants={staggerItem}
        style={{ display: "flex", alignItems: "center", gap: 14, padding: "22px 24px 8px" }}
      >
        <button type="button" onClick={onBack} className="icon-btn" aria-label="Back">
          <CaretLeft size={20} weight="bold" />
        </button>
        <div>
          <p className="section-header" style={{ padding: 0 }}>
            Insights
          </p>
          <h1 style={{ fontSize: 22, fontWeight: 600, letterSpacing: "-0.02em", marginTop: 2 }}>
            Spending patterns
          </h1>
        </div>
      </motion.header>

      <div className="flex-1 overflow-y-auto" style={{ paddingBottom: 32 }}>
        {/* Week / Month filter */}
        <motion.div variants={staggerItem} style={{ padding: "12px 24px 0" }}>
          <div className="segmented" role="tablist" aria-label="Range">
            {(["week", "month"] as const).map((r) => (
              <button
                key={r}
                type="button"
                role="tab"
                aria-selected={range === r}
                onClick={() => {
                  setRange(r);
                  setSelected(null);
                }}
                style={{ position: "relative" }}
              >
                {range === r && (
                  <motion.span
                    layoutId="insights-range-pill"
                    style={{
                      position: "absolute",
                      inset: 0,
                      borderRadius: 10,
                      background: "var(--surface)",
                      boxShadow: "var(--shadow-sm)",
                      zIndex: -1,
                    }}
                    transition={{ type: "spring", stiffness: 420, damping: 36 }}
                  />
                )}
                {r === "week" ? "Week" : "Month"}
              </button>
            ))}
          </div>
        </motion.div>

        {/* Period total + delta */}
        <motion.section variants={staggerItem} style={{ padding: "22px 24px 0" }}>
          <p className="section-header" style={{ padding: 0 }}>
            {selected !== null ? agg.bars[activeIdx].sublabel : `Spent ${agg.periodLabel}`}
          </p>
          <p
            className="money"
            style={{ fontSize: 48, fontWeight: 600, letterSpacing: "-0.03em", lineHeight: 1.05, marginTop: 6 }}
          >
            {formatMoney(selected !== null ? agg.bars[activeIdx].amount : agg.total)}
          </p>
          {selected === null && (
            <div style={{ marginTop: 10 }}>
              <span className={down ? "chip" : "chip chip--tight"}>
                {down ? <TrendDown size={13} weight="bold" /> : <TrendUp size={13} weight="bold" />}
                {deltaAbs === 0
                  ? `Same as ${agg.prevLabel}`
                  : `${formatMoney(deltaAbs)} ${down ? "less" : "more"} than ${agg.prevLabel}`}
              </span>
            </div>
          )}
        </motion.section>

        {/* Bar chart */}
        <motion.section variants={staggerItem} style={{ padding: "24px 24px 0" }}>
          <div className="card" style={{ padding: "20px 18px 14px" }}>
            <div style={{ position: "relative", height: 168 }}>
              {/* gridlines */}
              {[0, 0.5, 1].map((g) => (
                <div
                  key={g}
                  style={{
                    position: "absolute",
                    left: 0,
                    right: 0,
                    bottom: 26 + g * 130,
                    height: 1,
                    background: "var(--hairline)",
                  }}
                />
              ))}
              {/* bars */}
              <div
                style={{
                  position: "absolute",
                  inset: 0,
                  display: "flex",
                  alignItems: "flex-end",
                  gap: range === "week" ? 8 : 14,
                }}
              >
                {agg.bars.map((bar, i) => {
                  const h = Math.max((bar.amount / maxAmount) * 130, bar.amount > 0 ? 6 : 2);
                  const isActive = i === activeIdx;
                  return (
                    <button
                      key={i}
                      type="button"
                      onClick={() => setSelected(i === selected ? null : i)}
                      style={{
                        flex: 1,
                        height: "100%",
                        display: "flex",
                        flexDirection: "column",
                        justifyContent: "flex-end",
                        alignItems: "center",
                        gap: 8,
                        background: "none",
                        border: "none",
                        padding: 0,
                        cursor: "pointer",
                      }}
                      aria-label={`${bar.sublabel}: ${formatMoney(bar.amount)}`}
                    >
                      {isActive && bar.amount > 0 && (
                        <span
                          className="money"
                          style={{ fontSize: 11, fontWeight: 600, color: "var(--ink)" }}
                        >
                          {formatMoney(bar.amount)}
                        </span>
                      )}
                      <motion.span
                        initial={reduced ? { height: h } : { height: 0 }}
                        animate={{ height: h }}
                        transition={{ delay: reduced ? 0 : 0.04 * i, duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                        style={{
                          width: "100%",
                          maxWidth: 34,
                          borderRadius: 8,
                          background: isActive ? "var(--accent)" : "var(--hairline-strong)",
                          transition: "background 0.4s var(--ease-out)",
                        }}
                      />
                      <span style={{ fontSize: 11, fontWeight: 600, color: "var(--ink-faint)", height: 14 }}>
                        {bar.label}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        </motion.section>

        {/* Advice */}
        <motion.section variants={staggerItem} style={{ padding: "20px 24px 0" }}>
          <div
            className="card"
            style={{
              display: "flex",
              gap: 14,
              alignItems: "flex-start",
              background: down ? "var(--accent-soft)" : "var(--tight-bg)",
              border: "none",
            }}
          >
            <span
              style={{
                width: 36,
                height: 36,
                borderRadius: 11,
                background: "var(--surface)",
                color: down ? "var(--accent-deep)" : "var(--tight)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                flexShrink: 0,
              }}
            >
              {down ? <TrendDown size={18} weight="bold" /> : <TrendUp size={18} weight="bold" />}
            </span>
            <p
              style={{
                fontSize: 15,
                lineHeight: 1.45,
                color: down ? "var(--accent-deep)" : "var(--tight)",
                fontWeight: 500,
              }}
            >
              {advice}
            </p>
          </div>
        </motion.section>

        {agg.total === 0 && (
          <motion.p
            variants={staggerItem}
            style={{ textAlign: "center", fontSize: 13, color: "var(--ink-faint)", padding: "20px 24px 0" }}
          >
            Log a few spends from Home and your patterns will appear here.
          </motion.p>
        )}
      </div>
    </motion.div>
  );
}
