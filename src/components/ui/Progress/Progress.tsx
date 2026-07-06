import React from "react";
import { cn } from "@/utils/styles";

export interface ProgressProps extends React.HTMLAttributes<HTMLDivElement> {
  value: number;
  max?: number;
  variant?: "primary" | "brand" | "success" | "warning" | "danger";
  size?: "sm" | "md" | "lg";
}

export const Progress: React.FC<ProgressProps> = ({
  className = "",
  value,
  max = 100,
  variant = "primary",
  size = "md",
  ...props
}) => {
  const percentage = Math.min(Math.max((value / max) * 100, 0), 100);

  const variants = {
    primary: "bg-primary dark:bg-brand-500",
    brand: "bg-blue-600 dark:bg-brand-400",
    success: "bg-emerald-500 dark:bg-emerald-450",
    warning: "bg-amber-500 dark:bg-amber-450",
    danger: "bg-red-600 dark:bg-red-500",
  };

  const sizes = {
    sm: "h-1.5",
    md: "h-2.5",
    lg: "h-4",
  };

  return (
    <div
      className={cn(
        "w-full bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden select-none",
        sizes[size],
        className,
      )}
      role="progressbar"
      aria-valuenow={value}
      aria-valuemin={0}
      aria-valuemax={max}
      {...props}
    >
      <div
        className={cn(
          "h-full rounded-full transition-all duration-350 ease-out",
          variants[variant],
        )}
        style={{ width: `${percentage}%` }}
      />
    </div>
  );
};

export default Progress;
