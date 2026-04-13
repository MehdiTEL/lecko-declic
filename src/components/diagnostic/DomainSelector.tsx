import { Check } from "lucide-react";
import {
  FileText,
  MessageSquare,
  Database,
  Workflow,
  Palette,
  Bot,
  HelpCircle,
  BarChart3,
  Globe,
  Shield,
  Zap,
  Users,
  Settings,
  Lightbulb,
  type LucideIcon,
} from "lucide-react";
import { cn } from "@/lib/utils";
import type { Domaine, DomaineId } from "@/types/diagnostic";

const iconMap: Record<string, LucideIcon> = {
  FileText,
  "file-text": FileText,
  MessageSquare,
  "message-square": MessageSquare,
  Database,
  database: Database,
  Workflow,
  workflow: Workflow,
  Palette,
  palette: Palette,
  Bot,
  bot: Bot,
  BarChart3,
  "bar-chart-3": BarChart3,
  Globe,
  globe: Globe,
  Shield,
  shield: Shield,
  Zap,
  zap: Zap,
  Users,
  users: Users,
  Settings,
  settings: Settings,
  Lightbulb,
  lightbulb: Lightbulb,
};

interface DomainSelectorProps {
  domains: Domaine[];
  selected: DomaineId[];
  onToggle: (id: DomaineId) => void;
}

export default function DomainSelector({
  domains,
  selected,
  onToggle,
}: DomainSelectorProps) {
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
      {domains.map((domain) => {
        const isSelected = selected.includes(domain.id);
        const IconComponent = iconMap[domain.icone] ?? HelpCircle;

        return (
          <button
            key={domain.id}
            type="button"
            onClick={() => onToggle(domain.id)}
            className={cn(
              "relative bg-white/[0.03] border rounded-2xl p-5 cursor-pointer text-left transition-all duration-200",
              isSelected
                ? "border-violet-500/50 bg-violet-500/[0.08] shadow-[0_0_20px_rgba(139,92,246,0.1)]"
                : "border-white/[0.06] hover:border-white/[0.12]"
            )}
          >
            {/* Checkmark circle */}
            <div
              className={cn(
                "absolute top-3 right-3 w-6 h-6 rounded-full flex items-center justify-center transition-all duration-200",
                isSelected
                  ? "bg-violet-500 text-white"
                  : "border border-white/[0.12] bg-white/[0.03]"
              )}
            >
              {isSelected && <Check className="w-3.5 h-3.5" />}
            </div>

            {/* Icon */}
            <div className="mb-3">
              <IconComponent
                className="w-7 h-7"
                style={{ color: domain.couleur }}
              />
            </div>

            {/* Title */}
            <h3 className="text-white font-semibold text-sm sm:text-base mb-1">
              {domain.titre}
            </h3>

            {/* Description */}
            <p className="text-[#8A8AA3] text-sm leading-relaxed">
              {domain.description}
            </p>
          </button>
        );
      })}
    </div>
  );
}
