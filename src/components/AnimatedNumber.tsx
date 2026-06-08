import { useEffect, useRef, useState, type CSSProperties } from "react";

interface AnimatedNumberProps {
  value: number;
  format: (n: number) => string;
  className?: string;
  style?: CSSProperties;
  "aria-label"?: string;
}

export default function AnimatedNumber({
  value,
  format,
  className = "",
  style,
  "aria-label": ariaLabel,
}: AnimatedNumberProps) {
  const [display, setDisplay] = useState(value);
  const fromRef = useRef(value);
  const mounted = useRef(false);

  useEffect(() => {
    const reduced =
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    if (reduced) {
      setDisplay(value);
      fromRef.current = value;
      return;
    }

    const from = mounted.current ? fromRef.current : 0;
    mounted.current = true;
    fromRef.current = value;

    const duration = 900;
    const start = performance.now();
    const ease = (t: number) => 1 - Math.pow(1 - t, 3);

    let raf = 0;
    const tick = (now: number) => {
      const t = Math.min((now - start) / duration, 1);
      setDisplay(Math.round(from + (value - from) * ease(t)));
      if (t < 1) raf = requestAnimationFrame(tick);
    };

    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [value]);

  return (
    <p className={`money ${className}`} style={style} aria-label={ariaLabel}>
      {format(display)}
    </p>
  );
}
