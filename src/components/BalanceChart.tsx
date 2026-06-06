import type { DayProjection } from "../types";
import type { BudgetStatus } from "../types";

interface BalanceChartProps {
  data: DayProjection[];
  status: BudgetStatus;
}

const statusColors: Record<BudgetStatus, { line: string; fill: string; dot: string }> = {
  healthy: { line: "#34d399", fill: "rgba(52, 211, 153, 0.12)", dot: "#34d399" },
  tight: { line: "#fbbf24", fill: "rgba(251, 191, 36, 0.12)", dot: "#fbbf24" },
  danger: { line: "#f87171", fill: "rgba(248, 113, 113, 0.12)", dot: "#f87171" },
};

export default function BalanceChart({ data, status }: BalanceChartProps) {
  if (data.length < 2) return null;

  const colors = statusColors[status];
  const width = 320;
  const height = 120;
  const padding = { top: 12, right: 8, bottom: 24, left: 8 };
  const chartW = width - padding.left - padding.right;
  const chartH = height - padding.top - padding.bottom;

  const balances = data.map((d) => d.balance);
  const minBal = Math.min(...balances, 0);
  const maxBal = Math.max(...balances);
  const range = maxBal - minBal || 1;

  const points = data.map((d, i) => {
    const x = padding.left + (i / (data.length - 1)) * chartW;
    const y = padding.top + chartH - ((d.balance - minBal) / range) * chartH;
    return { x, y, ...d };
  });

  const linePath = points.map((p, i) => `${i === 0 ? "M" : "L"} ${p.x} ${p.y}`).join(" ");

  const areaPath =
    linePath +
    ` L ${points[points.length - 1].x} ${padding.top + chartH}` +
    ` L ${points[0].x} ${padding.top + chartH} Z`;

  const stepPoints = points.filter((p) => p.events.length > 0);

  const labelIndices = [0, Math.floor(data.length / 2), data.length - 1].filter(
    (v, i, a) => a.indexOf(v) === i
  );

  return (
    <div className="w-full">
      <svg
        viewBox={`0 0 ${width} ${height}`}
        className="w-full h-auto"
        aria-label="Balance projection until payday"
      >
        <path d={areaPath} fill={colors.fill} />
        <path
          d={linePath}
          fill="none"
          stroke={colors.line}
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        {stepPoints.map((p, i) => (
          <circle
            key={i}
            cx={p.x}
            cy={p.y}
            r="4"
            fill={colors.dot}
            stroke="var(--color-surface-raised)"
            strokeWidth="2"
          />
        ))}
        <circle
          cx={points[0].x}
          cy={points[0].y}
          r="5"
          fill={colors.dot}
          stroke="var(--color-surface-raised)"
          strokeWidth="2"
        />
        {labelIndices.map((idx) => (
          <text
            key={idx}
            x={points[idx].x}
            y={height - 4}
            textAnchor={idx === 0 ? "start" : idx === data.length - 1 ? "end" : "middle"}
            className="fill-text-muted"
            fontSize="10"
            fontFamily="DM Sans, sans-serif"
          >
            {data[idx].dateLabel}
          </text>
        ))}
      </svg>
    </div>
  );
}
