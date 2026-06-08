import { format } from "date-fns";
import { motion } from "framer-motion";
import { Check, Warning, Plus } from "../lib/icons";
import type { AppData, BudgetProjection, BudgetStatus } from "../types";
import { formatMoney } from "../lib/finance";
import { getBillIcon } from "../lib/billIcon";
import { timeGreeting } from "../lib/greeting";
import { staggerContainer, staggerItem } from "../lib/motion";
import AnimatedNumber from "./AnimatedNumber";

interface TodayScreenProps {
  data: AppData;
  projection: BudgetProjection;
  onAdd: () => void;
  onEditBalance: () => void;
}

const chipText: Record<BudgetStatus, string> = {
  healthy: "On track",
  tight: "Getting tight",
  over: "Heads up",
};

const chipClass: Record<BudgetStatus, string> = {
  healthy: "chip",
  tight: "chip chip--tight",
  over: "chip chip--over",
};

const stateColor: Record<BudgetStatus, string> = {
  healthy: "var(--accent)",
  tight: "var(--tight)",
  over: "var(--over)",
};

export default function TodayScreen({ data, projection, onAdd, onEditBalance }: TodayScreenProps) {
  const { safeToSpend, dailyAllowance, daysUntilPayday, upcomingBills, status } = projection;
  const paydayLabel = format(new Date(data.nextPayday), "MMM d");
  const ChipIcon = status === "healthy" ? Check : Warning;

  return (
    <>
      <motion.div
        className="flex-1 flex flex-col"
        variants={staggerContainer}
        initial="initial"
        animate="animate"
      >
        <div className="flex-1 overflow-y-auto" style={{ paddingBottom: 150 }}>
          {/* 1 — Greeting + date */}
          <motion.header variants={staggerItem} style={{ padding: "24px 24px 8px" }}>
            <p style={{ fontSize: 14, color: "var(--ink-faint)", fontWeight: 600 }}>
              {timeGreeting()}
            </p>
            <p style={{ fontSize: 16, color: "var(--ink)", fontWeight: 600, marginTop: 2 }}>
              {format(new Date(), "EEEE, MMMM d")}
            </p>
          </motion.header>

          {/* 2 — Hero */}
          <motion.section variants={staggerItem} style={{ padding: "12px 20px 0" }}>
            <div className="hero">
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <p className="label">Safe to spend</p>
                <span className={chipClass[status]}>
                  <ChipIcon size={13} weight="bold" />
                  {chipText[status]}
                </span>
              </div>
              <AnimatedNumber
                value={safeToSpend}
                format={formatMoney}
                className="num"
                style={{ color: stateColor[status], transition: "color 0.5s var(--ease-out)" }}
                aria-label={`Safe to spend: ${safeToSpend} dollars until ${paydayLabel}, ${status}.`}
              />
              <p className="sub">
                {daysUntilPayday > 0 ? (
                  <>
                    <strong style={{ color: "var(--ink)", fontWeight: 600 }}>
                      {formatMoney(dailyAllowance)}
                    </strong>{" "}
                    a day · {daysUntilPayday} days to payday
                  </>
                ) : (
                  "Payday is today"
                )}
              </p>
            </div>
          </motion.section>

          {/* 3 — Context line (tappable balance) */}
          <motion.section variants={staggerItem} style={{ padding: "14px 28px 0" }}>
            <p style={{ fontSize: 14, color: "var(--ink-soft)" }}>
              In your account{" "}
              <button
                type="button"
                onClick={onEditBalance}
                style={{
                  background: "none",
                  border: "none",
                  padding: 0,
                  font: "inherit",
                  color: "var(--accent-deep)",
                  fontWeight: 600,
                  textDecoration: "underline",
                  textUnderlineOffset: 3,
                  textDecorationColor: "var(--accent-line)",
                }}
                className="money"
              >
                {formatMoney(data.balance)}
              </button>{" "}
              · Next pay {paydayLabel}
            </p>
          </motion.section>

          {/* 4 — Coming up */}
          <motion.section variants={staggerItem} style={{ padding: "20px 20px 0" }}>
            <p className="section-header">Coming up</p>
            <div className="card" style={{ padding: 0 }}>
              {upcomingBills.length === 0 ? (
                <p
                  style={{
                    fontSize: 15,
                    color: "var(--ink-soft)",
                    padding: "20px",
                    textAlign: "center",
                  }}
                >
                  Nothing due before your next payday.
                </p>
              ) : (
                <ul style={{ margin: 0, padding: 0, listStyle: "none" }}>
                  {upcomingBills.map((bill, i) => {
                    const BillIcon = getBillIcon(bill.name);
                    return (
                      <motion.li
                        key={`${bill.name}-${bill.dateLabel}-${i}`}
                        className="row"
                        initial={{ opacity: 0, x: -6 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.06 * i, duration: 0.34, ease: [0.16, 1, 0.3, 1] }}
                      >
                        <span className="chip-ico">
                          <BillIcon size={20} weight="duotone" />
                        </span>
                        <div className="main">
                          <p>{bill.name}</p>
                          <p className="sub">{bill.dateLabel}</p>
                        </div>
                        <span className="money amt">{formatMoney(bill.amount)}</span>
                      </motion.li>
                    );
                  })}
                </ul>
              )}
            </div>
          </motion.section>
        </div>
      </motion.div>

      {/* 5 — Bottom CTA */}
      <div
        style={{
          position: "fixed",
          left: 0,
          right: 0,
          bottom: "calc(80px + env(safe-area-inset-bottom))",
          maxWidth: 430,
          margin: "0 auto",
          padding: "0 20px",
          zIndex: 30,
          pointerEvents: "none",
        }}
      >
        <motion.button
          type="button"
          onClick={onAdd}
          className="btn-primary"
          style={{ pointerEvents: "auto" }}
          initial={{ y: 24, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.35, type: "spring", stiffness: 320, damping: 28 }}
        >
          <Plus size={20} weight="bold" />
          Add
        </motion.button>
      </div>
    </>
  );
}
