export interface MiniSparklineProps {
  values: number[];
  color: string;
  width?: number;
  height?: number;
}

export default function MiniSparkline({ values, color, width = 80, height = 24 }: MiniSparklineProps) {
  const max = Math.max(...values, 1);
  const points = values
    .map((v, i) => {
      const x = (i / (values.length - 1)) * width;
      const y = height - (v / max) * (height - 2) - 1;
      return `${x},${y}`;
    })
    .join(" ");

  const lastX = width;
  const lastY = height - (values[values.length - 1] / max) * (height - 2) - 1;

  return (
    <div className="inline-flex flex-col items-start ml-2">
      <svg width={width} height={height} className="inline-block align-middle">
        <polyline
          points={points}
          fill="none"
          stroke={color}
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          style={{ strokeDasharray: 200, animation: "draw-line 0.8s ease-out forwards" }}
        />
        <circle cx={lastX} cy={lastY} r="2" fill={color} />
      </svg>
      <span className="text-[10px] text-foreground-muted leading-none mt-0.5">Projection 6 sem.</span>
    </div>
  );
}
