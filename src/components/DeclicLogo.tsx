/**
 * DÉCLIC logo component.
 * Renders the logo as SVG text with the signature orange dot on the "i".
 * Uses the brand font and colors for pixel-perfect rendering at any size.
 */

interface DeclicLogoProps {
  size?: "sm" | "md" | "lg";
  variant?: "color" | "white";
  className?: string;
}

const SIZES = {
  sm: { h: 22, fs: 18, dot: 3.5, dotY: 2 },
  md: { h: 30, fs: 24, dot: 4.5, dotY: 2.5 },
  lg: { h: 44, fs: 36, dot: 6, dotY: 3 },
};

export default function DeclicLogo({ size = "md", variant = "color", className = "" }: DeclicLogoProps) {
  const { h, fs, dot, dotY } = SIZES[size];
  const textColor = variant === "white" ? "#FFFFFF" : "#2563EB";

  return (
    <svg
      height={h}
      viewBox={`0 0 ${fs * 4.2} ${h}`}
      className={className}
      aria-label="DÉCLIC"
      role="img"
    >
      <text
        x="0"
        y={h * 0.78}
        fontFamily="Inter, system-ui, sans-serif"
        fontWeight="800"
        fontSize={fs}
        fill={textColor}
        letterSpacing="-0.02em"
      >
        DÉCLIC
      </text>
      {/* Signature orange dot on the "i" */}
      <circle
        cx={fs * 3.28}
        cy={dotY}
        r={dot}
        fill="#F59E0B"
      />
    </svg>
  );
}

export function ByLecko({ className = "" }: { className?: string }) {
  return (
    <span className={`text-[10px] font-medium text-foreground-muted tracking-wide ${className}`}>
      by{" "}
      <a
        href="https://lecko.fr"
        target="_blank"
        rel="noopener noreferrer"
        className="hover:text-primary transition-colors"
      >
        Lecko
      </a>
    </span>
  );
}
