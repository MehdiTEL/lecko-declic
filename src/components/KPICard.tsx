import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";

interface KPICardProps {
  value: number;
  label: string;
  suffix?: string;
  color?: "blue" | "green" | "orange";
  delay?: number;
}

const colorMap = {
  blue: "text-lecko-blue",
  green: "text-lecko-green",
  orange: "text-lecko-orange",
};

export default function KPICard({ value, label, suffix = "", color = "blue", delay = 0 }: KPICardProps) {
  const [displayed, setDisplayed] = useState(0);
  const rafRef = useRef<number | null>(null);

  useEffect(() => {
    const timer = setTimeout(() => {
      const start = performance.now();
      const duration = 1200;

      const animate = (now: number) => {
        const elapsed = now - start;
        const progress = Math.min(elapsed / duration, 1);
        const eased = 1 - Math.pow(1 - progress, 3);
        setDisplayed(Math.round(eased * value));
        if (progress < 1) {
          rafRef.current = requestAnimationFrame(animate);
        }
      };
      rafRef.current = requestAnimationFrame(animate);
    }, delay * 1000);

    return () => {
      clearTimeout(timer);
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [value, delay]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay }}
      className="lecko-card p-5 flex flex-col items-center text-center gap-1"
    >
      <span className={`text-4xl font-bold ${colorMap[color]}`}>
        {displayed}{suffix}
      </span>
      <span className="text-sm text-foreground-muted font-medium">{label}</span>
    </motion.div>
  );
}
