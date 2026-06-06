# Headroom — Screens (File 2 of 3)

Every screen to design, from launch through home and beyond, each with purpose, layout, components, content, and states. Uses the components and tokens from **File 1 — UI**; motion per **File 3 — Motion & Visuals**.

---

## 1. Navigation architecture

```
Launch
 └─ Splash → (first run) Onboarding 1·2·3 → Sign up / Sign in → Permissions → Setup 1·2·3 → All set → HOME
            (returning) → HOME

HOME is a 3-tab app:
 ┌─────────── Bottom tab bar ───────────┐
 │  Today        Plan         Settings   │
 └───────────────────────────────────────┘

Modal flows (slide up from any tab):
 • Add / edit sheet (bill · income · spend)
 • Payday moment (auto-triggers on payday)

Pushed screens:
 • Spend log · Bill detail · Account · Notifications
```

Primary nav lives at the bottom (thumb reach). The primary action on each tab is bottom-anchored above the tab bar.

---

## 2. Core user flows

- **First run:** Splash → 3 onboarding cards → Sign up → notification permission → Setup (balance → pay schedule → bills) → All set → Home (Today). Goal: from install to a real safe-to-spend number in under 90 seconds.
- **Daily use:** open → Today (the number) → optionally "Log a spend" sheet → done. The whole point is a 5-second check.
- **Add a bill:** any tab → "+" → sheet → pick type → enter → save → Plan updates, Today recalculates.
- **Payday:** date hits → Payday moment auto-shows → number resets for the new cycle.

---

## 3. Screen specs

Template per screen: **Purpose · When seen · Layout (top→bottom) · Components · Content/microcopy · States · In/Out.**

---

### 3.1 Splash
- **Purpose:** brand breath while the app boots; sets the calm tone.
- **When:** every launch, ~0.8s.
- **Layout:** centered wordmark/logo on `--canvas`; logo does a soft fade + scale-in.
- **Components:** logo only.
- **Content:** wordmark "Headroom."
- **States:** loading.
- **In/Out:** auto → Onboarding (first run) or Home (returning). Never blocks; if data loads fast, skip.

---

### 3.2 Onboarding (3 cards)
- **Purpose:** explain the one idea — "know what's safe to spend before payday" — and earn the signup.
- **When:** first run only.
- **Layout:** full-bleed illustration (top ⅔) → Large title → one line of Body → page dots → "Next" (text button) and "Skip." Final card's button is "Get started" (primary).
- **Components:** illustration, page dots, primary/text buttons.
- **Content:**
  1. "See what's actually yours." — "Your balance lies. We subtract what's coming so you know what's safe to spend."
  2. "No budgets. No categories." — "Enter your bills once. We do the math every day."
  3. "Never get caught short." — "We warn you before a bill would push you under."
- **States:** card 1·2·3 (swipeable, parallax — File 3).
- **In/Out:** swipe between; "Get started" → Sign up. "Skip" → Sign up.

---

### 3.3 Sign up
- **Purpose:** create an account (or continue as guest for a no-backend portfolio build).
- **When:** first run, after onboarding.
- **Layout:** nav (back) → Large title "Create your account" → "Continue with Apple" + "Continue with Google" (secondary buttons with icons) → "or" hairline divider → email field → primary "Continue" → footnote with terms → text link "I already have an account."
- **Components:** social buttons, field, primary button, hairline divider.
- **Content:** title "Create your account"; helper "Takes less than a minute."
- **States:** default · email invalid (inline error) · loading.
- **In/Out:** social or email → Permissions. Link → Sign in.
- **Note:** for a portfolio MVP with no real backend, wire this to a managed auth (e.g. Supabase Auth) or offer a prominent "Continue as guest" that skips straight to Setup. Design the screen either way.

---

### 3.4 Sign in
- **Purpose:** returning users.
- **Layout:** nav (back) → Large title "Welcome back" → social buttons → email + password fields (password has show/hide eye) → "Forgot?" text link → primary "Sign in."
- **States:** default · error ("That didn't match — try again") · loading.
- **In/Out:** success → Home. Forgot → reset flow (simple email screen).

---

### 3.5 Permissions (notifications)
- **Purpose:** earn notification opt-in for the low-point heads-up — the feature that makes the app valuable.
- **When:** once, after signup, before setup.
- **Layout:** centered illustration → Title "Get a heads-up before you dip" → Body "We'll only ping you when a bill would push you low. Nothing else." → primary "Turn on alerts" → text "Maybe later."
- **States:** default; system prompt follows the primary tap.
- **In/Out:** either choice → Setup. Frame the value, never nag.

---

### 3.6 Setup — Step 1: Balance
- **Purpose:** capture the starting number.
- **Layout:** step indicator (1/3) → Title "What's in your account right now?" → big centered amount input ($ prefix, numeric pad) → Footnote "A rough number is fine — you can fix it anytime." → bottom-anchored primary "Next."
- **States:** empty (Next disabled) · valid.
- **In/Out:** Next → Step 2.

---

### 3.7 Setup — Step 2: Pay schedule
- **Purpose:** when money comes in.
- **Layout:** step (2/3) → Title "When do you get paid?" → amount input (pay amount) → segmented control (Weekly · Fortnightly · Monthly) → date picker "Next payday" → primary "Next."
- **Components:** amount input, segmented control, date picker.
- **States:** incomplete · valid.
- **In/Out:** back to 1; Next → Step 3.

---

### 3.8 Setup — Step 3: Bills
- **Purpose:** the recurring outgoings the forecast subtracts.
- **Layout:** step (3/3) → Title "What bills are coming?" → list of added bills (rows) → dashed "+ Add a bill" tile that opens the add sheet → primary "See my number."
- **Components:** list rows, add tile, bottom sheet (add bill), primary button.
- **Content:** helper "Add the big regulars — rent, phone, car. You can add more later."
- **States:** empty (encouraging, primary still enabled to allow zero bills) · with items.
- **In/Out:** back to 2; "See my number" → All set.

---

### 3.9 All set (transition moment)
- **Purpose:** a small reward + reveal of the first number.
- **Layout:** centered success illustration / check draw → Title "You're all set" → the first safe-to-spend number counts up → primary "Go to Headroom."
- **States:** celebratory (subtle — File 3).
- **In/Out:** → Home (Today).

---

### 3.10 HOME — Today (the hero screen)
- **Purpose:** answer "can I spend right now?" in 5 seconds. The screen you feature in your portfolio.
- **When:** default tab, every open.
- **Layout (top→bottom):**
  1. nav: greeting + date (left), settings icon (right)
  2. **hero block:** label "Safe to spend until payday" → 64px number (count-up) → footnote "$59/day · 15 days left" → state chip
  3. **balance card:** "Balance until payday" + self-drawing mini line chart with payday marker + breathing low-point dot
  4. **coming-up card:** "Coming up before payday" + 3 bill rows
  5. bottom-anchored primary "+ Log a spend"
- **Components:** nav bar, hero, card, mini chart, list rows, primary button.
- **States:** Healthy / Tight / Over (recolor hero + chip + copy + chart line). Empty (no bills yet → gentle prompt to add). Just-paid (post-payday reset).
- **In/Out:** settings icon → Settings; "+" → add sheet; tap chart → Insights; tap a bill → Bill detail.

---

### 3.11 HOME — Plan (bills & income + forecast)
- **Purpose:** manage recurring items and see the month ahead.
- **Layout:** nav "Plan" → segmented (This month · All items) →
  - *This month:* a calendar or month strip showing daily projected balance, payday markers, and the low point highlighted.
  - *All items:* sectioned list — "Income" rows and "Bills" rows, each editable; dashed "+ Add" at the bottom.
- **Components:** segmented control, calendar/forecast, list sections, add tile, sheet.
- **States:** empty · populated · editing (swipe-to-delete).
- **In/Out:** row → Bill detail / edit sheet; "+" → add sheet.

---

### 3.12 HOME — Settings
- **Purpose:** the few things that change.
- **Layout:** nav "Settings" → grouped list:
  - Account (name, email) → Account screen
  - Money: starting balance, pay schedule, currency
  - Notifications: low-point alerts toggle, payday reminder toggle
  - Appearance: Light / Dark / System segmented
  - About, Privacy, Sign out
- **Components:** section list rows, toggles, segmented control.
- **States:** default.
- **In/Out:** rows push to detail screens or open sheets.

---

### 3.13 Add / edit sheet (reusable)
- **Purpose:** one sheet for everything — bill, income, or one-off spend.
- **When:** "+" from any tab; editing an item.
- **Layout (sheet):** grab handle → segmented type (Bill · Income · Spend) → name field → amount input → date / frequency (frequency for bill+income; single date for spend) → primary "Save" → (edit mode) "Delete" text in `--over`.
- **Components:** sheet, segmented control, fields, amount input, date picker, primary/text buttons.
- **Content:** save confirms with a toast ("Bill added", "Spend logged").
- **States:** add · edit · invalid (Save disabled).
- **In/Out:** save/dismiss → returns to origin; Today + Plan recalculate.

---

### 3.14 Spend log
- **Purpose:** see what you've logged this cycle.
- **Layout:** nav (back) "This cycle" → total spent summary → chronological rows (name, date, amount), grouped by day → swipe-to-delete.
- **States:** empty ("Nothing logged yet") · populated.
- **In/Out:** from Today; row → edit sheet.

---

### 3.15 Bill detail
- **Purpose:** view/edit a single recurring item.
- **Layout:** nav (back) → icon + name + amount → next due date → frequency → history (optional) → "Edit" (primary) → "Delete" (text, `--over`).
- **States:** default.
- **In/Out:** Edit → add/edit sheet prefilled.

---

### 3.16 Payday moment
- **Purpose:** the signature delight beat — celebrate the reset.
- **When:** auto on payday (and reachable as a preview).
- **Layout:** soft confetti → Title "Payday." → the new cycle's safe-to-spend counts up from 0 → footnote "New cycle — here's your room." → primary "Nice."
- **Components:** confetti (File 3), big number, primary button.
- **States:** celebratory (gentle, not loud).
- **In/Out:** "Nice" → Today (refreshed).

---

### 3.17 Account
- **Purpose:** manage profile + auth.
- **Layout:** nav (back) → avatar + name + email → edit name → change email → manage subscription (if you ever add paid) → sign out → delete account (text, `--over`).
- **States:** default.
- **In/Out:** from Settings.

---

### 3.18 Notifications (in-app list)
- **Purpose:** history of heads-ups.
- **Layout:** nav (back) "Alerts" → rows (e.g. "You'll dip to ~$40 on Jun 18", timestamp) → tap → Today.
- **States:** empty · populated.

---

### 3.19 System states (design these, they signal seniority)
- **Empty states:** one per tab/list — illustration + Title + one line + primary action. Never a blank screen.
- **Loading:** skeleton shimmer on the hero and cards (File 3), not spinners where avoidable.
- **Offline / error:** gentle full-screen — illustration + "Can't reach the internet" + "Try again." Since v1 math is local, most of the app still works offline; say so.
- **First-bill empty (Today):** hero shows a friendly "Add your bills and I'll start forecasting" with a primary "+ Add bills."

---

## 4. Microcopy library (calm voice)

- Hero healthy: "You've got $885 to spend before payday."
- Hero sub: "about $59/day · 15 days left"
- Tight: "Getting tight — about $85 until Jun 20. Easy does it."
- Over: "Heads up — you'll be about $40 short before payday. Want to adjust?"
- Add bill empty: "Add your first bill and I'll start forecasting."
- Spend logged toast: "Logged."
- Bill added toast: "Bill added."
- Permission ask: "We'll only ping you when a bill would push you low. Nothing else."
- All set: "You're all set."
- Payday: "Payday. New cycle — here's your room."
- Offline: "You're offline — your number still works. Some things will sync later."

Principles: round all numbers; tabular figures; frame forward; offer a next step in hard moments; confirmations are quiet (no exclamation marks except Payday).

---

## 5. Scope discipline (what to leave out)

No multi-account aggregation, no bank sync (v1), no transaction categories, no charts beyond the one balance line, no social, no tutorials beyond the 3 onboarding cards. If you want to add a screen, first ask whether it can be a *state* of an existing one.

---

## 6. Portfolio framing

Feature these as your hero shots, in this order: **Today (Healthy)**, **Today (Over)**, **Setup Step 1 (amount input)**, **Add sheet open**, **Payday moment**. That sequence tells the whole story — problem, the warning that makes it valuable, effortless input, and a moment of delight — in five frames.
