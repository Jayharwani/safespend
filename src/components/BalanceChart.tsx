import { useEffect, useId, useMemo, useRef } from "react";
import type { BudgetStatus, DayProjection } from "../types";

interface BalanceChartProps {
  data: DayProjection[];
  status: BudgetStatus;
}

const statusColors: Record<BudgetStatus, { line: string; deep: string }> = {
  healthy: { line: "var(--brand)", deep: "var(--brand-deep)" },
  tight: { line: "var(--tight)", deep: "var(--tight)" },
  over: { line: "var(--over)", deep: "var(--over)" },
};

export default function BalanceChart({ data, status }: BalanceChartProps) {
  const lineRef = useRef<SVGPathElement>(null);
  const areaRef = useRef<SVGPathElement>(null);
  const gradId = useId();

  const geometry = useMemo(() => {
    if (data.length < 2) return null;

    const width = 300;
    const height = 96;
    const padding = { top: 10, right: 4, bottom: 20, left: 4 };
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

    const lowestIdx = points.reduce(
      (min, p, i) => (p.balance < points[min].balance ? i : min),
      0
    );

    const labelIndices = [0, Math.floor(data.length / 2), data.length - 1].filter(
      (v, i, a) => a.indexOf(v) === i
    );

    return { width, height, linePath, areaPath, points, lowestIdx, labelIndices };
  }, [data]);

  useEffect(() => {
    const line = lineRef.current;
    const area = areaRef.current;
    if (!line || !area || !geometry) return;

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const len = line.getTotalLength();

    if (reduced) {
      line.style.strokeDasharray = `${len}`;
      line.style.strokeDashoffset = "0";
      area.style.opacity = "1";
      return;
    }

    line.style.strokeDasharray = `${len}`;
    line.style.strokeDashoffset = `${len}`;
    line.style.transition = "stroke-dashoffset 1400ms cubic-bezier(0.16, 1, 0.3, 1)";
    area.style.opacity = "0";
    area.style.transition = "opacity 900ms ease 500ms";

    requestAnimationFrame(() => {
      line.style.strokeDashoffset = "0";
      area.style.opacity = "1";
    });
  }, [geometry, status]);

  if (!geometry) return null;

  const colors = statusColors[status];
  const { width, height, linePath, areaPath, points, lowestIdx, labelIndices } = geometry;

  return (
    <div className="w-full">
      <svg
        viewBox={`0 0 ${width} ${height}`}
        className="w-full h-[96px]"
        preserveAspectRatio="none"
        aria-label="Balance projection until payday"
      >
        <defs>
          <linearGradient id={gradId} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={colors.line} stopOpacity="0.22" />
            <stop offset="100%" stopColor={colors.line} stopOpacity="0" />
          </linearGradient>
        </defs>
        <path ref={areaRef} d={areaPath} fill={`url(#${gradId})`} />
        <path
          ref={lineRef}
          d={linePath}
          fill="none"
          stroke={colors.line}
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <circle
          cx={points[lowestIdx].x}
          cy={points[lowestIdx].y}
          r="4"
          fill={colors.deep}
          className="breathe"
        />
        {labelIndices.map((idx) => (
          <text
            key={idx}
            x={points[idx].x}
            y={height - 2}
            textAnchor={idx === 0 ? "start" : idx === data.length - 1 ? "end" : "middle"}
            fill="var(--ink-faint)"
            fontSize="11"
            fontFamily="var(--font)"
          >
            {data[idx].dateLabel}
          </text>
        ))}
      </svg>
    </div>
  );
}
