import { motion } from "framer-motion";

interface KPICardProps {
  value: number;
  label: string;
  suffix?: string;
  icon?: React.ReactNode;
  delay?: number;
}

export default function KPICard({ value, label, suffix = "", icon, delay = 0 }: KPICardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, delay }}
      className="lecko-card p-5 relative overflow-hidden"
    >
      {icon && (
        <div className="absolute top-4 right-4 text-foreground-muted opacity-40">
          {icon}
        </div>
      )}
      <p className="label-uppercase mb-2 text-[11px]">{label}</p>
      <span className="text-3xl font-bold text-foreground">
        {value}{suffix}
      </span>
    </motion.div>
  );
}
