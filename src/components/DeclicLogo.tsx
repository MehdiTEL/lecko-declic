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

// Orange dot position — calibrated to the "i" in DÉCLIC
// The "i" stem center is at ~74.5% horizontal in the original PNG (2222x612)
// In dark mode the dot drops to the bottom of the letter
const DOT = {
  sm: { size: 5, left: "74.5%", topDark: "75%" },
  md: { size: 7, left: "74.5%", topDark: "75%" },
  lg: { size: 10, left: "74.5%", topDark: "75%" },
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
