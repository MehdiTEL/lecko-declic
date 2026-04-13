interface ScoreGaugeProps {
  score: number; // 0-100
  size?: number; // default 120
  label?: string;
}

function getScoreColor(score: number): string {
  if (score <= 25) return "#EF4444"; // red-500
  if (score <= 50) return "#F59E0B"; // amber-500
  if (score <= 75) return "#8B5CF6"; // violet-500
  return "#06B6D4"; // cyan-500
}

export default function ScoreGauge({
  score,
  size = 120,
  label,
}: ScoreGaugeProps) {
  const strokeWidth = 8;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const filled = (score / 100) * circumference;
  const dashArray = `${filled} ${circumference - filled}`;
  const color = getScoreColor(score);
  const center = size / 2;

  return (
    <div className="flex flex-col items-center gap-2">
      <svg
        width={size}
        height={size}
        viewBox={`0 0 ${size} ${size}`}
        className="transform -rotate-90"
      >
        {/* Background circle */}
        <circle
          cx={center}
          cy={center}
          r={radius}
          fill="none"
          stroke="rgba(255,255,255,0.06)"
          strokeWidth={strokeWidth}
        />

        {/* Score arc */}
        <circle
          cx={center}
          cy={center}
          r={radius}
          fill="none"
          stroke={color}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeDasharray={dashArray}
          className="transition-all duration-700 ease-out"
        />
      </svg>

      {/* Score number centered on top of SVG */}
      <div
        className="flex items-center justify-center"
        style={{
          marginTop: -size + (size - 24) / 2,
          height: size,
          width: size,
        }}
      >
        <span
          className="font-bold text-white"
          style={{ fontSize: size * 0.28, color }}
        >
          {Math.round(score)}
        </span>
      </div>

      {/* Label */}
      {label && (
        <span className="text-[#8A8AA3] text-sm font-medium text-center">
          {label}
        </span>
      )}
    </div>
  );
}
