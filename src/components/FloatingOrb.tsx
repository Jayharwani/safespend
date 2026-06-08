import { motion } from "framer-motion";

interface FloatingOrbProps {
  size?: number;
  variant?: "brand" | "safe" | "tight" | "over";
}

const tone = {
  brand: { light: "#5FD9AC", base: "#35C28D", deep: "#176B4A" },
  safe: { light: "#5FD9AC", base: "#35C28D", deep: "#176B4A" },
  tight: { light: "#E7C57E", base: "#D9A441", deep: "#8C6418" },
  over: { light: "#E08E78", base: "#D2674F", deep: "#8E3F2C" },
};

/**
 * A single matte, studio-lit sphere. One soft key light (top-left),
 * realistic inset shading, a soft contact shadow beneath. No glow, no rings.
 */
export default function FloatingOrb({ size = 132, variant = "brand" }: FloatingOrbProps) {
  const t = tone[variant];

  return (
    <motion.div
      style={{ position: "relative", width: size, height: size * 1.18 }}
      animate={{ y: [0, -6, 0] }}
      transition={{ duration: 6, ease: "easeInOut", repeat: Infinity }}
    >
      {/* Soft contact shadow */}
      <div
        style={{
          position: "absolute",
          bottom: 0,
          left: "50%",
          transform: "translateX(-50%)",
          width: size * 0.7,
          height: size * 0.12,
          borderRadius: "50%",
          background: "rgba(0, 0, 0, 0.4)",
          filter: "blur(10px)",
        }}
      />

      {/* Sphere */}
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: size,
          height: size,
          borderRadius: "50%",
          background: `radial-gradient(circle at 32% 28%, ${t.light} 0%, ${t.base} 42%, ${t.deep} 100%)`,
          boxShadow: `inset -${size * 0.12}px -${size * 0.14}px ${size * 0.26}px rgba(0,0,0,0.35)`,
        }}
      />

      {/* Soft specular highlight */}
      <div
        style={{
          position: "absolute",
          top: size * 0.14,
          left: size * 0.22,
          width: size * 0.26,
          height: size * 0.18,
          borderRadius: "50%",
          background:
            "radial-gradient(ellipse, rgba(255,255,255,0.6) 0%, rgba(255,255,255,0) 72%)",
          filter: "blur(3px)",
        }}
      />
    </motion.div>
  );
}
