export default function WelcomeIllustration() {
  return (
    <svg
      viewBox="0 0 320 220"
      className="w-full max-w-[300px] mx-auto mb-6"
      aria-hidden
    >
      <defs>
        <linearGradient id="wl-bg" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="var(--brand)" stopOpacity="0.18" />
          <stop offset="100%" stopColor="var(--tight)" stopOpacity="0.08" />
        </linearGradient>
        <linearGradient id="wl-card" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="var(--surface-raised)" />
          <stop offset="100%" stopColor="var(--brand-soft)" />
        </linearGradient>
        <filter id="wl-shadow" x="-20%" y="-20%" width="140%" height="140%">
          <feDropShadow dx="0" dy="8" stdDeviation="12" floodColor="var(--ink)" floodOpacity="0.1" />
        </filter>
      </defs>

      <ellipse cx="160" cy="110" rx="130" ry="90" fill="url(#wl-bg)" className="illus-float-slow" />

      <g className="illus-float" style={{ animationDelay: "0.2s" }} filter="url(#wl-shadow)">
        <rect x="88" y="72" width="144" height="92" rx="18" fill="url(#wl-card)" stroke="var(--hairline)" strokeWidth="1.5" />
        <rect x="104" y="88" width="48" height="8" rx="4" fill="var(--brand)" opacity="0.35" />
        <text x="118" y="128" fontSize="28" fontWeight="600" fill="var(--brand-deep)" fontFamily="inherit">
          $885
        </text>
        <text x="118" y="148" fontSize="11" fill="var(--ink-soft)" fontFamily="inherit">
          safe to spend
        </text>
      </g>

      <g className="illus-float-delayed">
        <circle cx="72" cy="58" r="22" fill="var(--brand-soft)" stroke="var(--brand)" strokeWidth="1.5" opacity="0.9" />
        <text x="72" y="64" textAnchor="middle" fontSize="16" fill="var(--brand-deep)" fontWeight="600">
          $
        </text>
      </g>

      <g className="illus-float" style={{ animationDelay: "0.6s" }}>
        <rect x="228" y="48" width="52" height="52" rx="14" fill="var(--tight-bg)" stroke="var(--tight)" strokeWidth="1.5" opacity="0.95" />
        <rect x="240" y="60" width="28" height="6" rx="3" fill="var(--tight)" opacity="0.4" />
        <rect x="240" y="72" width="20" height="6" rx="3" fill="var(--tight)" opacity="0.25" />
        <circle cx="254" cy="88" r="4" fill="var(--tight)" opacity="0.5" />
      </g>

      <g className="illus-float-delayed" style={{ animationDelay: "1s" }}>
        <path
          d="M248 158 L262 172 L286 148"
          fill="none"
          stroke="var(--brand)"
          strokeWidth="3"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <circle cx="267" cy="162" r="24" fill="var(--brand-soft)" stroke="var(--brand)" strokeWidth="1.5" opacity="0.85" />
      </g>

      <g className="illus-drift">
        <circle cx="48" cy="168" r="6" fill="var(--brand)" opacity="0.25" />
        <circle cx="280" cy="118" r="4" fill="var(--tight)" opacity="0.3" />
        <circle cx="200" cy="42" r="5" fill="var(--brand)" opacity="0.2" />
      </g>
    </svg>
  );
}
