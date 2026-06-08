type Scene = "balance" | "calendar" | "shield";

/**
 * Refined duotone line illustrations — jade + ink only.
 * One consistent stroke weight, one soft surface fill, generous negative space.
 * No orbs, no glow, no multi-colour gradients.
 */
export function OnboardingIllustration({ scene }: { scene: Scene }) {
  const stroke = "var(--accent)";
  const surface = "var(--surface-2)";
  const ink = "var(--ink-faint)";
  const soft = "var(--accent-soft)";
  const sw = 2;

  if (scene === "balance") {
    return (
      <svg viewBox="0 0 280 220" width="100%" aria-hidden role="img">
        {/* contact shadow */}
        <ellipse cx="140" cy="196" rx="78" ry="9" fill="rgba(0,0,0,0.18)" />

        {/* back card */}
        <rect
          x="58" y="64" width="150" height="96" rx="16"
          transform="rotate(-6 133 112)"
          fill={surface} stroke="var(--hairline)" strokeWidth="1"
        />

        {/* front card */}
        <g transform="rotate(4 150 120)">
          <rect x="74" y="78" width="150" height="96" rx="16" fill={surface} stroke={stroke} strokeWidth={sw} />
          <rect x="74" y="78" width="150" height="96" rx="16" fill={soft} />
          <text x="149" y="128" textAnchor="middle" fontSize="30" fontWeight="600"
            fill="var(--ink)" fontFamily="inherit" letterSpacing="-1">$885</text>
          <text x="149" y="148" textAnchor="middle" fontSize="9" fontWeight="600"
            fill={ink} fontFamily="inherit" letterSpacing="2">SAFE TO SPEND</text>
          {/* subtract line */}
          <line x1="92" y1="98" x2="118" y2="98" stroke={stroke} strokeWidth={sw} strokeLinecap="round" />
        </g>

        {/* minus token */}
        <circle cx="226" cy="70" r="17" fill={surface} stroke={stroke} strokeWidth={sw} />
        <line x1="218" y1="70" x2="234" y2="70" stroke={stroke} strokeWidth={sw} strokeLinecap="round" />
      </svg>
    );
  }

  if (scene === "calendar") {
    return (
      <svg viewBox="0 0 280 220" width="100%" aria-hidden role="img">
        <ellipse cx="140" cy="196" rx="74" ry="9" fill="rgba(0,0,0,0.18)" />

        <rect x="78" y="50" width="124" height="132" rx="18" fill={surface} stroke="var(--hairline)" strokeWidth="1" />
        {/* header */}
        <path d="M78 68 a18 18 0 0 1 18 -18 h88 a18 18 0 0 1 18 18 v8 H78 Z" fill={soft} />
        <rect x="78" y="68" width="124" height="8" fill={soft} />
        <line x1="104" y1="44" x2="104" y2="58" stroke={stroke} strokeWidth={sw} strokeLinecap="round" />
        <line x1="176" y1="44" x2="176" y2="58" stroke={stroke} strokeWidth={sw} strokeLinecap="round" />

        {/* date dots grid */}
        {Array.from({ length: 12 }).map((_, i) => {
          const col = i % 4;
          const row = Math.floor(i / 4);
          const cx = 102 + col * 26;
          const cy = 100 + row * 26;
          const isPay = i === 9;
          const isNow = i === 2;
          return (
            <g key={i}>
              {isPay ? (
                <circle cx={cx} cy={cy} r="9" fill={stroke} />
              ) : isNow ? (
                <circle cx={cx} cy={cy} r="9" fill="none" stroke={stroke} strokeWidth={sw} />
              ) : (
                <circle cx={cx} cy={cy} r="3.5" fill={ink} />
              )}
            </g>
          );
        })}
      </svg>
    );
  }

  // shield
  return (
    <svg viewBox="0 0 280 220" width="100%" aria-hidden role="img">
      <ellipse cx="140" cy="200" rx="66" ry="9" fill="rgba(0,0,0,0.18)" />
      <path
        d="M140 40 L196 62 L188 138 C181 166 140 188 140 188 C140 188 99 166 92 138 L84 62 Z"
        fill={surface} stroke={stroke} strokeWidth={sw} strokeLinejoin="round"
      />
      <path
        d="M140 40 L196 62 L188 138 C181 166 140 188 140 188 C140 188 99 166 92 138 L84 62 Z"
        fill={soft}
      />
      <path
        d="M118 112 L134 128 L166 92"
        fill="none" stroke={stroke} strokeWidth="3.5"
        strokeLinecap="round" strokeLinejoin="round"
      />
    </svg>
  );
}
