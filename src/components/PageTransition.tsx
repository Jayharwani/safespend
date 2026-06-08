import { motion } from "framer-motion";
import type { ReactNode } from "react";
import { easeOut } from "../lib/motion";

interface PageTransitionProps {
  id: string;
  children: ReactNode;
}

/**
 * Keyed screen transition. Changing `id` remounts the screen, replaying the
 * soft slide-in. No AnimatePresence/mode="wait" (which can stick the incoming
 * screen at its initial state) — the new screen always animates in.
 */
export default function PageTransition({ id, children }: PageTransitionProps) {
  return (
    <motion.div
      key={id}
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.42, ease: easeOut }}
      className="flex-1 flex flex-col min-h-0"
    >
      {children}
    </motion.div>
  );
}
