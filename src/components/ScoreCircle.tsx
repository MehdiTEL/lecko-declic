import { useEffect, useRef, useState } from "react";

interface ScoreCircleProps {
  score: number;
  size?: number;
}

export default function ScoreCircle({ score, size = 160 }: ScoreCircleProps) {
  const [animated, setAnimated] = useState(0);
  const radius = (size - 20) / 2;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (circumference * animated) / 100;
  const rafRef = useRef<number | null>(null);

  useEffect(() => {
    const start = performance.now();
    const duration = 1500;

    const animate = (now: number) => {
      const elapsed = now - start;
      const progress = Math.min(elapsed / duration, 1);
      // Ease out quart
      const eased = 1 - Math.pow(1 - progress, 4);
      setAnimated(eased * score);

      if (progress < 1) {
        rafRef.current = requestAnimationFrame(animate);
      }
    };

    rafRef.current = requestAnimationFrame(animate);
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [score]);

  return (
    <div className="flex flex-col items-center gap-2">
      <div className="relative" style={{ width: size, height: size }}>
        <svg
          width={size}
          height={size}
          viewBox={`0 0 ${size} ${size}`}
          className="-rotate-90"
          style={{ transform: "rotate(-90deg)" }}
        >
          {/* Background circle */}
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="none"
            stroke="hsl(var(--border))"
            strokeWidth="12"
          />
          {/* Animated arc */}
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="none"
            stroke="hsl(var(--lecko-blue))"
            strokeWidth="12"
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
          />
          {/* Orange accent dot at end */}
          {animated > 5 && (
            <circle
              cx={size / 2}
              cy={size / 2 - radius}
              r="7"
              fill="hsl(var(--lecko-orange))"
              transform={`rotate(${(animated / 100) * 360} ${size / 2} ${size / 2})`}
            />
          )}
        </svg>

        {/* Center text */}
        <div
          className="absolute inset-0 flex flex-col items-center justify-center"
          style={{ transform: "none" }}
        >
          <span className="text-4xl font-bold text-lecko-blue leading-none">
            {Math.round(animated)}%
          </span>
          <span className="text-xs text-foreground-muted font-medium mt-1">
            automatisable
          </span>
        </div>
      </div>
    </div>
  );
}
