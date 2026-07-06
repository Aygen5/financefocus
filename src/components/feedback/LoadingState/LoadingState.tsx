import React from "react";
import { cn } from "@/utils/styles";
import Spinner from "@/components/ui/Spinner";

export interface LoadingStateProps extends React.HTMLAttributes<HTMLDivElement> {
  label?: string;
  size?: "sm" | "md" | "lg";
}

export const LoadingState: React.FC<LoadingStateProps> = ({
  className = "",
  label = "Veriler Yükleniyor...",
  size = "md",
  ...props
}) => {
  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center p-8 md:p-12 text-center select-none",
        className,
      )}
      {...props}
    >
      <Spinner size={size} className="mb-3" />
      {label && (
        <p className="text-xs font-bold text-slate-500 dark:text-slate-400 tracking-wider uppercase">
          {label}
        </p>
      )}
    </div>
  );
};

export default LoadingState;
