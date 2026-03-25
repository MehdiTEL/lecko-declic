import { motion } from "framer-motion";
import { TaskStatus } from "@/types/gamification";

interface StatusCircleProps {
  status: TaskStatus;
  onChange: (s: TaskStatus) => void;
}

const NEXT_STATUS: Record<TaskStatus, TaskStatus> = {
  todo: "in_progress",
  in_progress: "done",
  done: "todo",
};

export default function StatusCircle({ status, onChange }: StatusCircleProps) {
  return (
    <motion.div
      role="button"
      tabIndex={0}
      onClick={(e) => { e.stopPropagation(); onChange(NEXT_STATUS[status]); }}
      onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") { e.stopPropagation(); e.preventDefault(); onChange(NEXT_STATUS[status]); } }}
      whileTap={{ scale: 0.9 }}
      animate={status === "done" ? { scale: [0.9, 1.1, 1] } : {}}
      transition={{ duration: 0.3 }}
      className="shrink-0 w-6 h-6 rounded-full border-2 flex items-center justify-center transition-colors cursor-pointer"
      style={{
        borderColor: status === "done" ? "hsl(var(--accent-green-text))" : status === "in_progress" ? "hsl(var(--lecko-blue))" : "hsl(var(--border))",
        backgroundColor: status === "done" ? "hsl(var(--accent-green-text))" : status === "in_progress" ? "hsl(var(--lecko-blue) / 0.12)" : "transparent",
      }}
      title={status === "todo" ? "Marquer en cours" : status === "in_progress" ? "Marquer comme fait" : "Remettre a faire"}
    >
      {status === "done" && (
        <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
          <path d="M2 6l3 3 5-5" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      )}
      {status === "in_progress" && (
        <div className="w-2.5 h-2.5 rounded-full bg-primary animate-pulse" />
      )}
    </motion.div>
  );
}
