import { AnimatePresence, motion } from "framer-motion";
import type { ReactNode } from "react";
import { pageVariants } from "../lib/motion";

interface PageTransitionProps {
  id: string;
  children: ReactNode;
}

export default function PageTransition({ id, children }: PageTransitionProps) {
  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={id}
        variants={pageVariants}
        initial="initial"
        animate="enter"
        exit="exit"
        className="flex-1 flex flex-col min-h-0"
      >
        {children}
      </motion.div>
    </AnimatePresence>
  );
}
