import type { BudgetStatus } from "../types";

interface AmbientBackgroundProps {
  status?: BudgetStatus;
}

export default function AmbientBackground({ status = "healthy" }: AmbientBackgroundProps) {
  return (
    <div className="ambient-bg" aria-hidden>
      <div className={`ambient-orb ambient-orb-1 status-${status}`} />
      <div className={`ambient-orb ambient-orb-2 status-${status}`} />
      <div className={`ambient-orb ambient-orb-3 status-${status}`} />
    </div>
  );
}
