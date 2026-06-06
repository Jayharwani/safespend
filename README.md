# SafeSpend

**Can I spend right now?** — A forward-looking budgeting app that tells you what's truly free to spend before your next paycheck.

No categories. No receipt sorting. Just balance − upcoming bills = safe to spend.

## Run locally

```bash
npm install
npm run dev
```

Open [http://localhost:5173](http://localhost:5173).

## Screens

1. **Setup** — 3-step first-run flow (balance → pay → bills)
2. **Today** — Hero screen with safe-to-spend number, daily allowance, balance chart, and upcoming bills
3. **Entry sheet** — Reusable bottom sheet for logging spends, bills, or income

## Demo scenarios

Tap the gear icon → **Preview scenarios** to load the worked examples:

- **Healthy ($1,200)** → $885 safe, ~$59/day
- **Tight ($400)** → $85 safe, amber warning
- **Over budget ($200)** → red alert before payday
