import { useEffect, useRef, useState } from "react";

interface AnimatedNumberProps {
  value: number;
  format: (n: number) => string;
  className?: string;
  "aria-label"?: string;
}

export default function AnimatedNumber({
  value,
  format,
  className = "",
  "aria-label": ariaLabel,
}: AnimatedNumberProps) {
  const [display, setDisplay] = useState(0);
  const fromRef = useRef(0);
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

    const tick = (now: number) => {
      const t = Math.min((now - start) / duration, 1);
      setDisplay(Math.round(from + (value - from) * ease(t)));
      if (t < 1) requestAnimationFrame(tick);
    };

    requestAnimationFrame(tick);
  }, [value]);

  return (
    <p className={`money ${className}`} aria-label={ariaLabel}>
      {format(display)}
    </p>
  );
}
