export default function EmptyBillsIllustration() {
  return (
    <svg viewBox="0 0 120 100" className="w-[100px] h-[84px] mx-auto mb-4" aria-hidden>
      <defs>
        <linearGradient id="eb-fill" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="var(--accent-soft)" />
          <stop offset="100%" stopColor="var(--surface)" />
        </linearGradient>
      </defs>
      <rect x="20" y="18" width="68" height="58" rx="12" fill="url(#eb-fill)" stroke="var(--hairline)" strokeWidth="1.5" className="illus-float-slow" />
      <rect x="32" y="32" width="32" height="5" rx="2.5" fill="var(--accent)" opacity="0.3" />
      <rect x="32" y="44" width="44" height="5" rx="2.5" fill="var(--tertiary)" opacity="0.25" />
      <rect x="32" y="56" width="24" height="5" rx="2.5" fill="var(--tertiary)" opacity="0.2" />
      <circle cx="88" cy="28" r="14" fill="var(--accent-soft)" stroke="var(--accent)" strokeWidth="1.5" className="illus-float" />
      <text x="88" y="33" textAnchor="middle" fontSize="16" fill="var(--accent-deep)" fontWeight="600">
        +
      </text>
    </svg>
  );
}
