interface DecoCornerProps {
  position?: "top-right" | "bottom-left";
  size?: "sm" | "md";
}

export default function DecoCorner({ position = "bottom-left", size = "sm" }: DecoCornerProps) {
  const sizeClass = size === "sm" ? "w-6 h-6" : "w-10 h-10";
  const posClass = position === "top-right"
    ? "absolute top-0 right-0 translate-x-1/3 -translate-y-1/3"
    : "absolute bottom-0 left-0 -translate-x-1/3 translate-y-1/3";

  return (
    <div
      className={`${sizeClass} ${posClass} rounded-lg pointer-events-none`}
      style={{ backgroundColor: "hsl(var(--brand-orange))",  }}
      aria-hidden
    />
  );
}
