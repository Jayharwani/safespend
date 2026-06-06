import { motion } from "framer-motion";
import { easeOut } from "../lib/motion";

export default function SplashScreen() {
  return (
    <div className="app-shell items-center justify-center min-h-dvh">
      <motion.div
        initial={{ opacity: 0, scale: 0.92 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6, ease: easeOut }}
        className="text-center"
      >
        <div className="w-16 h-16 rounded-[20px] bg-brand-tint flex items-center justify-center mx-auto mb-4 shadow-e1">
          <span className="text-brand text-[28px] font-semibold">H</span>
        </div>
        <h1 className="text-[30px] font-semibold tracking-[-0.5px] text-primary">Headroom</h1>
        <p className="text-[13px] text-secondary mt-1">Know what you can spend</p>
      </motion.div>
    </div>
  );
}
