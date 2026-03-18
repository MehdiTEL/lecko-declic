import { useEffect, useState } from "react";
import { CheckCircle, Copy, X } from "lucide-react";

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
    <div className="fixed bottom-20 left-1/2 -translate-x-1/2 z-50 animate-slide-in-bottom">
      <div className="flex items-center gap-3 bg-card border border-border rounded-xl px-4 py-3 shadow-card-hover">
        {type === "success" ? (
          <CheckCircle size={18} className="text-lecko-green shrink-0" />
        ) : (
          <X size={18} className="text-destructive shrink-0" />
        )}
        <span className="text-sm font-medium text-foreground">{message}</span>
        <button onClick={onClose} className="text-foreground-muted hover:text-foreground ml-1">
          <X size={14} />
        </button>
      </div>
    </div>
  );
}

export function useToast() {
  const [toast, setToast] = useState<{ message: string; type?: "success" | "error" } | null>(null);

  const showToast = (message: string, type: "success" | "error" = "success") => {
    setToast({ message, type });
  };

  const hideToast = () => setToast(null);

  return { toast, showToast, hideToast };
}
