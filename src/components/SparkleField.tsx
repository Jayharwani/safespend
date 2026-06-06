interface SparkleFieldProps {
  active?: boolean;
}

const SPARKLES = [
  { x: "12%", y: "18%", delay: "0s", size: 4 },
  { x: "78%", y: "12%", delay: "0.4s", size: 3 },
  { x: "88%", y: "42%", delay: "0.8s", size: 5 },
  { x: "22%", y: "72%", delay: "1.2s", size: 3 },
];

export default function SparkleField({ active = false }: SparkleFieldProps) {
  if (!active) return null;

  return (
    <div className="sparkle-field" aria-hidden>
      {SPARKLES.map((s, i) => (
        <span
          key={i}
          className="sparkle"
          style={{
            left: s.x,
            top: s.y,
            width: s.size,
            height: s.size,
            animationDelay: s.delay,
          }}
        />
      ))}
    </div>
  );
}
