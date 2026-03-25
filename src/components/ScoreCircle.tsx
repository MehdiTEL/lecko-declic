import { useEffect, useRef, useState } from "react";
import { TrendingUp, TrendingDown } from "lucide-react";
import { BENCHMARK } from "@/data/benchmarkData";

interface ScoreCircleProps {
  score: number;
  size?: number;
}

/* Gr33t-style score circle — green gradient stroke, Inter bold center, glow effect */
export default function ScoreCircle({ score, size = 160 }: ScoreCircleProps) {
  const [animated, setAnimated] = useState(0);
  const [done, setDone] = useState(false);
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
      const eased = 1 - Math.pow(1 - progress, 4);
      setAnimated(eased * score);

      if (progress < 1) {
        rafRef.current = requestAnimationFrame(animate);
      } else {
        setDone(true);
      }
    };

    rafRef.current = requestAnimationFrame(animate);
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [score]);

  // Color based on score: green for good, amber for medium, slate for low
  const strokeColor = score >= 60
    ? "url(#gr33tGradient)"
    : score >= 35
    ? "hsl(38 92% 50%)"
    : "hsl(var(--foreground-muted))";

  // Benchmark comparison
  const avg = BENCHMARK.avgScore;
  const diff = score - avg;
  const isAbove = diff > 0;

  return (
    <div className="flex flex-col items-center gap-2">
      <div className="relative" style={{ width: size, height: size }}>
        <svg
          width={size}
          height={size}
          viewBox={`0 0 ${size} ${size}`}
          style={{ transform: "rotate(-90deg)" }}
        >
          <defs>
            <linearGradient id="gr33tGradient" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="hsl(160 84% 45%)" />
              <stop offset="100%" stopColor="hsl(160 84% 33%)" />
            </linearGradient>
          </defs>

          {/* Background circle */}
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="none"
            stroke="hsl(var(--muted))"
            strokeWidth="10"
          />
          {/* Animated arc with glow on completion */}
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="none"
            stroke={strokeColor}
            strokeWidth="10"
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            style={{
              filter: done
                ? score >= 60
                  ? "drop-shadow(0 0 6px hsl(160 84% 39% / 0.4))"
                  : score >= 35
                  ? "drop-shadow(0 0 6px hsl(38 92% 50% / 0.4))"
                  : "drop-shadow(0 0 6px hsl(215 16% 47% / 0.3))"
                : "none",
              transition: "filter 0.5s ease",
            }}
          />
        </svg>

        {/* Center text */}
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="font-heading text-4xl font-bold leading-none" style={{
            color: score >= 60 ? "hsl(160 84% 39%)" : score >= 35 ? "hsl(38 92% 50%)" : "hsl(var(--foreground-muted))"
          }}>
            {Math.round(animated)}%
          </span>
          <span className="text-xs text-foreground-muted font-medium mt-1">
            automatisable
          </span>
        </div>
      </div>

      {/* Benchmark comparison text */}
      <div className={`flex items-center gap-1 text-xs font-medium ${
        isAbove
          ? "text-gr33t-600 dark:text-gr33t-400"
          : "text-amber-600 dark:text-amber-400"
      }`}>
        {isAbove ? (
          <TrendingUp size={12} strokeWidth={2} />
        ) : (
          <TrendingDown size={12} strokeWidth={2} />
        )}
        <span>vs {avg}% en moyenne</span>
      </div>
    </div>
  );
}
