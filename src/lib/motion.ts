export const easeOut = [0.16, 1, 0.3, 1] as const;

export const springSoft = { type: "spring" as const, stiffness: 240, damping: 28, mass: 0.9 };

export const dur = { fast: 0.22, base: 0.42, slow: 0.7 };

export const pageVariants = {
  initial: { opacity: 0, x: 24 },
  enter: { opacity: 1, x: 0, transition: { duration: dur.base, ease: easeOut } },
  exit: { opacity: 0, x: -16, transition: { duration: dur.fast } },
};

export const staggerContainer = {
  initial: {},
  animate: { transition: { staggerChildren: 0.07 } },
};

export const staggerItem = {
  initial: { opacity: 0, y: 16 },
  animate: { opacity: 1, y: 0, transition: { duration: dur.base, ease: easeOut } },
};

export function prefersReducedMotion(): boolean {
  return (
    typeof window !== "undefined" &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches
  );
}
