import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Plus, ArrowRight } from "../lib/icons";

interface BIPEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
}

const DISMISS_KEY = "hr-install-dismissed";

function isStandalone() {
  return (
    window.matchMedia("(display-mode: standalone)").matches ||
    // iOS Safari
    (window.navigator as unknown as { standalone?: boolean }).standalone === true
  );
}

function isIOS() {
  const ua = window.navigator.userAgent;
  const ios = /iphone|ipad|ipod/i.test(ua);
  const notChromeOnIOS = !/crios|fxios|edgios/i.test(ua); // only Safari shows the Share sheet flow
  return ios && notChromeOnIOS;
}

export default function InstallHint() {
  const [deferred, setDeferred] = useState<BIPEvent | null>(null);
  const [show, setShow] = useState(false);

  useEffect(() => {
    if (isStandalone()) return;
    if (localStorage.getItem(DISMISS_KEY) === "1") return;

    const onBIP = (e: Event) => {
      e.preventDefault();
      setDeferred(e as BIPEvent);
      setShow(true);
    };
    window.addEventListener("beforeinstallprompt", onBIP);

    // iOS has no beforeinstallprompt — show the Share tip directly.
    if (isIOS()) setShow(true);

    return () => window.removeEventListener("beforeinstallprompt", onBIP);
  }, []);

  const dismiss = () => {
    localStorage.setItem(DISMISS_KEY, "1");
    setShow(false);
  };

  const install = async () => {
    if (!deferred) return;
    await deferred.prompt();
    const choice = await deferred.userChoice;
    if (choice.outcome === "accepted") dismiss();
    setDeferred(null);
  };

  const ios = isIOS();

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ opacity: 0, y: -8, height: 0 }}
          animate={{ opacity: 1, y: 0, height: "auto" }}
          exit={{ opacity: 0, height: 0 }}
          transition={{ duration: 0.32, ease: [0.16, 1, 0.3, 1] }}
          style={{ padding: "10px 16px 0" }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 12,
              background: "var(--accent-soft)",
              border: "1px solid var(--accent-line)",
              borderRadius: 14,
              padding: "12px 14px",
            }}
          >
            <span
              className="wordmark-mono"
              style={{ width: 34, height: 34, fontSize: 17, borderRadius: 10, flexShrink: 0 }}
            >
              H
            </span>
            <div style={{ flex: 1, minWidth: 0 }}>
              <p style={{ fontSize: 14, fontWeight: 600, color: "var(--ink)" }}>
                Install Headroom
              </p>
              <p style={{ fontSize: 12.5, color: "var(--accent-deep)", marginTop: 1 }}>
                {ios ? (
                  <>
                    Tap Share <ArrowRight size={12} weight="bold" style={{ display: "inline", verticalAlign: "-1px" }} /> “Add to Home Screen”
                  </>
                ) : (
                  "Add it to your home screen for full-screen, offline use."
                )}
              </p>
            </div>

            {!ios && deferred && (
              <button
                type="button"
                onClick={install}
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 4,
                  height: 36,
                  padding: "0 14px",
                  borderRadius: 999,
                  border: "none",
                  background: "var(--accent-deep)",
                  color: "var(--on-accent)",
                  fontSize: 14,
                  fontWeight: 600,
                  flexShrink: 0,
                }}
              >
                <Plus size={15} weight="bold" />
                Add
              </button>
            )}

            <button
              type="button"
              onClick={dismiss}
              aria-label="Dismiss"
              style={{
                width: 30,
                height: 30,
                borderRadius: 999,
                border: "none",
                background: "transparent",
                color: "var(--ink-faint)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                flexShrink: 0,
              }}
            >
              <X size={15} weight="bold" />
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
