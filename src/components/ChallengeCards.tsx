import { motion } from "framer-motion";
import * as LucideIcons from "lucide-react";
import { CheckCircle } from "lucide-react";
import { ActiveChallenge, CHALLENGE_DIFFICULTY_CONFIG } from "@/types/badges";
import { CHALLENGE_CATALOG } from "@/data/challengeCatalog";

interface ChallengeCardsProps {
  challenges: ActiveChallenge[];
}

function getIcon(name: string) {
  return (LucideIcons as Record<string, any>)[name] ?? LucideIcons.Award;
}

function getDaysRemaining(expiresAt: string): number {
  return Math.max(
    0,
    Math.ceil((new Date(expiresAt).getTime() - Date.now()) / (1000 * 60 * 60 * 24))
  );
}

export default function ChallengeCards({ challenges }: ChallengeCardsProps) {
  if (challenges.length === 0) {
    return (
      <div className="flex items-center justify-center py-8">
        <p className="text-foreground-muted text-sm text-center">
          Vos d&eacute;fis appara&icirc;tront apr&egrave;s votre premier diagnostic.
        </p>
      </div>
    );
  }

  const displayed = challenges.slice(0, 3);

  return (
    <div className="flex flex-col gap-3">
      {displayed.map((challenge, index) => {
        const definition = CHALLENGE_CATALOG.find((c) => c.id === challenge.challengeId);
        if (!definition) return null;

        const diffConfig = CHALLENGE_DIFFICULTY_CONFIG[definition.difficulty];
        const Icon = getIcon(definition.icon);
        const progressPercent = Math.min(
          100,
          (challenge.currentProgress / definition.targetCount) * 100
        );
        const daysLeft = getDaysRemaining(challenge.expiresAt);
        const isCompleted = challenge.status === "completed";

        return (
          <motion.div
            key={challenge.challengeId}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.05 * index, duration: 0.3 }}
            className="lecko-card p-4 flex items-center gap-4"
          >
            {/* Icon */}
            <div
              className="flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center"
              style={{ backgroundColor: `${definition.color}1A` }}
            >
              <Icon size={20} style={{ color: definition.color }} />
            </div>

            {/* Center content */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="font-bold text-[14px] leading-tight">
                  {definition.title}
                </span>
                <span
                  className="inline-block rounded-full px-2 py-0.5 text-[10px] font-medium"
                  style={{
                    color: diffConfig.color,
                    backgroundColor: diffConfig.bgLight,
                  }}
                >
                  {diffConfig.label}
                </span>
              </div>

              <p className="text-[12px] text-foreground-secondary mt-0.5 leading-snug truncate">
                {definition.description}
              </p>

              {/* Progress bar */}
              <div className="mt-2">
                <div className="h-1 bg-muted rounded-full overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all duration-500"
                    style={{
                      width: `${progressPercent}%`,
                      backgroundColor: definition.color,
                    }}
                  />
                </div>
                <span className="text-[10px] text-foreground-muted mt-0.5 block">
                  {challenge.currentProgress}/{definition.targetCount} {definition.unit}
                </span>
              </div>
            </div>

            {/* Right status */}
            <div className="flex-shrink-0 text-right">
              {isCompleted ? (
                <div className="flex flex-col items-center gap-0.5">
                  <CheckCircle size={18} className="text-green-500" />
                  <span className="text-[10px] font-bold text-green-500">
                    Compl&eacute;t&eacute;
                  </span>
                </div>
              ) : (
                <span
                  className={`text-[10px] ${
                    daysLeft < 2 ? "text-red-500" : "text-foreground-muted"
                  }`}
                >
                  {daysLeft}j restant{daysLeft !== 1 ? "s" : ""}
                </span>
              )}
            </div>
          </motion.div>
        );
      })}
    </div>
  );
}
