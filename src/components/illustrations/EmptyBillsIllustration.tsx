export default function EmptyBillsIllustration() {
  return (
    <svg viewBox="0 0 120 100" className="w-[100px] h-[84px] mx-auto mb-4" aria-hidden>
      <defs>
        <linearGradient id="eb-fill" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#E3F1EA" />
          <stop offset="100%" stopColor="#FBFCFA" />
        </linearGradient>
      </defs>
      <rect x="20" y="18" width="68" height="58" rx="12" fill="url(#eb-fill)" stroke="#E2E7E1" strokeWidth="1.5" className="illus-float-slow" />
      <rect x="32" y="32" width="32" height="5" rx="2.5" fill="#2E9E78" opacity="0.3" />
      <rect x="32" y="44" width="44" height="5" rx="2.5" fill="#97A19A" opacity="0.25" />
      <rect x="32" y="56" width="24" height="5" rx="2.5" fill="#97A19A" opacity="0.2" />
      <circle cx="88" cy="28" r="14" fill="#E3F1EA" stroke="#2E9E78" strokeWidth="1.5" className="illus-float" />
      <text x="88" y="33" textAnchor="middle" fontSize="16" fill="#1C6F53" fontWeight="600">
        +
      </text>
    </svg>
  );
}
