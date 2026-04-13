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

// Orange dot — matches the exact size of the dot in the PNG (12% of logo height)
// Centered on the "i" stem at 74.5% horizontal
const DOT = {
  sm: { size: 4, left: "74.5%", topDark: "76%" },   // 32px × 12% ≈ 4px
  md: { size: 6, left: "74.5%", topDark: "76%" },   // 48px × 12% ≈ 6px
  lg: { size: 9, left: "74.5%", topDark: "76%" },   // 72px × 12% ≈ 9px
};

export default function DeclicLogo({ size = "md", className = "" }: DeclicLogoProps) {
  const h = HEIGHTS[size];
  const d = DOT[size];

  return (
    <div className={`relative inline-block ${className}`} style={{ height: `${h}px` }}>
      <img
        src="/logo-declic.png"
        alt="DÉCLIC"
        height={h}
        className="dark:brightness-0 dark:invert"
        style={{ height: `${h}px`, width: "auto", objectFit: "contain" }}
      />
      {/* Orange dot — only visible in dark mode, centered on the "i" stem */}
      <div
        className="absolute rounded-full pointer-events-none opacity-0 dark:opacity-100 transition-all duration-700 ease-[cubic-bezier(0.34,1.56,0.64,1)]"
        style={{
          width: `${d.size}px`,
          height: `${d.size}px`,
          backgroundColor: "#F59E0B",
          left: d.left,
          top: d.topDark,
          transform: "translateX(-50%)",
          boxShadow: "0 0 6px rgba(245, 158, 11, 0.4)",
        }}
      />
    </div>
  );
}

export function BrandTagline({ className = "" }: { className?: string }) {
  return (
    <span className={`text-[10px] font-medium text-foreground-muted tracking-widest uppercase ${className}`}>
      Cartographie IA
    </span>
  );
}
