# Headroom — UI System (File 1 of 3)

The complete visual language and component library. Apple/Google-level: minimal, clean, type-led, deeply considered. Hand this to Cursor as the source of truth for how everything looks.

> Companion files: **File 2 — Screens** (what to build) and **File 3 — Motion & Visuals** (how it moves). All three share the tokens below.
>
> *Working name "Headroom" — rename freely.*

---

## 1. Design principles

Borrowed from Apple HIG (clarity, deference, depth) and Material (restraint, intentionality), tuned for a money app:

1. **Clarity.** One number answers one question. Type and space do the work; nothing decorative competes with content.
2. **Deference.** The UI gets out of the way. Calm neutrals, one accent, no chrome for chrome's sake.
3. **Depth.** Soft layered surfaces and gentle shadows create a sense of physical hierarchy — not flatness, not skeuomorphism.
4. **Calm, never alarming.** Even bad news is delivered gently. No bright alarm-red, no shame.
5. **Forgiving.** No streaks to break, no failure states. A bad month is just a number.

**What "minimal" means here:** remove elements until something breaks, then add the last one back. Generous whitespace. One confident hero element per screen. A single accent color. If you're choosing between two ways to show something, choose the quieter one.

---

## 2. Color

Warm, low-saturation sage-and-cream. Never pure black or white. The over-budget color is a soft clay, not fire-engine red — that softness *is* the brand.

```css
:root{
  /* Surfaces — layered, warm */
  --canvas:        #EEF1EC;
  --surface:       #FBFCFA;
  --surface-raised:#FFFFFF;

  /* Brand — calm sage */
  --brand:         #2E9E78;
  --brand-deep:    #1C6F53;
  --brand-soft:    #E3F1EA;

  /* Money states (calm) */
  --safe:#1C6F53; --tight:#B07A1E; --over:#C25B47;
  --safe-bg:#E3F1EA; --tight-bg:#F6EDD8; --over-bg:#F6E4DE;

  /* Text — warm near-black */
  --ink:#19241F; --ink-soft:#5E6A63; --ink-faint:#97A19A;

  /* Lines */
  --hairline:#E2E7E1;

  /* Depth */
  --shadow-sm: 0 1px 2px rgba(25,45,35,.05), 0 2px 6px rgba(25,45,35,.04);
  --shadow-md: 0 4px 14px rgba(25,45,35,.07), 0 10px 30px rgba(25,45,35,.05);
  --shadow-lg: 0 12px 34px rgba(25,45,35,.12);

  /* The single permitted gradient (hero surface only) */
  --hero-grad: linear-gradient(158deg, #EAF5EF 0%, #FBFCFA 62%);
}

@media (prefers-color-scheme: dark){
  :root{
    --canvas:#10140F; --surface:#1A201A; --surface-raised:#1F261F;
    --brand:#5FC49C; --brand-deep:#3FA77F; --brand-soft:rgba(95,196,156,.14);
    --safe:#5FC49C; --tight:#E0AE5C; --over:#E08A75;
    --safe-bg:rgba(95,196,156,.14); --tight-bg:rgba(224,174,92,.14); --over-bg:rgba(224,138,117,.14);
    --ink:#EDF1EC; --ink-soft:#9AA59D; --ink-faint:#6B756E; --hairline:rgba(255,255,255,.08);
    --hero-grad: linear-gradient(158deg, #1E2A22 0%, #1A201A 62%);
  }
}
```

**Rules:** never `#000`/`#FFF` for text. All money uses `font-variant-numeric: tabular-nums`. Exactly one accent (sage). State is never communicated by color alone — always color + word + icon.

---

## 3. Typography

```css
:root{ --font: -apple-system, BlinkMacSystemFont, "SF Pro Text", "Inter", system-ui, sans-serif; }
```

(Optionally load Inter from Google Fonts for cross-device consistency.)

```
Hero number   64 / 1.0  / 600 / tabular-nums / -1.5px
Large title   30 / 1.15 / 600 / -0.5px
Title         22 / 1.25 / 600
Headline      17 / 1.3  / 600
Body          17 / 1.45 / 400
Label         14 / 1.3  / 500 / +0.2px
Footnote      13 / 1.4  / 400
Caption       12 / 1.3  / 400
```

Two weights only: 400 and 600. Body is 17px (native base, not 16). The hero number dominates every screen it appears on.

---

## 4. Spacing, sizing, radius, depth

```
Spacing scale (px): 2 · 4 · 8 · 12 · 14 · 16 · 20 · 24 · 28 · 32 · 40 · 48 · 64
Screen edge padding: 24      Section gap: 28      Card padding: 22      Item gap: 14

Touch target min: 44×44
Button height: 54      Input height: 54      List row: 60
Tab bar: 58 + safe-area      Nav bar: 44 + safe-area

Radius: chip 12 · input 16 · button 16 · card 24 · sheet-top 28 · pill 999

Elevation: canvas flat · rows flat+hairline · cards shadow-sm · hero shadow-md+gradient · sheet shadow-lg
```

The depth trick: cards (`--surface`) sit on a slightly darker `--canvas` with a soft shadow. That small contrast + shadow is what reads as "layered and premium" instead of flat.

---

## 5. The mobile shell (makes it feel native, not web)

```css
.shell{
  max-width:430px; margin:0 auto; min-height:100dvh;
  background:var(--canvas); color:var(--ink); font-family:var(--font);
  font-size:17px; line-height:1.45; position:relative; overflow-x:hidden;
  padding-top:env(safe-area-inset-top);
}
.money{ font-variant-numeric:tabular-nums; letter-spacing:-.3px; }
button{ font-family:inherit; cursor:pointer; }
button:active{ transform:scale(.97); transition:transform 220ms cubic-bezier(.4,0,.2,1); }
```

Non-negotiables for the native feel: 430px centered column, bottom tab bar, bottom-anchored primary actions, 17px body, 44px+ targets, `:active` press (never `:hover`), `env(safe-area-inset-*)` padding, bottom sheets instead of centered modals.

---

## 6. Component library

Anatomy + paste-ready CSS for each. Build once, reuse everywhere.

### Nav bar (top)
Centered Title, optional left chevron (back) and right action. 44px + safe area. Bottom hairline appears only on scroll.
```css
.navbar{ display:flex; align-items:center; justify-content:space-between; height:44px; padding:0 24px; }
.navbar h1{ font-size:17px; font-weight:600; }
```

### Tab bar (bottom) — the biggest "app feel" win
```css
.tabbar{ position:sticky; bottom:0; max-width:430px; margin:0 auto; display:flex;
  height:calc(58px + env(safe-area-inset-bottom)); background:var(--surface-raised);
  border-top:1px solid var(--hairline); padding-bottom:env(safe-area-inset-bottom); }
.tab{ flex:1; border:none; background:none; display:flex; flex-direction:column;
  align-items:center; justify-content:center; gap:3px; font-size:12px; color:var(--ink-faint); }
.tab.active{ color:var(--brand); }
.tab i{ width:24px; height:24px; }
```

### Buttons
```css
.btn-primary{ width:100%; height:54px; border:none; border-radius:16px; background:var(--brand);
  color:#fff; font-size:17px; font-weight:600; box-shadow:var(--shadow-sm);
  display:flex; align-items:center; justify-content:center; gap:8px; }
.btn-secondary{ width:100%; height:54px; border:none; border-radius:16px;
  background:var(--brand-soft); color:var(--brand-deep); font-size:17px; font-weight:600; }
.btn-text{ background:none; border:none; color:var(--brand); font-size:17px; font-weight:600; }
.icon-btn{ width:40px; height:40px; border-radius:999px; border:none; background:var(--surface);
  box-shadow:var(--shadow-sm); color:var(--ink-soft); display:flex; align-items:center; justify-content:center; }
```

### Input field & amount input
```css
.field{ display:flex; flex-direction:column; gap:8px; }
.field label{ font-size:14px; font-weight:500; color:var(--ink-soft); }
.field input{ height:54px; border-radius:16px; border:1px solid var(--hairline);
  background:var(--surface); padding:0 16px; font-size:17px; font-family:inherit; color:var(--ink); }
.field input:focus{ outline:none; border-color:var(--brand); box-shadow:0 0 0 3px rgba(46,158,120,.18); }
.amount-input{ font-size:30px; font-weight:600; text-align:center; letter-spacing:-.5px;
  font-variant-numeric:tabular-nums; }   /* use inputmode="decimal" */
```

### Segmented control (e.g. pay frequency)
```css
.segmented{ display:flex; background:var(--canvas); border-radius:14px; padding:4px; gap:4px; }
.segmented button{ flex:1; height:40px; border:none; border-radius:10px; background:none;
  font-size:15px; font-weight:500; color:var(--ink-soft); }
.segmented button[aria-selected="true"]{ background:var(--surface-raised); color:var(--ink); box-shadow:var(--shadow-sm); }
```

### Toggle
A standard switch; on = `--brand`. 51×31 track, 27px knob, 200ms slide.

### List row + section
```css
.section-header{ font-size:14px; font-weight:500; color:var(--ink-soft); padding:18px 22px 4px; }
.row{ display:flex; align-items:center; gap:14px; padding:14px 22px; border-top:1px solid var(--hairline); }
.row:first-of-type{ border-top:none; }
.row .main{ flex:1; } .row .main p:first-child{ font-size:17px; }
.row .main .sub{ font-size:13px; color:var(--ink-soft); }
.row .amt{ font-weight:600; font-variant-numeric:tabular-nums; }
.chip-ico{ width:38px; height:38px; border-radius:999px; background:var(--brand-soft);
  color:var(--brand-deep); display:flex; align-items:center; justify-content:center; }
.chip-ico i{ width:19px; height:19px; }
```

### Card
```css
.card{ background:var(--surface); border-radius:24px; box-shadow:var(--shadow-sm); padding:22px; }
```

### Hero block (the centerpiece)
```css
.hero{ background:var(--hero-grad); box-shadow:var(--shadow-md); border-radius:24px; padding:28px 22px; }
.hero .label{ font-size:14px; font-weight:500; color:var(--ink-soft); }
.hero .num{ font-size:64px; font-weight:600; line-height:1; letter-spacing:-1.5px;
  color:var(--safe); font-variant-numeric:tabular-nums; margin:8px 0 6px; }
.hero .sub{ font-size:13px; color:var(--ink-soft); }
```

### State chip
```css
.chip{ display:inline-flex; align-items:center; gap:6px; margin-top:14px;
  background:var(--safe-bg); color:var(--safe); font-size:13px; font-weight:500;
  padding:6px 12px; border-radius:999px; }
.chip i{ width:15px; height:15px; }
```

### Bottom sheet
```css
.sheet-backdrop{ position:absolute; inset:0; background:rgba(20,30,24,.45); }
.sheet{ position:absolute; left:0; right:0; bottom:0; background:var(--surface);
  border-radius:28px 28px 0 0; box-shadow:var(--shadow-lg); padding:8px 24px 32px; }
.sheet .grab{ width:36px; height:4px; border-radius:999px; background:var(--hairline); margin:8px auto 16px; }
```

### Step indicator
```css
.steps{ display:flex; gap:8px; }
.steps span{ flex:1; height:4px; border-radius:999px; background:var(--hairline); }
.steps span.done{ background:var(--brand); }
```

### Empty state
Centered illustration → Title → one line of Footnote (`--ink-soft`) → primary button. Warm, never a dead end. (Illustration spec in File 3.)

### Inline banner (heads-up) & Toast
```css
.banner{ display:flex; gap:10px; align-items:flex-start; background:var(--tight-bg);
  color:var(--tight); border-radius:16px; padding:14px 16px; font-size:15px; }
.toast{ background:var(--ink); color:var(--surface); border-radius:14px; padding:12px 16px;
  font-size:15px; box-shadow:var(--shadow-lg); }   /* bottom-anchored, auto-dismiss ~2.5s */
```

### Avatar / initials
38–44px circle, `--brand-soft` bg, `--brand-deep` initials, 14px/600.

---

## 7. States

**Interactive** (every control): default · pressed (scale .97) · disabled (40% opacity, no press) · focus (3px brand ring) · error (red border + footnote) · loading (spinner, label hidden).

**The three money states** — same layout, recolor only:

| State | num color | chip bg/text | icon | tone |
|-------|-----------|--------------|------|------|
| Healthy | `--safe` | `--safe-bg` / `--safe` | check | reassuring |
| Tight | `--tight` | `--tight-bg` / `--tight` | alert-triangle | gentle caution |
| Over | `--over` | `--over-bg` / `--over` | alert-triangle | supportive heads-up |

---

## 8. Iconography

**Lucide** (`lucide-react` in Cursor) — outline, stroke ~1.75, rounded. Sizes: inline 19–20 · default 24 · tab 24. Core set: `wallet, calendar, home, plus, chevron-right, chevron-left, x, check, alert-triangle, smartphone, zap, car, play, settings, trash-2, pencil, bell, user, eye, eye-off`.

---

## 9. Accessibility

- Body text meets WCAG AA (4.5:1); verify state colors on their tint backgrounds.
- State never by color alone — always icon + word.
- Targets ≥ 44×44 with spacing.
- Size in `rem`; support dynamic type; never hard-cap the hero number's container.
- Honor `prefers-reduced-motion` (see File 3).
- Hero number needs a screen-reader label, e.g. "Safe to spend: 885 dollars until June 20, healthy."

---

## 10. Voice & tone (design-level)

Calm, plain, encouraging — a level-headed friend, not a bank. Frame forward ("$885 to spend before payday"), never backward ("you spent $315"). Pair hard moments with a next step. (Full microcopy library in File 2.)

---

## 11. Implementation

**File structure (suggested):**
```
/styles/tokens.css      ← §2, §3, §4
/styles/base.css        ← §5 shell + resets
/components/            ← one file per §6 component
/screens/               ← see File 2
```

**Tailwind mapping** (if Cursor scaffolded Tailwind), add to `tailwind.config.js`:
```js
theme:{ extend:{
  colors:{ canvas:'var(--canvas)', surface:'var(--surface)', 'surface-raised':'var(--surface-raised)',
    brand:'var(--brand)','brand-deep':'var(--brand-deep)','brand-soft':'var(--brand-soft)',
    safe:'var(--safe)', tight:'var(--tight)', over:'var(--over)',
    ink:'var(--ink)','ink-soft':'var(--ink-soft)','ink-faint':'var(--ink-faint)', hairline:'var(--hairline)' },
  borderRadius:{ chip:'12px', input:'16px', btn:'16px', card:'24px', sheet:'28px' },
  boxShadow:{ sm:'var(--shadow-sm)', md:'var(--shadow-md)', lg:'var(--shadow-lg)' },
  fontFamily:{ sans:'var(--font)' },
}}
```

**Cursor setup prompts (in order):**
1. "Add `tokens.css` (§2–4) and `base.css` (§5) to globals and import them."
2. "Build the `.shell` wrapper and `.tabbar` from the spec; all screens render inside the shell."
3. "Create each component in §6 as its own reusable component using the provided CSS and Lucide icons."
4. "Apply the three money states from §7 to the hero and chip."
5. "Run the accessibility checklist in §9."
