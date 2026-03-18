import { useEffect, useState } from "react";
import { Check, AlertTriangle, X } from "lucide-react";

interface ToastProps {
  message: string;
  type?: "success" | "error";
  onClose: () => void;
}

export function Toast({ message, type = "success", onClose }: ToastProps) {
  useEffect(() => {
    const timer = setTimeout(onClose, 3000);
    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <div className="fixed bottom-6 right-6 z-50 animate-slide-in-bottom">
      <div className="flex items-center gap-3 bg-card border border-border rounded-xl px-4 py-3 shadow-elevated">
        {type === "success" ? (
          <Check size={16} className="text-lecko-green shrink-0" />
        ) : (
          <AlertTriangle size={16} className="text-lecko-orange shrink-0" />
        )}
        <span className="text-sm text-foreground-secondary">{message}</span>
        <button
          onClick={onClose}
          className="text-foreground-muted hover:text-foreground transition-colors ml-1"
        >
          <X size={13} />
        </button>
      </div>
    </div>
  );
}

export function useToast() {
  const [toast, setToast] = useState<{ message: string; type?: "success" | "error" } | null>(null);
  const showToast = (message: string, type: "success" | "error" = "success") => setToast({ message, type });
  const hideToast = () => setToast(null);
  return { toast, showToast, hideToast };
}
