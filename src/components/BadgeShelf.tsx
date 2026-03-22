import { motion } from "framer-motion";
import * as LucideIcons from "lucide-react";
import { Lock } from "lucide-react";
import { BadgeDefinition, BADGE_RARITY_CONFIG } from "@/types/badges";

interface BadgeItem extends BadgeDefinition {
  earned: boolean;
  earnedAt?: string;
}

interface BadgeShelfProps {
  badges: BadgeItem[];
  compact?: boolean;
}

function getIcon(name: string) {
  return (LucideIcons as Record<string, any>)[name] ?? LucideIcons.Award;
}

function formatDate(earnedAt: string): string {
  return new Date(earnedAt).toLocaleDateString("fr-FR", {
    day: "numeric",
    month: "short",
  });
}

export default function BadgeShelf({ badges, compact = false }: BadgeShelfProps) {
  if (compact) {
    return <CompactShelf badges={badges} />;
  }
  return <FullShelf badges={badges} />;
}

/* ─── Compact mode (horizontal scroll) ─── */

function CompactShelf({ badges }: { badges: BadgeItem[] }) {
  return (
    <div className="flex gap-2 overflow-x-auto scrollbar-hide">
      {badges.map((badge) => {
        const rarity = BADGE_RARITY_CONFIG[badge.rarity];
        const Icon = getIcon(badge.icon);

        if (!badge.earned) {
          return (
            <div
              key={badge.id}
              title={badge.name}
              className="flex-shrink-0 w-10 h-10 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center opacity-40"
            >
              <Icon size={18} className="text-gray-300" />
            </div>
          );
        }

        return (
          <motion.div
            key={badge.id}
            title={badge.name}
            whileHover={{ scale: 1.1 }}
            className="flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center border-2"
            style={{
              background: `linear-gradient(to bottom right, var(--tw-gradient-stops, ${rarity.borderColor}22, ${rarity.borderColor}11))`,
              borderColor: rarity.borderColor,
            }}
          >
            <Icon size={18} style={{ color: badge.color }} />
          </motion.div>
        );
      })}
    </div>
  );
}

/* ─── Full mode (grid) ─── */

function FullShelf({ badges }: { badges: BadgeItem[] }) {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
      {badges.map((badge, index) => {
        const rarity = BADGE_RARITY_CONFIG[badge.rarity];
        const Icon = getIcon(badge.icon);

        if (!badge.earned) {
          return (
            <motion.div
              key={badge.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.05 * index, duration: 0.3 }}
              className="relative rounded-xl p-3 text-center bg-gray-50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700"
              style={{ minHeight: 120 }}
            >
              {/* Lock overlay */}
              <div className="absolute top-2 right-2">
                <Lock size={10} className="text-gray-400" />
              </div>

              <div className="flex flex-col items-center gap-1.5">
                <div className="w-10 h-10 rounded-full bg-gray-100 dark:bg-gray-700 flex items-center justify-center">
                  <Icon size={24} className="text-gray-300 dark:text-gray-500" />
                </div>
                <span className="font-bold text-[11px] text-gray-400 dark:text-gray-500 leading-tight">
                  {badge.name}
                </span>
                <span className="text-[9px] text-foreground-muted leading-tight">
                  {badge.description}
                </span>
              </div>
            </motion.div>
          );
        }

        return (
          <motion.div
            key={badge.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.05 * index, duration: 0.3 }}
            className={`relative rounded-xl p-3 text-center border-2 bg-gradient-to-br ${rarity.bgGradient}`}
            style={{
              minHeight: 120,
              borderColor: rarity.borderColor,
              boxShadow: `0 0 12px ${rarity.glowColor}`,
            }}
          >
            <div className="flex flex-col items-center gap-1.5">
              <div
                className="w-10 h-10 rounded-full flex items-center justify-center"
                style={{ backgroundColor: `${badge.color}18` }}
              >
                <Icon size={24} style={{ color: badge.color }} />
              </div>
              <span className="font-bold text-[11px] leading-tight">
                {badge.name}
              </span>
              {badge.earnedAt && (
                <span className="text-[9px] text-foreground-muted leading-tight">
                  Obtenu le {formatDate(badge.earnedAt)}
                </span>
              )}
            </div>
          </motion.div>
        );
      })}
    </div>
  );
}
