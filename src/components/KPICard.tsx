import { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { TrendingUp } from "lucide-react";

interface KPICardProps {
  value: number;
  label: string;
  suffix?: string;
  icon?: React.ReactNode;
  delay?: number;
  subtext?: string;
}

/** Animated count-up hook with ease-out cubic */
function useCountUp(target: number, duration = 1200, delay = 0): number {
  const [current, setCurrent] = useState(0);
  const rafRef = useRef<number | null>(null);
  const startTimeRef = useRef<number | null>(null);

  useEffect(() => {
    const timeout = setTimeout(() => {
      startTimeRef.current = null;
      const animate = (timestamp: number) => {
        if (!startTimeRef.current) startTimeRef.current = timestamp;
        const elapsed = timestamp - startTimeRef.current;
        const progress = Math.min(elapsed / duration, 1);
        const eased = 1 - Math.pow(1 - progress, 3);
        // Preserve one decimal if target has decimals
        const isDecimal = target % 1 !== 0;
        setCurrent(isDecimal ? Math.round(target * eased * 10) / 10 : Math.round(target * eased));
        if (progress < 1) {
          rafRef.current = requestAnimationFrame(animate);
        }
      };
      rafRef.current = requestAnimationFrame(animate);
    }, delay * 1000);

    return () => {
      clearTimeout(timeout);
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [target, duration, delay]);

  return current;
}

export default function KPICard({ value, label, suffix = "", icon, delay = 0, subtext }: KPICardProps) {
  const animatedValue = useCountUp(value, 1200, delay);

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, delay }}
      className="brand-card p-6 relative overflow-hidden group"
    >
      {/* Subtle trend indicator */}
      {value > 0 && (
        <TrendingUp
          size={16}
          className="absolute top-4 right-4 text-gr33t-500 opacity-[0.25]"
          strokeWidth={1.5}
        />
      )}

      {icon && (
        <div className="w-10 h-10 rounded-2xl bg-primary/8 flex items-center justify-center mb-3 text-primary">
          {icon}
        </div>
      )}
      <p className="text-xs font-semibold uppercase tracking-widest text-foreground-muted mb-2">{label}</p>
      <motion.span
        initial={{ scale: 1 }}
        animate={{ scale: [1, 1.05, 1] }}
        transition={{ duration: 0.15, delay: delay + 1.2 }}
        className="font-heading text-4xl font-bold text-foreground inline-block"
      >
        {animatedValue}{suffix}
      </motion.span>
      {subtext && (
        <p className="text-xs text-foreground-muted mt-1.5">{subtext}</p>
      )}
    </motion.div>
  );
}
