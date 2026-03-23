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
  md: 44,
  lg: 64,
};

export default function DeclicLogo({ size = "md", className = "" }: DeclicLogoProps) {
  const h = HEIGHTS[size];

  return (
    <img
      src="/logo-declic.png"
      alt="DÉCLIC"
      height={h}
      className={className}
      style={{ height: `${h}px`, width: "auto", objectFit: "contain" }}
    />
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
