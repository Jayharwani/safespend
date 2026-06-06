type Scene = "balance" | "calendar" | "shield";

export function OnboardingIllustration({ scene }: { scene: Scene }) {
  if (scene === "balance") {
    return (
      <svg viewBox="0 0 280 200" className="w-full max-w-[280px] mx-auto" aria-hidden>
        <ellipse cx="140" cy="100" rx="120" ry="80" fill="#E3F1EA" opacity="0.6" />
        <rect x="70" y="60" width="140" height="90" rx="20" fill="#FBFCFA" stroke="#E2E7E1" strokeWidth="1.5" />
        <text x="140" y="115" textAnchor="middle" fontSize="32" fontWeight="600" fill="#1C6F53" fontFamily="Inter,system-ui">
          $885
        </text>
        <circle cx="200" cy="55" r="18" fill="#F6EDD8" stroke="#B07A1E" strokeWidth="1.5" />
        <text x="200" y="60" textAnchor="middle" fontSize="14" fill="#B07A1E">−</text>
        <circle cx="80" cy="55" r="18" fill="#E3F1EA" stroke="#2E9E78" strokeWidth="1.5" />
        <text x="80" y="61" textAnchor="middle" fontSize="16" fill="#1C6F53">$</text>
      </svg>
    );
  }

  if (scene === "calendar") {
    return (
      <svg viewBox="0 0 280 200" className="w-full max-w-[280px] mx-auto" aria-hidden>
        <ellipse cx="140" cy="100" rx="120" ry="80" fill="#E3F1EA" opacity="0.5" />
        <rect x="85" y="50" width="110" height="110" rx="18" fill="#FBFCFA" stroke="#E2E7E1" strokeWidth="1.5" />
        <rect x="85" y="50" width="110" height="28" rx="18" fill="#2E9E78" opacity="0.85" />
        {[0, 1, 2, 3, 4, 5].map((i) => (
          <circle
            key={i}
            cx={105 + (i % 3) * 28}
            cy={95 + Math.floor(i / 3) * 28}
            r="5"
            fill={i === 2 ? "#2E9E78" : "#E2E7E1"}
          />
        ))}
      </svg>
    );
  }

  return (
    <svg viewBox="0 0 280 200" className="w-full max-w-[280px] mx-auto" aria-hidden>
      <ellipse cx="140" cy="100" rx="120" ry="80" fill="#E3F1EA" opacity="0.5" />
      <path
        d="M140 45 L175 75 L165 120 L115 120 L105 75 Z"
        fill="#FBFCFA"
        stroke="#2E9E78"
        strokeWidth="2"
        strokeLinejoin="round"
      />
      <path
        d="M125 95 L138 108 L158 82"
        fill="none"
        stroke="#1C6F53"
        strokeWidth="3"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <circle cx="200" cy="130" r="22" fill="#F6EDD8" stroke="#B07A1E" strokeWidth="1.5" />
      <text x="200" y="136" textAnchor="middle" fontSize="18" fill="#B07A1E">
        !
      </text>
    </svg>
  );
}
