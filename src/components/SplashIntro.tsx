import { useEffect, useRef } from "react";
import { motion, useAnimate, stagger } from "framer-motion";

const EASE = [0.16, 1, 0.3, 1] as const;

interface SplashIntroProps {
  onDone: () => void;
  mode?: "full" | "short";
}

/* The emerald sphere — same matte recipe as FloatingOrb, fully CSS so it
   loads instantly and stays crisp at any size (no PNG / WebGL). */
function Sphere() {
  return (
    <>
      {/* contact shadow */}
      <div
        id="si-shadow"
        style={{
          position: "absolute",
          left: "calc(50% - 58px)",
          top: 182,
          width: 116,
          height: 20,
          borderRadius: "50%",
          background: "rgba(16, 40, 30, 0.18)",
          filter: "blur(9px)",
          transformOrigin: "center",
          willChange: "transform, opacity",
        }}
      />
      {/* sphere */}
      <div
        id="si-sphere"
        style={{
          position: "absolute",
          left: "calc(50% - 75px)",
          top: 34,
          width: 150,
          height: 150,
          borderRadius: "50%",
          background:
            "radial-gradient(circle at 33% 28%, #5BD3A0 0%, #14A877 42%, #0A5C3E 100%)",
          boxShadow:
            "inset -18px -20px 38px rgba(0,0,0,0.32), inset 8px 8px 22px rgba(255,255,255,0.4)",
          opacity: 0,
          willChange: "transform, opacity",
        }}
      >
        {/* specular highlight */}
        <div
          style={{
            position: "absolute",
            top: 22,
            left: 32,
            width: 40,
            height: 28,
            borderRadius: "50%",
            background:
              "radial-gradient(ellipse, rgba(255,255,255,0.85) 0%, rgba(255,255,255,0) 70%)",
            filter: "blur(3px)",
          }}
        />
      </div>
    </>
  );
}

export default function SplashIntro({ onDone, mode = "full" }: SplashIntroProps) {
  const [scope, animate] = useAnimate();
  const amountRef = useRef<HTMLDivElement>(null);
  const done = useRef(false);

  const finish = () => {
    if (!done.current) {
      done.current = true;
      onDone();
    }
  };

  useEffect(() => {
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const full = mode === "full" && !reduced;

    const countDown = (from: number, to: number, ms: number) =>
      new Promise<void>((res) => {
        const el = amountRef.current;
        if (!el) return res();
        const start = performance.now();
        const ease = (t: number) => 1 - Math.pow(1 - t, 3);
        const tick = (now: number) => {
          const p = Math.min((now - start) / ms, 1);
          el.textContent = "$" + Math.round(from + (to - from) * ease(p)).toLocaleString();
          if (p < 1) requestAnimationFrame(tick);
          else res();
        };
        requestAnimationFrame(tick);
      });

    const wait = (ms: number) => new Promise((r) => setTimeout(r, ms));

    // Safety net: never trap the user on the splash if an animation stalls.
    const safety = setTimeout(finish, full ? 7000 : 2500);

    (async () => {
      if (reduced) {
        // Static brand lockup, brief hold, then go.
        await animate("#si-sphere", { opacity: 1 }, { duration: 0 });
        await animate("#si-shadow", { opacity: 1 }, { duration: 0 });
        await animate("#si-wordmark", { opacity: 1, y: 0 }, { duration: 0 });
        await animate("#si-tagline", { opacity: 1 }, { duration: 0 });
        await wait(1000);
        return finish();
      }

      if (!full) {
        // Short cold-start: sphere arrives, brand appears (~1.2s).
        animate("#si-shadow", { scaleX: [0.5, 1], opacity: [0, 1] }, { duration: 0.7, ease: EASE });
        await animate(
          "#si-sphere",
          { y: [-90, 0], scale: [0.9, 1], opacity: [0, 1] },
          { duration: 0.7, ease: EASE }
        );
        animate("#si-wordmark", { y: [12, 0], opacity: [0, 1] }, { duration: 0.4, ease: EASE });
        await animate("#si-tagline", { opacity: [0, 1] }, { duration: 0.35, ease: EASE });
        await wait(250);
        return finish();
      }

      // ---- Full story ----
      // Arrive
      animate("#si-shadow", { scaleX: [0.45, 1], opacity: [0, 1] }, { duration: 0.8, ease: EASE });
      await animate(
        "#si-sphere",
        { y: [-130, 0], scale: [0.85, 1], opacity: [0, 1] },
        { duration: 0.8, ease: EASE }
      );

      // Your balance
      await animate("#si-amount", { y: [16, 0], opacity: [0, 1] }, { duration: 0.5, ease: EASE });

      // Subtract what's coming: chips fly off + count down
      animate(
        ".si-chip",
        { x: [0, 86], y: [0, -40], opacity: [1, 0], scale: [1, 0.9] },
        { duration: 0.7, delay: stagger(0.09), ease: EASE }
      );
      await countDown(1200, 885, 1000);

      // What's actually yours: crossfade label, gentle pulse
      animate("#si-label", { opacity: 0, y: -6 }, { duration: 0.25, ease: EASE });
      animate("#si-label2", { opacity: 1, y: [6, 0] }, { duration: 0.35, ease: EASE });
      await animate("#si-sphere", { scale: [1, 1.07, 1] }, { duration: 0.6, ease: EASE });

      // Become the brand
      animate("#si-amount", { opacity: 0, y: -16 }, { duration: 0.4, ease: EASE });
      animate("#si-label2", { opacity: 0, y: -16 }, { duration: 0.4, ease: EASE });
      await wait(220);
      // sphere rises + shrinks; shadow grows + lightens (object lifts off ground)
      animate("#si-shadow", { scaleX: 1.18, opacity: 0.4 }, { duration: 0.55, ease: EASE });
      await animate("#si-sphere", { y: -46, scale: 0.74 }, { duration: 0.55, ease: EASE });

      // Brand
      animate("#si-wordmark", { y: [14, 0], opacity: [0, 1] }, { duration: 0.5, ease: EASE });
      await animate("#si-tagline", { opacity: [0, 1] }, { duration: 0.4, ease: EASE });

      await wait(550);
      finish();
    })();

    return () => clearTimeout(safety);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mode]);

  const showStory = mode === "full" && !window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  return (
    <motion.div
      ref={scope}
      onClick={finish}
      exit={{ opacity: 0, scale: 1.04 }}
      transition={{ duration: 0.45, ease: EASE }}
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 200,
        background: "var(--bg)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        overflow: "hidden",
        paddingTop: "env(safe-area-inset-top)",
        cursor: "pointer",
      }}
    >
      <div style={{ position: "relative", width: 300, height: 340 }}>
        <Sphere />

        {showStory && (
          <>
            {/* bill chips that peel off the number */}
            {[
              { label: "Rent", left: "calc(50% - 78px)", top: 196 },
              { label: "Phone", left: "calc(50% + 10px)", top: 188 },
              { label: "Car", left: "calc(50% + 30px)", top: 214 },
            ].map((c) => (
              <span
                key={c.label}
                className="si-chip"
                style={{
                  position: "absolute",
                  left: c.left,
                  top: c.top,
                  padding: "4px 11px",
                  borderRadius: 999,
                  background: "var(--accent-soft)",
                  color: "var(--accent-deep)",
                  fontSize: 12,
                  fontWeight: 600,
                  whiteSpace: "nowrap",
                  willChange: "transform, opacity",
                }}
              >
                {c.label}
              </span>
            ))}

            {/* amount */}
            <div
              id="si-amount"
              ref={amountRef}
              className="money"
              style={{
                position: "absolute",
                left: 0,
                right: 0,
                top: 206,
                textAlign: "center",
                fontSize: 42,
                fontWeight: 600,
                letterSpacing: "-0.03em",
                color: "var(--ink)",
                opacity: 0,
                willChange: "transform, opacity",
              }}
            >
              $1,200
            </div>

            {/* label crossfade */}
            <div style={{ position: "absolute", left: 0, right: 0, top: 258, height: 18 }}>
              <div
                id="si-label"
                style={{
                  position: "absolute",
                  inset: 0,
                  textAlign: "center",
                  fontSize: 13,
                  color: "var(--ink-soft)",
                  willChange: "transform, opacity",
                }}
              >
                your balance
              </div>
              <div
                id="si-label2"
                style={{
                  position: "absolute",
                  inset: 0,
                  textAlign: "center",
                  fontSize: 13,
                  fontWeight: 600,
                  color: "var(--accent-deep)",
                  opacity: 0,
                  willChange: "transform, opacity",
                }}
              >
                safe to spend
              </div>
            </div>
          </>
        )}

        {/* brand lockup (fades in at the end / shown in short + reduced) */}
        <div
          id="si-wordmark"
          className="wordmark"
          style={{
            position: "absolute",
            left: 0,
            right: 0,
            top: 206,
            textAlign: "center",
            fontSize: 34,
            opacity: 0,
            willChange: "transform, opacity",
          }}
        >
          Headroom
        </div>
        <div
          id="si-tagline"
          style={{
            position: "absolute",
            left: 0,
            right: 0,
            top: 252,
            textAlign: "center",
            fontSize: 15,
            color: "var(--ink-soft)",
            opacity: 0,
            willChange: "opacity",
          }}
        >
          What you can actually spend.
        </div>
      </div>

      <button
        type="button"
        onClick={(e) => {
          e.stopPropagation();
          finish();
        }}
        aria-label="Skip intro"
        style={{
          position: "absolute",
          top: "calc(env(safe-area-inset-top) + 16px)",
          right: 20,
          background: "none",
          border: "none",
          color: "var(--ink-faint)",
          fontSize: 15,
          fontWeight: 600,
          padding: 8,
        }}
      >
        Skip
      </button>
    </motion.div>
  );
}
