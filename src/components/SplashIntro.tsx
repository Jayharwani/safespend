import { useEffect, useRef } from "react";
import { motion, useAnimate, stagger } from "framer-motion";
import { ShieldCheck, CurrencyDollar } from "../lib/icons";

const EASE = [0.16, 1, 0.3, 1] as const;
const FALL = [0.4, 0, 0.7, 1] as const; // gravity-ish: accelerates downward

interface SplashIntroProps {
  onDone: () => void;
  mode?: "full" | "short";
}

/**
 * Story splash — no numbers. The metaphor IS the brand name:
 *   money drains toward empty before payday  →  Headroom catches it and
 *   holds a safe gap above zero (that gap = your "headroom").
 * All CSS/SVG + Framer Motion — loads instantly, 60fps, no WebGL.
 */
export default function SplashIntro({ onDone, mode = "full" }: SplashIntroProps) {
  const [scope, animate] = useAnimate();
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
    const wait = (ms: number) => new Promise((r) => setTimeout(r, ms));
    const safety = setTimeout(finish, full ? 12000 : 2800);

    (async () => {
      if (reduced) {
        await animate("#si-capsule", { opacity: 1 }, { duration: 0 });
        await animate("#si-fill", { scaleY: 0.32 }, { duration: 0 });
        await animate("#si-line", { opacity: 1, scaleX: 1 }, { duration: 0 });
        await animate("#si-wordmark", { opacity: 1, y: 0 }, { duration: 0 });
        await animate("#si-tagline", { opacity: 1, y: 0 }, { duration: 0 });
        await wait(1000);
        return finish();
      }

      // ---------- Arrive ----------
      animate("#si-shadow", { scaleX: [0.4, 1], opacity: [0, 1] }, { duration: 1.1, ease: EASE });
      await animate(
        "#si-capsule",
        { y: [-48, 0], scale: [0.9, 1], opacity: [0, 1] },
        { duration: 1.1, ease: EASE }
      );
      // continuous gentle life
      animate("#si-float", { y: [0, -5, 0] }, { duration: 4, ease: "easeInOut", repeat: Infinity });
      // coins settle onto the surface
      animate(
        ".si-coin",
        { y: [-20, 0], opacity: [0, 1] },
        { duration: 0.6, delay: stagger(0.1), ease: EASE }
      );
      animate("#si-cap1", { opacity: [0, 1], y: [8, 0] }, { duration: 0.6, ease: EASE });
      await wait(700);

      // ---------- Drain (the problem) ----------
      // coins lift off, spin and evaporate — money leaving before payday
      animate(
        ".si-coin",
        { y: [0, -16, -108], rotate: [0, 12, 54], opacity: [1, 1, 0], scale: [1, 1.08, 0.68] },
        { duration: 1.7, delay: stagger(0.24), ease: EASE }
      );
      // danger glow rises as it nears empty
      animate("#si-danger", { opacity: [0, 0.85] }, { duration: 1.5, delay: 0.7, ease: EASE });
      // the level falls toward empty
      await animate("#si-fill", { scaleY: [0.86, 0.08] }, { duration: 2.1, ease: FALL });
      await wait(250);

      // ---------- Catch (the solution) ----------
      animate("#si-line", { scaleX: [0, 1], opacity: [0, 1] }, { duration: 0.5, ease: EASE });
      animate("#si-glow", { opacity: [0, 0.5, 0], scale: [0.6, 1.7] }, { duration: 1.2, ease: EASE });
      animate("#si-danger", { opacity: 0 }, { duration: 0.6, ease: EASE });
      animate(
        "#si-shield",
        { opacity: [0, 1], scale: [0.5, 1] },
        { duration: 0.6, ease: [0.34, 1.5, 0.64, 1] }
      );
      // liquid rebounds up onto the line and settles — caught, with room above empty
      await animate("#si-fill", { scaleY: [0.08, 0.34, 0.3] }, { duration: 0.9, ease: EASE });
      animate("#si-cap1", { opacity: 0, y: -6 }, { duration: 0.35, ease: EASE });
      animate("#si-cap2", { opacity: [0, 1], y: [8, 0] }, { duration: 0.6, ease: EASE });
      await wait(1100);

      // ---------- Become the brand ----------
      animate("#si-cap2", { opacity: 0, y: -12 }, { duration: 0.5, ease: EASE });
      animate("#si-shield", { opacity: 0, scale: 0.8 }, { duration: 0.45, ease: EASE });
      animate("#si-shadow", { opacity: 0 }, { duration: 0.5, ease: EASE });
      await animate(
        "#si-capsule",
        { y: -28, scale: 0.84, opacity: 0 },
        { duration: 0.85, ease: EASE }
      );
      await wait(250);
      animate(
        "#si-wordmark",
        { y: [18, 0], opacity: [0, 1], scale: [0.97, 1] },
        { duration: 0.7, ease: EASE }
      );
      await animate("#si-tagline", { y: [8, 0], opacity: [0, 1] }, { duration: 0.6, ease: EASE });

      await wait(1000);
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
      exit={{ opacity: 0, scale: 1.05 }}
      transition={{ duration: 0.5, ease: EASE }}
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
      <div style={{ position: "relative", width: 300, height: 360, perspective: 700 }}>
        {/* glow bloom on the catch */}
        <div
          id="si-glow"
          style={{
            position: "absolute",
            left: "calc(50% - 120px)",
            top: 40,
            width: 240,
            height: 240,
            borderRadius: "50%",
            background:
              "radial-gradient(circle, rgba(20,168,119,0.5) 0%, rgba(20,168,119,0) 62%)",
            opacity: 0,
            pointerEvents: "none",
            willChange: "transform, opacity",
          }}
        />

        {/* contact shadow */}
        <div
          id="si-shadow"
          style={{
            position: "absolute",
            left: "calc(50% - 56px)",
            top: 262,
            width: 112,
            height: 18,
            borderRadius: "50%",
            background: "rgba(16,40,30,0.16)",
            filter: "blur(9px)",
            willChange: "transform, opacity",
          }}
        />

        {/* float wrapper — gentle continuous life */}
        <div
          id="si-float"
          style={{
            position: "absolute",
            left: "calc(50% - 62px)",
            top: 44,
            width: 124,
            height: 212,
            willChange: "transform",
          }}
        >
          {/* the glass capsule */}
          <div
            id="si-capsule"
            style={{
              position: "relative",
              width: 124,
              height: 212,
              borderRadius: 62,
              overflow: "hidden",
              opacity: 0,
              transform: "rotateX(6deg)",
              transformStyle: "preserve-3d",
              background: "linear-gradient(180deg, #FFFFFF 0%, #EDF3F0 100%)",
              border: "1px solid #E2E8E4",
              boxShadow:
                "inset 0 3px 8px rgba(255,255,255,0.9), inset 0 -10px 20px rgba(16,40,30,0.06), 0 16px 34px rgba(16,40,30,0.12)",
              willChange: "transform, opacity",
            }}
          >
            {/* danger zone (rises as money nears empty) */}
            <div
              id="si-danger"
              style={{
                position: "absolute",
                left: 0,
                right: 0,
                bottom: 0,
                height: 64,
                background:
                  "linear-gradient(0deg, rgba(177,74,55,0.45) 0%, rgba(177,74,55,0) 100%)",
                opacity: 0,
                pointerEvents: "none",
              }}
            />

            {/* the liquid (money) */}
            <div
              id="si-fill"
              style={{
                position: "absolute",
                left: 0,
                right: 0,
                bottom: 0,
                height: 212,
                transformOrigin: "bottom",
                transform: "scaleY(0.86)",
                background:
                  "linear-gradient(180deg, #3FD3A2 0%, #14A877 45%, #0A7A52 100%)",
                borderTop: "2px solid rgba(255,255,255,0.55)",
                willChange: "transform",
              }}
            />

            {/* headroom line — catches the fall, holds room above empty */}
            <div
              id="si-line"
              style={{
                position: "absolute",
                left: -6,
                right: -6,
                bottom: 60,
                height: 3,
                background: "var(--accent)",
                boxShadow: "0 0 12px rgba(14,158,107,0.9)",
                transform: "scaleX(0)",
                opacity: 0,
                willChange: "transform, opacity",
              }}
            />

            {/* glass rim highlight */}
            <div
              style={{
                position: "absolute",
                inset: 0,
                borderRadius: 62,
                background:
                  "linear-gradient(150deg, rgba(255,255,255,0.7) 0%, rgba(255,255,255,0) 38%)",
                pointerEvents: "none",
              }}
            />
          </div>
        </div>

        {/* "in check" shield, pops in on the catch (sits over the line) */}
        {showStory && (
          <div
            id="si-shield"
            style={{
              position: "absolute",
              left: "calc(50% - 18px)",
              top: 190,
              width: 36,
              height: 36,
              borderRadius: 999,
              background: "var(--surface)",
              border: "1px solid var(--accent-line)",
              boxShadow: "0 6px 16px rgba(14,158,107,0.25)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "var(--accent-deep)",
              opacity: 0,
              willChange: "transform, opacity",
            }}
          >
            <ShieldCheck size={20} weight="fill" />
          </div>
        )}

        {/* gold coins — your money — that spin off and evaporate as it drains */}
        {showStory &&
          [
            { left: "calc(50% - 36px)", top: 64 },
            { left: "calc(50% - 4px)", top: 54 },
            { left: "calc(50% + 18px)", top: 72 },
            { left: "calc(50% - 16px)", top: 90 },
          ].map((c, i) => (
            <div
              key={i}
              className="si-coin"
              style={{
                position: "absolute",
                left: c.left,
                top: c.top,
                width: 36,
                height: 36,
                borderRadius: "50%",
                background:
                  "radial-gradient(circle at 36% 30%, #FCE9B3 0%, #EDC662 46%, #C99A33 100%)",
                boxShadow:
                  "inset -3px -3px 6px rgba(120,80,10,0.35), inset 2px 2px 5px rgba(255,255,255,0.7), 0 5px 12px rgba(16,40,30,0.22)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "#9A6B12",
                opacity: 0,
                willChange: "transform, opacity",
              }}
            >
              <CurrencyDollar size={20} weight="bold" />
            </div>
          ))}

        {/* captions */}
        {showStory && (
          <div style={{ position: "absolute", left: 0, right: 0, top: 288, height: 22 }}>
            <div
              id="si-cap1"
              style={{
                position: "absolute",
                inset: 0,
                textAlign: "center",
                fontSize: 15,
                fontWeight: 500,
                color: "var(--ink-soft)",
                opacity: 0,
                willChange: "transform, opacity",
              }}
            >
              Spent before payday.
            </div>
            <div
              id="si-cap2"
              style={{
                position: "absolute",
                inset: 0,
                textAlign: "center",
                fontSize: 15,
                fontWeight: 600,
                color: "var(--accent-deep)",
                opacity: 0,
                willChange: "transform, opacity",
              }}
            >
              Headroom keeps you in check.
            </div>
          </div>
        )}

        {/* brand lockup */}
        <div
          id="si-wordmark"
          className="wordmark"
          style={{
            position: "absolute",
            left: 0,
            right: 0,
            top: 140,
            textAlign: "center",
            fontSize: 36,
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
            top: 188,
            textAlign: "center",
            fontSize: 15,
            color: "var(--ink-soft)",
            opacity: 0,
            willChange: "transform, opacity",
          }}
        >
          Know what's safe to spend.
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
