/**
 * DÉCLIC logo component — uses the official PNG logo.
 * The logo features blue geometric text with an orange dot on the "i".
 */

interface DeclicLogoProps {
  size?: "sm" | "md" | "lg";
  className?: string;
}

const HEIGHTS = {
  sm: 32,
  md: 48,
  lg: 72,
};

// Dot size and position ratios relative to logo height
// The "i" dot sits at ~73% from left and ~18% from top in the original logo
const DOT_CONFIG = {
  sm: { size: 4, topLight: "15%", topDark: "62%", left: "73%" },
  md: { size: 6, topLight: "15%", topDark: "62%", left: "73%" },
  lg: { size: 8, topLight: "15%", topDark: "62%", left: "73%" },
};

export default function DeclicLogo({ size = "md", className = "" }: DeclicLogoProps) {
  const h = HEIGHTS[size];
  const dot = DOT_CONFIG[size];

  return (
    <div className={`relative inline-block ${className}`} style={{ height: `${h}px` }}>
      <img
        src="/logo-declic.png"
        alt="DÉCLIC"
        height={h}
        className="dark:brightness-0 dark:invert"
        style={{ height: `${h}px`, width: "auto", objectFit: "contain" }}
      />
      {/* Orange dot overlay — in dark mode it "falls" to the bottom of the i like a switch turned off */}
      <div
        className="absolute rounded-full pointer-events-none transition-all duration-500 ease-in-out dark:translate-y-0"
        style={{
          width: `${dot.size}px`,
          height: `${dot.size}px`,
          backgroundColor: "#F59E0B",
          left: dot.left,
          top: `var(--dot-top, ${dot.topLight})`,
        }}
      />
      <style>{`
        .dark [data-dot] { --dot-top: ${dot.topDark}; }
      `}</style>
      {/* Second dot using CSS for dark mode position switch */}
      <div
        data-dot
        className="absolute rounded-full pointer-events-none opacity-0 dark:opacity-100 transition-all duration-500"
        style={{
          width: `${dot.size}px`,
          height: `${dot.size}px`,
          backgroundColor: "#F59E0B",
          left: dot.left,
          top: dot.topDark,
        }}
      />
    </div>
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
