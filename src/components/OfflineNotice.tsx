import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";

/**
 * A calm reassurance, not an alarm: the app is fully usable offline because the
 * data is on-device, so we only gently note the offline state.
 */
export default function OfflineNotice() {
  const [offline, setOffline] = useState(
    typeof navigator !== "undefined" && navigator.onLine === false
  );

  useEffect(() => {
    const on = () => setOffline(false);
    const off = () => setOffline(true);
    window.addEventListener("online", on);
    window.addEventListener("offline", off);
    return () => {
      window.removeEventListener("online", on);
      window.removeEventListener("offline", off);
    };
  }, []);

  return (
    <AnimatePresence>
      {offline && (
        <motion.div
          initial={{ opacity: 0, y: -12 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -12 }}
          transition={{ duration: 0.32, ease: [0.16, 1, 0.3, 1] }}
          role="status"
          style={{
            position: "fixed",
            top: "calc(env(safe-area-inset-top) + 10px)",
            left: "50%",
            transform: "translateX(-50%)",
            zIndex: 60,
            background: "var(--ink)",
            color: "var(--surface)",
            fontSize: 13,
            fontWeight: 500,
            padding: "8px 14px",
            borderRadius: 999,
            boxShadow: "var(--shadow-md)",
            whiteSpace: "nowrap",
          }}
        >
          You're offline — your data's still here
        </motion.div>
      )}
    </AnimatePresence>
  );
}
