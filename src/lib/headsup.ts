import type { BudgetProjection } from "../types";
import { formatMoney } from "./finance";

export interface HeadsUp {
  level: "over" | "tight" | "payday";
  message: string;
  tag: string;
  /** Whether this is worth a notification (vs. an in-app banner only). */
  notify: boolean;
}

/**
 * The single supportive heads-up for the current forecast, or null when all is
 * calm. Drives both the in-app banner and the on-open notification.
 */
export function getHeadsUp(p: BudgetProjection, paydayLabel: string): HeadsUp | null {
  if (p.daysUntilPayday === 0) {
    return {
      level: "payday",
      message: "It's payday — your new cycle starts now.",
      tag: "headroom-payday",
      notify: true,
    };
  }

  if (p.status === "over") {
    const short = formatMoney(Math.abs(p.lowestBalance));
    const when = p.lowestBalanceLabel || paydayLabel;
    return {
      level: "over",
      message: `Heads up — you're on track to dip about ${short} below zero around ${when}. Want to adjust?`,
      tag: "headroom-dip",
      notify: true,
    };
  }

  if (p.status === "tight") {
    return {
      level: "tight",
      message: `Getting tight — about ${formatMoney(p.safeToSpend)} left until ${paydayLabel}. Easy does it.`,
      tag: "headroom-tight",
      notify: false,
    };
  }

  return null;
}
