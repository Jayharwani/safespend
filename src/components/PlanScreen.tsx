import { format } from "date-fns";
import { Plus, CaretRight } from "../lib/icons";
import { motion } from "framer-motion";
import type { AppData, Bill } from "../types";
import { formatMoney } from "../lib/finance";
import { getBillIcon } from "../lib/billIcon";
import { staggerContainer, staggerItem } from "../lib/motion";
import type { EditTarget } from "./EditSheet";

interface PlanScreenProps {
  data: AppData;
  onEdit: (target: EditTarget) => void;
}

const FREQ_LABEL = {
  weekly: "Weekly",
  fortnightly: "Fortnightly",
  monthly: "Monthly",
};

export default function PlanScreen({ data, onEdit }: PlanScreenProps) {
  const newBill: Bill = { id: crypto.randomUUID(), name: "", amount: 0, dayOfMonth: 1 };

  const Row = ({
    title,
    sub,
    value,
    onClick,
    icon,
    danger,
  }: {
    title: string;
    sub: string;
    value?: string;
    onClick: () => void;
    icon?: React.ReactNode;
    danger?: boolean;
  }) => (
    <button
      type="button"
      onClick={onClick}
      className="row"
      style={{
        width: "100%",
        background: "transparent",
        border: "none",
        textAlign: "left",
        cursor: "pointer",
      }}
    >
      {icon && <span className="chip-ico">{icon}</span>}
      <div className="main">
        <p style={danger ? { color: "var(--over)" } : undefined}>{title}</p>
        <p className="sub">{sub}</p>
      </div>
      {value && (
        <span className="money amt" style={{ marginRight: 8 }}>
          {value}
        </span>
      )}
      <CaretRight size={17} weight="bold" color="var(--ink-faint)" />
    </button>
  );

  return (
    <motion.div
      className="flex-1 flex flex-col"
      variants={staggerContainer}
      initial="initial"
      animate="animate"
    >
      <motion.header variants={staggerItem} style={{ padding: "24px 24px 4px" }}>
        <p className="section-header" style={{ padding: 0 }}>
          Plan
        </p>
        <h1 style={{ fontSize: 30, fontWeight: 600, letterSpacing: "-0.02em", marginTop: 4 }}>
          Edit your money
        </h1>
      </motion.header>

      <div
        className="flex-1 overflow-y-auto"
        style={{ paddingBottom: "calc(64px + env(safe-area-inset-bottom) + 24px)", paddingTop: 16 }}
      >
        {/* YOUR MONEY */}
        <motion.section variants={staggerItem} style={{ padding: "0 20px" }}>
          <p className="section-header">Your money</p>
          <div className="card" style={{ padding: 0 }}>
            <Row
              title="Balance"
              sub="In your account right now"
              value={formatMoney(data.balance)}
              onClick={() => onEdit({ kind: "balance", balance: data.balance })}
            />
            <Row
              title="Paycheck"
              sub={`${FREQ_LABEL[data.payFrequency]} · next ${format(
                new Date(data.nextPayday + "T00:00:00"),
                "MMM d"
              )}`}
              value={formatMoney(data.payAmount)}
              onClick={() =>
                onEdit({
                  kind: "paycheck",
                  payAmount: data.payAmount,
                  payFrequency: data.payFrequency,
                  nextPayday: data.nextPayday,
                })
              }
            />
          </div>
        </motion.section>

        {/* BILLS */}
        <motion.section variants={staggerItem} style={{ padding: "28px 20px 0" }}>
          <p className="section-header">Bills</p>
          <div className="card" style={{ padding: 0 }}>
            {data.bills.length === 0 ? (
              <p
                style={{
                  fontSize: 15,
                  color: "var(--ink-soft)",
                  padding: "20px",
                  textAlign: "center",
                }}
              >
                No bills yet. Add your regulars below.
              </p>
            ) : (
              data.bills.map((bill, i) => {
                const BillIcon = getBillIcon(bill.name);
                return (
                  <motion.div
                    key={bill.id}
                    initial={{ opacity: 0, x: -8 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.04 * i, duration: 0.3 }}
                  >
                    <Row
                      title={bill.name || "Unnamed bill"}
                      sub={`Day ${bill.dayOfMonth} each month`}
                      value={formatMoney(bill.amount)}
                      icon={<BillIcon size={20} weight="duotone" />}
                      onClick={() => onEdit({ kind: "bill", bill })}
                    />
                  </motion.div>
                );
              })
            )}
          </div>
          <button
            type="button"
            onClick={() => onEdit({ kind: "bill", bill: newBill })}
            style={{
              marginTop: 12,
              width: "100%",
              height: 52,
              border: "1.5px dashed var(--hairline-strong)",
              borderRadius: "var(--r-input)",
              background: "transparent",
              color: "var(--accent-deep)",
              fontSize: 15,
              fontWeight: 600,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: 6,
            }}
          >
            <Plus size={18} weight="bold" />
            Add a bill
          </button>
        </motion.section>
      </div>
    </motion.div>
  );
}
