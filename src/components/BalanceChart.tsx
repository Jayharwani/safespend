import { useEffect, useId, useMemo, useRef } from "react";
import type { BudgetStatus, DayProjection } from "../types";

interface BalanceChartProps {
  data: DayProjection[];
  status: BudgetStatus;
}

const statusColors: Record<BudgetStatus, { line: string; deep: string }> = {
  healthy: { line: "#10b981", deep: "#065f46" },
  tight: { line: "#f59e0b", deep: "#b45309" },
  over: { line: "#ef4444", deep: "#991b1b" },
};

export default function BalanceChart({ data, status }: BalanceChartProps) {
  const lineRef = useRef<SVGPathElement>(null);
  const glowRef = useRef<SVGPathElement>(null);
  const areaRef = useRef<SVGPathElement>(null);
  const gradId = useId();

  const geometry = useMemo(() => {
    if (data.length < 2) return null;

    const width = 300;
    const height = 96;
    const padding = { top: 12, right: 4, bottom: 20, left: 4 };
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
    const glow = glowRef.current;
    const area = areaRef.current;
    if (!line || !area || !geometry) return;

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const len = line.getTotalLength();

    if (reduced) {
      line.style.strokeDasharray = `${len}`;
      line.style.strokeDashoffset = "0";
      if (glow) {
        glow.style.strokeDasharray = `${len}`;
        glow.style.strokeDashoffset = "0";
      }
      area.style.opacity = "1";
      return;
    }

    line.style.strokeDasharray = `${len}`;
    line.style.strokeDashoffset = `${len}`;
    line.style.transition = "stroke-dashoffset 1400ms cubic-bezier(0.16, 1, 0.3, 1)";
    
    if (glow) {
      glow.style.strokeDasharray = `${len}`;
      glow.style.strokeDashoffset = `${len}`;
      glow.style.transition = "stroke-dashoffset 1400ms cubic-bezier(0.16, 1, 0.3, 1)";
    }
    
    area.style.opacity = "0";
    area.style.transition = "opacity 900ms ease 500ms";

    requestAnimationFrame(() => {
      line.style.strokeDashoffset = "0";
      if (glow) glow.style.strokeDashoffset = "0";
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
            <stop offset="0%" stopColor={colors.line} stopOpacity="0.25" />
            <stop offset="100%" stopColor={colors.line} stopOpacity="0" />
          </linearGradient>
        </defs>
        {/* Underlay Gradient Area */}
        <path ref={areaRef} d={areaPath} fill={`url(#${gradId})`} />
        
        {/* Glow Layer (Neon Laser Blur) */}
        <path
          ref={glowRef}
          d={linePath}
          fill="none"
          stroke={colors.line}
          strokeWidth="6"
          opacity="0.3"
          strokeLinecap="round"
          strokeLinejoin="round"
        />

        {/* Sharp Core Layer */}
        <path
          ref={lineRef}
          d={linePath}
          fill="none"
          stroke={colors.line}
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />

        {/* Pulsing halo ring at the lowest projection point */}
        <circle
          cx={points[lowestIdx].x}
          cy={points[lowestIdx].y}
          r="7"
          fill="none"
          stroke={colors.line}
          strokeWidth="1.5"
          opacity="0.75"
          className="breathe"
          style={{ transformOrigin: `${points[lowestIdx].x}px ${points[lowestIdx].y}px` }}
        />
        <circle
          cx={points[lowestIdx].x}
          cy={points[lowestIdx].y}
          r="3.5"
          fill={colors.line}
        />
        
        {labelIndices.map((idx) => (
          <text
            key={idx}
            x={points[idx].x}
            y={height - 2}
            textAnchor={idx === 0 ? "start" : idx === data.length - 1 ? "end" : "middle"}
            fill="var(--ink-soft)"
            fontSize="10"
            fontWeight="600"
            fontFamily="var(--font)"
          >
            {data[idx].dateLabel}
          </text>
        ))}
      </svg>
    </div>
  );
}
