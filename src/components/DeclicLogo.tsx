/**
 * DÉCLIC logo component — uses the official PNG logo.
 * The orange dot animates like a switch: top (light) → bottom (dark).
 */
import { motion } from "framer-motion";
import { useTheme } from "@/hooks/useTheme";

interface DeclicLogoProps {
  size?: "sm" | "md" | "lg";
  className?: string;
}

const HEIGHTS = { sm: 32, md: 48, lg: 72 };

// Dot config: size in px, horizontal offset from left edge, vertical % of logo height
const DOT = {
  sm: { size: 5,  left: "73.5%", topLight: "10%", topDark: "76%" },
  md: { size: 8,  left: "73.5%", topLight: "10%", topDark: "76%" },
  lg: { size: 11, left: "73.5%", topLight: "10%", topDark: "76%" },
};

export default function DeclicLogo({ size = "md", className = "" }: DeclicLogoProps) {
  const h = HEIGHTS[size];
  const d = DOT[size];
  const { theme } = useTheme();
  const isDark = theme === "dark";

  return (
    <div className={`relative inline-block ${className}`} style={{ height: `${h}px` }}>
      <img
        src="/logo-declic.png"
        alt="DÉCLIC"
        height={h}
        className="dark:brightness-0 dark:invert"
        style={{ height: `${h}px`, width: "auto", objectFit: "contain" }}
      />
      {/* Orange dot: animates vertically between light (top) and dark (bottom) */}
      <motion.div
        className="absolute rounded-full pointer-events-none"
        animate={{
          top: isDark ? d.topDark : d.topLight,
          opacity: 1,
        }}
        transition={{
          top: { type: "spring", stiffness: 260, damping: 22, mass: 0.8 },
          opacity: { duration: 0.2 },
        }}
        style={{
          width: `${d.size}px`,
          height: `${d.size}px`,
          backgroundColor: "#F59E0B",
          left: d.left,
          boxShadow: isDark ? "0 0 6px rgba(245,158,11,0.5)" : "none",
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
