import { useRef, useState } from "react";
import { motion } from "framer-motion";
import {
  ChartBar,
  CaretRight,
  ArrowsClockwise,
  Sparkle,
  DownloadSimple,
  UploadSimple,
  Bell,
  Check,
} from "../lib/icons";
import { staggerContainer, staggerItem } from "../lib/motion";
import type { NotifyState } from "../lib/notify";

interface MenuScreenProps {
  onOpenInsights: () => void;
  onReset: () => void;
  onExport: () => void;
  onImport: (text: string) => void;
  notifPerm: NotifyState;
  onEnableNotifications: () => void;
  onTestNotification: () => void;
  onLoadDemo: (scenario: "healthy" | "tight" | "danger") => void;
  onPreviewPayday: () => void;
}

const DEMOS = [
  { id: "healthy" as const, label: "Healthy cycle", color: "var(--safe)" },
  { id: "tight" as const, label: "Tight cycle", color: "var(--tight)" },
  { id: "danger" as const, label: "Over budget", color: "var(--over)" },
];

export default function MenuScreen({
  onOpenInsights,
  onReset,
  onExport,
  onImport,
  notifPerm,
  onEnableNotifications,
  onTestNotification,
  onLoadDemo,
  onPreviewPayday,
}: MenuScreenProps) {
  const [showDev, setShowDev] = useState(false);
  const pressTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const fileInput = useRef<HTMLInputElement | null>(null);
  const startPress = () => {
    pressTimer.current = setTimeout(() => setShowDev((v) => !v), 600);
  };
  const cancelPress = () => {
    if (pressTimer.current) clearTimeout(pressTimer.current);
  };

  const onFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => onImport(String(reader.result ?? ""));
    reader.readAsText(file);
    e.target.value = ""; // allow re-importing the same file
  };

  return (
    <motion.div
      className="flex-1 flex flex-col"
      variants={staggerContainer}
      initial="initial"
      animate="animate"
    >
      <motion.header
        variants={staggerItem}
        style={{ padding: "22px 24px 4px", userSelect: "none" }}
        onPointerDown={startPress}
        onPointerUp={cancelPress}
        onPointerLeave={cancelPress}
      >
        <p className="section-header" style={{ padding: 0 }}>
          Menu
        </p>
        <h1 style={{ fontSize: 30, fontWeight: 600, letterSpacing: "-0.02em", marginTop: 4 }}>
          Menu
        </h1>
      </motion.header>

      <div
        className="flex-1 overflow-y-auto"
        style={{ paddingBottom: "calc(64px + env(safe-area-inset-bottom) + 24px)", paddingTop: 18 }}
      >
        <motion.section variants={staggerItem} style={{ padding: "0 24px" }}>
          <div className="card" style={{ padding: 0 }}>
            <button
              type="button"
              onClick={onOpenInsights}
              className="row"
              style={{ width: "100%", background: "none", border: "none", textAlign: "left", cursor: "pointer" }}
            >
              <span className="chip-ico">
                <ChartBar size={20} weight="duotone" />
              </span>
              <div className="main">
                <p>Your spending patterns</p>
                <p className="sub">See where your money goes</p>
              </div>
              <CaretRight size={18} weight="bold" color="var(--ink-faint)" />
            </button>
          </div>
        </motion.section>

        {/* Notifications */}
        {notifPerm !== "unsupported" && (
          <motion.section variants={staggerItem} style={{ padding: "20px 24px 0" }}>
            <p className="section-header">Notifications</p>
            <div className="card" style={{ padding: 0 }}>
              <button
                type="button"
                onClick={onEnableNotifications}
                disabled={notifPerm === "granted"}
                className="row"
                style={{
                  width: "100%",
                  background: "none",
                  border: "none",
                  textAlign: "left",
                  cursor: notifPerm === "granted" ? "default" : "pointer",
                }}
              >
                <span className="chip-ico">
                  <Bell size={20} weight="duotone" />
                </span>
                <div className="main">
                  <p>Heads-up alerts</p>
                  <p className="sub">
                    {notifPerm === "granted"
                      ? "On — we'll ping you before you'd dip low"
                      : notifPerm === "denied"
                        ? "Blocked — enable in your browser settings"
                        : "Get a ping before you'd dip low"}
                  </p>
                </div>
                {notifPerm === "granted" ? (
                  <span
                    style={{
                      display: "inline-flex",
                      alignItems: "center",
                      gap: 5,
                      color: "var(--accent-deep)",
                      fontWeight: 600,
                      fontSize: 13,
                    }}
                  >
                    <Check size={15} weight="bold" /> On
                  </span>
                ) : (
                  <CaretRight size={18} weight="bold" color="var(--ink-faint)" />
                )}
              </button>

              {notifPerm === "granted" && (
                <button
                  type="button"
                  onClick={onTestNotification}
                  className="row"
                  style={{ width: "100%", background: "none", border: "none", textAlign: "left", cursor: "pointer" }}
                >
                  <span className="chip-ico" style={{ background: "var(--bg)" }}>
                    <Sparkle size={20} weight="duotone" color="var(--ink-soft)" />
                  </span>
                  <div className="main">
                    <p>Send a test notification</p>
                    <p className="sub">Check it shows on this device</p>
                  </div>
                  <CaretRight size={18} weight="bold" color="var(--ink-faint)" />
                </button>
              )}
            </div>
          </motion.section>
        )}

        {/* Backup */}
        <motion.section variants={staggerItem} style={{ padding: "20px 24px 0" }}>
          <p className="section-header">Backup</p>
          <div className="card" style={{ padding: 0 }}>
            <button
              type="button"
              onClick={onExport}
              className="row"
              style={{ width: "100%", background: "none", border: "none", textAlign: "left", cursor: "pointer" }}
            >
              <span className="chip-ico">
                <DownloadSimple size={20} weight="duotone" />
              </span>
              <div className="main">
                <p>Export a backup</p>
                <p className="sub">Download your data as a file</p>
              </div>
              <CaretRight size={18} weight="bold" color="var(--ink-faint)" />
            </button>
            <button
              type="button"
              onClick={() => fileInput.current?.click()}
              className="row"
              style={{ width: "100%", background: "none", border: "none", textAlign: "left", cursor: "pointer" }}
            >
              <span className="chip-ico">
                <UploadSimple size={20} weight="duotone" />
              </span>
              <div className="main">
                <p>Restore from backup</p>
                <p className="sub">Import a previously saved file</p>
              </div>
              <CaretRight size={18} weight="bold" color="var(--ink-faint)" />
            </button>
          </div>
          <input
            ref={fileInput}
            type="file"
            accept="application/json,.json"
            onChange={onFile}
            style={{ display: "none" }}
          />
        </motion.section>

        <motion.section variants={staggerItem} style={{ padding: "20px 24px 0" }}>
          <div className="card" style={{ padding: 0 }}>
            <button
              type="button"
              onClick={onReset}
              className="row"
              style={{ width: "100%", background: "none", border: "none", textAlign: "left", cursor: "pointer" }}
            >
              <span className="chip-ico" style={{ background: "var(--over-bg)", color: "var(--over)" }}>
                <ArrowsClockwise size={20} weight="duotone" />
              </span>
              <div className="main">
                <p style={{ color: "var(--over)" }}>Delete data &amp; start over</p>
                <p className="sub">Wipe everything and run setup again</p>
              </div>
              <CaretRight size={18} weight="bold" color="var(--ink-faint)" />
            </button>
          </div>
        </motion.section>

        {showDev && (
          <motion.section
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            style={{ padding: "24px 24px 0" }}
          >
            <p className="section-header">Demo scenarios</p>
            <div className="card" style={{ padding: 0 }}>
              {DEMOS.map((d) => (
                <button
                  key={d.id}
                  type="button"
                  onClick={() => onLoadDemo(d.id)}
                  className="row"
                  style={{ width: "100%", background: "none", border: "none", textAlign: "left", cursor: "pointer" }}
                >
                  <span
                    className="chip-ico"
                    style={{ background: "var(--bg)" }}
                  >
                    <span
                      style={{
                        width: 12,
                        height: 12,
                        borderRadius: 999,
                        background: d.color,
                      }}
                    />
                  </span>
                  <div className="main">
                    <p>{d.label}</p>
                  </div>
                  <CaretRight size={18} weight="bold" color="var(--ink-faint)" />
                </button>
              ))}
              <button
                type="button"
                onClick={onPreviewPayday}
                className="row"
                style={{ width: "100%", background: "none", border: "none", textAlign: "left", cursor: "pointer" }}
              >
                <span className="chip-ico" style={{ background: "var(--accent-soft)", color: "var(--accent-deep)" }}>
                  <Sparkle size={20} weight="duotone" />
                </span>
                <div className="main">
                  <p>Preview payday</p>
                </div>
                <CaretRight size={18} weight="bold" color="var(--ink-faint)" />
              </button>
            </div>
          </motion.section>
        )}

        <motion.p
          variants={staggerItem}
          style={{
            textAlign: "center",
            fontSize: 12,
            color: "var(--ink-faint)",
            fontWeight: 500,
            padding: "32px 24px 8px",
          }}
        >
          Headroom · stored locally on this device.
        </motion.p>
      </div>
    </motion.div>
  );
}
