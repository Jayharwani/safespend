interface WordmarkProps {
  size?: number;
  showText?: boolean;
}

export default function Wordmark({ size = 56, showText = true }: WordmarkProps) {
  return (
    <div style={{ display: "inline-flex", alignItems: "center", gap: 14 }}>
      <div
        className="wordmark-mono"
        style={{
          width: size,
          height: size,
          fontSize: size * 0.5,
          borderRadius: size * 0.32,
        }}
      >
        H
      </div>
      {showText && (
        <span
          className="wordmark"
          style={{
            fontSize: size * 0.46,
            letterSpacing: "-0.045em",
          }}
        >
          Headroom
        </span>
      )}
    </div>
  );
}
