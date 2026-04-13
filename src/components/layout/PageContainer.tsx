import type { ReactNode } from "react";

interface PageContainerProps {
  children: ReactNode;
  className?: string;
}

export default function PageContainer({
  children,
  className = "",
}: PageContainerProps) {
  return (
    <div
      className={`max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-20 ${className}`.trim()}
    >
      {children}
    </div>
  );
}
