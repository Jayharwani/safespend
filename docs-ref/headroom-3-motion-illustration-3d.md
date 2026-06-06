# Headroom — Motion, Illustration & 3D (File 3 of 3)

How the app moves, what it's illustrated with, and the depth/3D effects that make it feel premium. Uses tokens from **File 1 — UI** and screens from **File 2 — Screens**. Code is given as Framer Motion (React, for Cursor) with CSS/JS fallbacks.

---

## 1. Motion principles

Apple/Google-grade motion is **purposeful, continuous, and calm**:

1. **Motion explains, never decorates.** Every animation shows hierarchy (what's important), continuity (where things came from / went), or feedback (your tap registered).
2. **Calm = slow + soft.** Durations sit in 400–700ms; easing decelerates gently. Nothing snappy, nothing bouncy-hard.
3. **One thing moves at a time.** Stagger entrances; never animate ten things at once.
4. **Continuity over cuts.** Screens push and share elements; sheets rise; the number morphs. Avoid hard jump-cuts.
5. **Reduced-motion is a first-class path**, not an afterthought — every effect below has a static fallback.

---

## 2. Motion tokens

```css
:root{
  --ease-out: cubic-bezier(0.16, 1, 0.3, 1);   /* signature soft decelerate */
  --ease-soft: cubic-bezier(0.4, 0, 0.2, 1);
  --ease-in-out: cubic-bezier(0.65, 0, 0.35, 1);
  --d-fast: 220ms; --d-base: 420ms; --d-slow: 700ms;
}
@keyframes rise   { from{opacity:0; transform:translateY(16px);} to{opacity:1; transform:translateY(0);} }
@keyframes breathe{ 0%,100%{transform:scale(1); opacity:.9;} 50%{transform:scale(1.06); opacity:1;} }
@keyframes shimmer{ from{background-position:-160% 0;} to{background-position:160% 0;} }
@media (prefers-reduced-motion: reduce){ *{ animation:none !important; transition:none !important; } }
```

Framer Motion equivalents:
```js
export const easeOut = [0.16, 1, 0.3, 1];
export const spring = { type: "spring", stiffness: 240, damping: 28, mass: 0.9 }; // soft, no overshoot bounce
export const dur = { fast: 0.22, base: 0.42, slow: 0.7 };
```

---

## 3. Tooling

- **Framer Motion** — primary for React (transitions, gestures, layout, spring). `npm i framer-motion`.
- **CSS keyframes/transitions** — fallback / non-React.
- **Lottie** (`lottie-react`) — vector illustrations that animate (onboarding, empty states, payday). Source from LottieFiles; recolor to tokens.
- **Rive** (`@rive-app/react-canvas`) — when an illustration needs to react to state (optional, advanced).
- **Spline** (`@splinetool/react-spline`) — one optional lightweight 3D hero object.
- **canvas-confetti** — the payday burst.

Keep the bundle calm too: Lottie/Spline only where they earn their weight; lazy-load 3D.

---

## 4. Core animation patterns (paste-ready)

### 4.1 Screen transitions (push + fade-through)
Wrap routed screens; new screen slides in from the right, old fades back.
```jsx
import { motion, AnimatePresence } from "framer-motion";
const variants = {
  initial: { opacity: 0, x: 24 },
  enter:   { opacity: 1, x: 0,  transition: { duration: 0.42, ease: [0.16,1,0.3,1] } },
  exit:    { opacity: 0, x: -16, transition: { duration: 0.22 } },
};
<AnimatePresence mode="wait">
  <motion.div key={route} variants={variants} initial="initial" animate="enter" exit="exit">
    {screen}
  </motion.div>
</AnimatePresence>
```

### 4.2 Staggered entrance (the 80%-of-the-wow effect)
Every top-level block on a screen rises in, 70ms apart.
```jsx
const list = { animate: { transition: { staggerChildren: 0.07 } } };
const item = { initial:{opacity:0,y:16}, animate:{opacity:1,y:0,transition:{duration:0.42,ease:[0.16,1,0.3,1]}} };
<motion.div variants={list} initial="initial" animate="animate">
  <motion.header variants={item}/> <motion.section variants={item}/> ...
</motion.div>
```
CSS fallback: `animation: rise var(--d-base) var(--ease-out) both;` with `animation-delay` 0/70/140/210ms.

### 4.3 Count-up hero number
```jsx
import { animate } from "framer-motion";
import { useEffect, useRef } from "react";
function CountUp({ value }){
  const ref = useRef(null);
  useEffect(() => {
    const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce){ ref.current.textContent = "$"+value.toLocaleString(); return; }
    const c = animate(0, value, { duration: 0.9, ease: [0.16,1,0.3,1],
      onUpdate: v => ref.current.textContent = "$"+Math.round(v).toLocaleString() });
    return () => c.stop();
  }, [value]);
  return <span ref={ref} className="num money">$0</span>;
}
```

### 4.4 Self-drawing balance curve
```jsx
<motion.path d={linePath} fill="none" stroke="var(--brand)" strokeWidth="2.5" strokeLinecap="round"
  initial={{ pathLength: 0 }} animate={{ pathLength: 1 }}
  transition={{ duration: 1.4, ease: [0.16,1,0.3,1] }} />
<motion.path d={areaPath} fill="url(#fill)"
  initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.9, delay: 0.5 }} />
```
Vanilla fallback: set `strokeDasharray = pathLength`, animate `strokeDashoffset` from len→0 with a CSS transition.

### 4.5 Bottom sheet (slide + drag-to-dismiss + backdrop)
```jsx
<motion.div className="sheet-backdrop" initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}} onClick={close}/>
<motion.div className="sheet" drag="y" dragConstraints={{ top:0 }} dragElastic={0.2}
  onDragEnd={(e,i)=> i.offset.y>120 && close()}
  initial={{ y:"100%" }} animate={{ y:0 }} exit={{ y:"100%" }}
  transition={{ type:"spring", stiffness:240, damping:28 }}>
  <div className="grab"/> {sheetContent}
</motion.div>
```

### 4.6 Press feedback (universal)
Framer: wrap interactive elements in `<motion.button whileTap={{ scale: 0.97 }} transition={{duration:0.12}}>`. CSS: `button:active{ transform:scale(.97); }`.

### 4.7 Tab switch micro-animation
Active tab's icon does a tiny lift; the active color crossfades.
```jsx
<motion.i animate={{ y: active ? -2 : 0, scale: active ? 1.05 : 1 }} transition={{type:"spring",stiffness:300,damping:20}}/>
```
Optional shared "pill" highlight that slides between tabs via `layoutId="tab-pill"`.

### 4.8 List add / remove + swipe-to-delete
Use Framer `layout` + `AnimatePresence` so rows animate when added/removed:
```jsx
<AnimatePresence>
  {bills.map(b => (
    <motion.div key={b.id} layout
      initial={{opacity:0,height:0}} animate={{opacity:1,height:"auto"}} exit={{opacity:0,height:0}}
      drag="x" dragConstraints={{left:0,right:0}} onDragEnd={(e,i)=> i.offset.x < -80 && remove(b.id)}>
      {row}
    </motion.div>
  ))}
</AnimatePresence>
```

### 4.9 State crossfade (Healthy → Tight → Over)
Animate the hero number color and chip when state changes:
```jsx
<motion.span animate={{ color: stateColor }} transition={{ duration: 0.5 }} className="num money">{...}</motion.span>
```
Recolor the chart line in the same 500ms. Keep entrance motion identical across states — calm consistency.

### 4.10 Skeleton shimmer (loading)
```css
.skeleton{ border-radius:16px; background:linear-gradient(90deg,var(--hairline) 25%,#F3F6F2 37%,var(--hairline) 63%);
  background-size:300% 100%; animation:shimmer 1.4s ease infinite; }
```
Show skeleton hero + cards while data loads; never block on a spinner if a skeleton fits.

### 4.11 Success check draw
On save / all-set, draw a check stroke:
```jsx
<motion.path d="M5 13l4 4L19 7" fill="none" stroke="var(--brand)" strokeWidth="3" strokeLinecap="round"
  initial={{ pathLength:0 }} animate={{ pathLength:1 }} transition={{ duration:0.5, ease:[0.16,1,0.3,1] }} />
```

### 4.12 Toast slide-in
`initial={{y:20,opacity:0}} animate={{y:0,opacity:1}} exit={{y:20,opacity:0}}`, auto-dismiss ~2.5s.

---

## 5. Signature delight moments

### 5.1 Payday moment
Soft confetti in brand tints + number count-up from 0 + a gentle scale-spring on the card.
```jsx
import confetti from "canvas-confetti";
useEffect(() => {
  if (matchMedia("(prefers-reduced-motion: reduce)").matches) return;
  confetti({ particleCount: 70, spread: 60, startVelocity: 28, scalar: 0.9, ticks: 160,
    origin: { y: 0.35 }, colors: ["#2E9E78","#5FC49C","#E3F1EA","#B07A1E"] });
}, []);
```
Keep it short and soft — calm celebration, not a party.

### 5.2 The breathing low-point dot
The chart's lowest-point dot pulses gently (one living detail, never more):
```css
#lowdot{ transform-box:fill-box; transform-origin:center; animation:breathe 3s var(--ease-soft) infinite; }
```

### 5.3 Haptics (where supported)
On key taps (save, payday): `navigator.vibrate?.(8)` on Android web; on iOS use Capacitor Haptics if you wrap as a native shell. Subtle only.

---

## 6. 3D & depth effects (use sparingly)

Premium depth, not gimmick. One or two of these, max.

### 6.1 Subtle card tilt (parallax on press / pointer)
A gentle 3D tilt toward the cursor/touch gives the hero card life.
```jsx
import { useMotionValue, useTransform, motion } from "framer-motion";
function TiltCard({ children }){
  const x = useMotionValue(0), y = useMotionValue(0);
  const rx = useTransform(y, [-40,40], [6,-6]);   // small angles only
  const ry = useTransform(x, [-40,40], [-6,6]);
  return (
    <motion.div style={{ rotateX:rx, rotateY:ry, transformPerspective:800 }}
      onPointerMove={e=>{ const r=e.currentTarget.getBoundingClientRect();
        x.set(e.clientX-r.left-r.width/2); y.set(e.clientY-r.top-r.height/2); }}
      onPointerLeave={()=>{ x.set(0); y.set(0); }}>
      {children}
    </motion.div>
  );
}
```
Keep max tilt ≤6°. Disable under reduced-motion.

### 6.2 Scroll parallax / layered depth
Background hero gradient and the number move at slightly different rates on scroll for depth:
```jsx
const { scrollY } = useScroll();
const yBg = useTransform(scrollY, [0,200], [0,-30]);
const yNum = useTransform(scrollY, [0,200], [0,-10]);
```

### 6.3 Optional Spline 3D hero object
A single calm floating object (a soft coin/orb in sage) on Splash, All-set, or Payday — never on Today (keep the number king).
```jsx
import Spline from "@splinetool/react-spline";
<Spline scene="https://prod.spline.design/your-scene/scene.splinecode" />
```
**Honest caveats:** 3D adds bundle weight and battery cost. Lazy-load it, cap it to one screen, provide a static image fallback, and skip it entirely under reduced-motion or on low-end devices. It's a nice-to-have, not a requirement — the typography + motion already read as premium without it.

### 6.4 Soft "glass" (one place only)
A single frosted layer (e.g. the tab bar over scrolling content) can add depth:
```css
.tabbar{ background:rgba(251,252,250,.8); backdrop-filter:saturate(180%) blur(20px); }
```
Use once. Overusing blur reads as dated and hurts performance.

---

## 7. Illustration system

### 7.1 Style direction
Minimal **line + soft sage fills**, rounded forms, consistent ~2px stroke, calm and friendly. No detailed scenes, no gradients beyond a faint one, no hard outlines on everything. They should feel like quiet extensions of the UI, not stickers.

### 7.2 Where illustrations appear
- Onboarding (3) — one calm scene per idea (a balance/scale, a calendar, a shield/heads-up).
- Permissions — a gentle bell/heads-up motif.
- Empty states (per tab) — one simple object + lots of space.
- All-set & Payday — a celebratory but soft motif (check, sun, confetti).

### 7.3 How to produce them
- **Animated:** grab Lottie files from LottieFiles in a minimal-line style, then recolor strokes/fills to the tokens (`--brand`, `--brand-deep`, `--ink`). Render with `lottie-react`; pause under reduced-motion.
- **Static:** commission or AI-generate flat SVGs; constrain the palette to tokens; export as optimized SVG. Keep a consistent stroke width and corner radius across the set so they feel like one family.
- Keep file sizes small; a heavy illustration on launch defeats the calm.

### 7.4 Icons
Lucide outline (see File 1 §8). Don't mix icon families — one set, one weight.

---

## 8. Imagery & photography

Money apps look most trustworthy with **little to no photography**. Prefer illustration and abstract surfaces. If you ever need imagery:
- Use soft abstract gradients/textures in the sage family, not stock photos of people with coffee.
- If a photo is unavoidable, apply a muted brand duotone and keep it behind generous overlay so text stays legible.
- Never let imagery compete with the hero number.

---

## 9. Performance & accessibility for motion

- Animate **only `transform` and `opacity`** (and SVG `pathLength`). Avoid animating layout properties except via Framer `layout`.
- Use `will-change` sparingly and remove it after.
- Target 60fps; keep simultaneous animations few.
- **Every effect needs a reduced-motion fallback:** count-up → final value; curve → drawn instantly; confetti → skipped; tilt/parallax → off; shimmer → static. Gate with `prefers-reduced-motion`.
- Lazy-load Lottie/Spline; don't autoplay heavy 3D on first paint.
- Respect battery/low-power: prefer CSS for always-on loops (the breathing dot) over JS.

---

## 10. Cursor prompts for the motion layer (in order)

1. "Install framer-motion. Add the motion tokens (§2) and keyframes to globals."
2. "Wrap routed screens in the AnimatePresence push transition from §4.1."
3. "Give every screen's top-level blocks the staggered entrance from §4.2."
4. "Add the CountUp component (§4.3) to the hero number and the self-drawing balance curve (§4.4)."
5. "Convert modals to the drag-dismissible bottom sheet in §4.5; add whileTap scale to all buttons (§4.6)."
6. "Add list add/remove + swipe-to-delete (§4.8) and the state color crossfade (§4.9)."
7. "Add skeleton shimmer loading (§4.10), the success check draw (§4.11), and toasts (§4.12)."
8. "Build the Payday moment with canvas-confetti + count-up (§5.1) and the breathing low-point dot (§5.2)."
9. "Add the subtle 6° tilt to the hero card (§6.1). Keep 3D/Spline optional and lazy-loaded (§6.3)."
10. "Add reduced-motion fallbacks for every animation per §9."
```
