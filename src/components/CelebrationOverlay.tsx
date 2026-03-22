import { useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import * as LucideIcons from "lucide-react";
import { BADGE_RARITY_CONFIG, type BadgeRarity } from "@/types/badges";

interface CelebrationOverlayProps {
  celebration: {
    type: "task_done" | "level_up" | "streak" | "badge_earned" | "challenge_completed";
    message: string;
    level?: { emoji: string; label: string; color: string; description: string };
    streakCount?: number;
    badge?: { id: string; name: string; description: string; icon: string; color: string; rarity: BadgeRarity };
  } | null;
  onDismiss: () => void;
}

const CONFETTI_COLORS = ["#2563EB", "#F59E0B", "#10B981", "#7C3AED", "#EF4444"];

function ConfettiPiece({ index }: { index: number }) {
  const left = Math.random() * 100;
  const color = CONFETTI_COLORS[index % CONFETTI_COLORS.length];
  const duration = 2 + Math.random() * 2;
  const delay = Math.random() * 0.5;
  const size = 6 + Math.random() * 6;

  return (
    <div
      style={{
        position: "absolute",
        left: `${left}%`,
        top: 0,
        width: size,
        height: size,
        backgroundColor: color,
        borderRadius: Math.random() > 0.5 ? "50%" : "2px",
        animation: `confetti-fall ${duration}s ${delay}s ease-in forwards`,
        opacity: 0,
        pointerEvents: "none",
      }}
    />
  );
}

export default function CelebrationOverlay({
  celebration,
  onDismiss,
}: CelebrationOverlayProps) {
  useEffect(() => {
    if (!celebration) return;

    const durations: Record<string, number> = {
      task_done: 2500,
      level_up: 4000,
      streak: 3000,
      badge_earned: 4000,
      challenge_completed: 3000,
    };

    const timer = setTimeout(onDismiss, durations[celebration.type] ?? 3000);
    return () => clearTimeout(timer);
  }, [celebration, onDismiss]);

  if (!celebration) return null;

  return (
    <>
      {/* Inject confetti keyframes once */}
      <style>{`
        @keyframes confetti-fall {
          0% { transform: translateY(-100vh) rotate(0deg); opacity: 1; }
          100% { transform: translateY(100vh) rotate(720deg); opacity: 0; }
        }
      `}</style>

      <AnimatePresence>
        {celebration.type === "task_done" && (
          <motion.div
            key="task_done"
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 40 }}
            transition={{ duration: 0.35, ease: "easeOut" }}
            style={{
              position: "fixed",
              bottom: 24,
              right: 24,
              zIndex: 9999,
              display: "flex",
              alignItems: "center",
              gap: 10,
              padding: "12px 20px",
              borderRadius: 12,
              backgroundColor: "#10B981",
              color: "#fff",
              fontWeight: 600,
              fontSize: 14,
              boxShadow: "0 4px 20px rgba(16,185,129,0.35)",
              pointerEvents: "auto",
              cursor: "pointer",
            }}
            onClick={onDismiss}
          >
            <span style={{ fontSize: 18 }}>&#10003;</span>
            <span>{celebration.message}</span>
          </motion.div>
        )}

        {celebration.type === "level_up" && (
          <motion.div
            key="level_up"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            onClick={onDismiss}
            style={{
              position: "fixed",
              inset: 0,
              zIndex: 9999,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              backgroundColor: "rgba(0,0,0,0.55)",
              cursor: "pointer",
              overflow: "hidden",
            }}
          >
            {/* Confetti */}
            {Array.from({ length: 15 }).map((_, i) => (
              <ConfettiPiece key={i} index={i} />
            ))}

            {/* Emoji */}
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: [0, 1.2, 1.0] }}
              transition={{ duration: 0.5, times: [0, 0.6, 1], ease: "easeOut" }}
              style={{ fontSize: 72, lineHeight: 1, marginBottom: 16 }}
            >
              {celebration.level?.emoji}
            </motion.div>

            {/* Title */}
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.35 }}
              style={{
                fontWeight: 700,
                fontSize: 24,
                color: "#fff",
                marginBottom: 8,
              }}
            >
              Niveau atteint !
            </motion.div>

            {/* Level label */}
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.45, duration: 0.35 }}
              style={{
                fontWeight: 700,
                fontSize: 20,
                color: celebration.level?.color ?? "#fff",
                marginBottom: 6,
              }}
            >
              {celebration.level?.label}
            </motion.div>

            {/* Description */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6, duration: 0.35 }}
              style={{
                fontSize: 15,
                color: "rgba(255,255,255,0.85)",
                maxWidth: 360,
                textAlign: "center",
                lineHeight: 1.5,
              }}
            >
              {celebration.level?.description}
            </motion.div>
          </motion.div>
        )}

        {celebration.type === "streak" && (
          <motion.div
            key="streak"
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 40 }}
            transition={{ duration: 0.35, ease: "easeOut" }}
            style={{
              position: "fixed",
              bottom: 24,
              right: 24,
              zIndex: 9999,
              display: "flex",
              alignItems: "center",
              gap: 10,
              padding: "12px 20px",
              borderRadius: 12,
              backgroundColor: "#F59E0B",
              color: "#fff",
              fontWeight: 600,
              fontSize: 14,
              boxShadow: "0 4px 20px rgba(245,158,11,0.35)",
              pointerEvents: "auto",
              cursor: "pointer",
            }}
            onClick={onDismiss}
          >
            <span style={{ fontSize: 18 }}>&#128293;</span>
            <span>
              {celebration.streakCount} jours d'affil&eacute;e !
            </span>
          </motion.div>
        )}
        {celebration.type === "badge_earned" && celebration.badge && (() => {
          const rarityConf = BADGE_RARITY_CONFIG[celebration.badge!.rarity];
          const IconComp = (LucideIcons as Record<string, React.ComponentType<{ size?: number; strokeWidth?: number; style?: React.CSSProperties }>>)[celebration.badge!.icon] ?? LucideIcons.Award;
          return (
            <motion.div
              key="badge_earned"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              onClick={onDismiss}
              style={{
                position: "fixed",
                inset: 0,
                zIndex: 9999,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                backgroundColor: "rgba(0,0,0,0.4)",
                cursor: "pointer",
              }}
            >
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.35, ease: "easeOut" }}
                onClick={(e) => e.stopPropagation()}
                className="bg-card rounded-2xl shadow-elevated p-6 max-w-xs w-full mx-4 text-center"
              >
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: [0, 1.15, 1] }}
                  transition={{ duration: 0.5, times: [0, 0.6, 1] }}
                  className="w-16 h-16 rounded-full mx-auto mb-4 flex items-center justify-center"
                  style={{
                    border: `2px solid ${rarityConf.borderColor}`,
                    boxShadow: `0 0 20px ${rarityConf.glowColor}`,
                    backgroundColor: rarityConf.glowColor,
                  }}
                >
                  <IconComp size={28} style={{ color: celebration.badge!.color }} strokeWidth={1.5} />
                </motion.div>
                <p className="text-xs font-bold text-foreground-muted uppercase tracking-wider mb-1">
                  Badge débloqué
                </p>
                <p className="font-heading text-lg font-bold text-foreground mb-1">
                  {celebration.badge!.name}
                </p>
                <p className="text-xs text-foreground-secondary mb-3">
                  {celebration.badge!.description}
                </p>
                <span
                  className="inline-block text-[10px] font-bold px-2.5 py-0.5 rounded-full"
                  style={{
                    backgroundColor: rarityConf.glowColor || "hsl(var(--muted))",
                    color: rarityConf.borderColor,
                    border: `1px solid ${rarityConf.borderColor}`,
                  }}
                >
                  {rarityConf.label}
                </span>
              </motion.div>
            </motion.div>
          );
        })()}

        {celebration.type === "challenge_completed" && (
          <motion.div
            key="challenge_completed"
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 40 }}
            transition={{ duration: 0.35, ease: "easeOut" }}
            style={{
              position: "fixed",
              bottom: 24,
              right: 24,
              zIndex: 9999,
              display: "flex",
              alignItems: "center",
              gap: 10,
              padding: "12px 20px",
              borderRadius: 12,
              backgroundColor: "#10B981",
              color: "#fff",
              fontWeight: 600,
              fontSize: 14,
              boxShadow: "0 4px 20px rgba(16,185,129,0.35)",
              pointerEvents: "auto",
              cursor: "pointer",
            }}
            onClick={onDismiss}
          >
            <LucideIcons.Trophy size={18} />
            <span>{celebration.message}</span>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
