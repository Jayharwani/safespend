import { useEffect } from "react";
import { Check } from "../lib/icons";
import { motion } from "framer-motion";

interface ToastProps {
  message: string;
  onDone: () => void;
}

export default function Toast({ message, onDone }: ToastProps) {
  useEffect(() => {
    const t = setTimeout(onDone, 2400);
    return () => clearTimeout(t);
  }, [onDone]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 24, x: "-50%", scale: 0.95 }}
      animate={{ opacity: 1, y: 0, x: "-50%", scale: 1 }}
      exit={{ opacity: 0, y: 12, x: "-50%", scale: 0.97 }}
      transition={{ type: "spring", stiffness: 380, damping: 28 }}
      style={{
        position: "fixed",
        left: "50%",
        bottom: "calc(108px + env(safe-area-inset-bottom))",
        zIndex: 60,
      }}
      role="status"
    >
      <div
        className="toast"
        style={{
          display: "flex",
          alignItems: "center",
          gap: 12,
        }}
      >
        <span
          style={{
            width: 28,
            height: 28,
            borderRadius: 999,
            background: "var(--accent)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            flexShrink: 0,
            color: "var(--on-accent)",
            boxShadow: "var(--shadow-sm)",
          }}
        >
          <Check size={15} weight="bold" />
        </span>
        {message}
      </div>
    </motion.div>
  );
}
