import React from "react";
import { calculatePercentage } from "@/utils/financial";

export interface ProgressBarProps {
  value: number;
  max: number;
  showPercentage?: boolean;
  variant?: "brand" | "success" | "danger" | "warning";
  className?: string;
}

const ProgressBar: React.FC<ProgressBarProps> = ({
  value,
  max,
  showPercentage = false,
  variant = "brand",
  className = "",
}) => {
  const percentage = Math.min(calculatePercentage(value, max), 100);

  const colors = {
    brand: "bg-brand-500",
    success: "bg-emerald-500",
    danger: "bg-red-500",
    warning: "bg-amber-500",
  };

  const trackColor = "bg-slate-100 dark:bg-slate-800";

  return (
    <div className={`w-full space-y-1.5 ${className}`}>
      {showPercentage && (
        <div className="flex justify-between text-[11px] font-bold text-slate-500 dark:text-slate-400 select-none">
          <span>
            {value} / {max}
          </span>
          <span>%{percentage}</span>
        </div>
      )}
      <div className={`h-2 w-full rounded-full overflow-hidden ${trackColor}`}>
        <div
          className={`h-full rounded-full transition-all duration-500 ease-out ${colors[variant]}`}
          style={{ width: `${percentage}%` }}
          role="progressbar"
          aria-valuenow={value}
          aria-valuemin={0}
          aria-valuemax={max}
        />
      </div>
    </div>
  );
};

export default ProgressBar;
