import {
  ResponsiveContainer,
  RadarChart as RechartsRadarChart,
  PolarGrid,
  PolarAngleAxis,
  Radar,
} from "recharts";

interface RadarChartProps {
  scores: Record<string, number>;
  domainLabels: Record<string, string>;
}

interface RadarDataPoint {
  domain: string;
  label: string;
  score: number;
}

export default function RadarChart({ scores, domainLabels }: RadarChartProps) {
  const data: RadarDataPoint[] = Object.entries(scores).map(
    ([domain, score]) => ({
      domain,
      label: domainLabels[domain] ?? domain,
      score,
    })
  );

  return (
    <div className="w-full" style={{ minHeight: 300 }}>
      <ResponsiveContainer width="100%" height={300}>
        <RechartsRadarChart cx="50%" cy="50%" outerRadius="70%" data={data}>
          <PolarGrid stroke="rgba(255,255,255,0.1)" />
          <PolarAngleAxis
            dataKey="label"
            tick={{
              fill: "#8A8AA3",
              fontSize: 12,
              fontWeight: 500,
            }}
          />
          <Radar
            name="Score"
            dataKey="score"
            stroke="#8B5CF6"
            fill="#8B5CF6"
            fillOpacity={0.2}
            strokeWidth={2}
          />
        </RechartsRadarChart>
      </ResponsiveContainer>
    </div>
  );
}
