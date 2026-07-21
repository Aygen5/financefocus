import React from "react";
import { TrendingUp, TrendingDown, Minus } from "lucide-react";
import { cn } from "@/utils/styles";

export interface PercentageDisplayProps extends React.HTMLAttributes<HTMLSpanElement> {
  value: number;
  colored?: boolean;
  showIcon?: boolean;
  size?: "sm" | "md";
}

export const PercentageDisplay: React.FC<PercentageDisplayProps> = ({
  className = "",
  value,
  colored = true,
  showIcon = true,
  size = "md",
  ...props
}) => {
  const isPositive = value > 0;
  const isNegative = value < 0;
  const isZero = value === 0;

  const getColors = () => {
    if (!colored) return "text-slate-800 dark:text-slate-100";
    if (isPositive)
      return "bg-emerald-50 dark:bg-emerald-950/20 text-emerald-600 dark:text-emerald-450";
    if (isNegative) return "bg-red-50 dark:bg-red-950/20 text-red-650 dark:text-red-450";
    return "bg-slate-550 dark:bg-slate-800 text-slate-500";
  };

  const sizes = {
    sm: "px-1.5 py-0.5 text-[10px] font-bold rounded-lg gap-0.5",
    md: "px-2 py-1 text-xs font-bold rounded-xl gap-1",
  };

  return (
    <span
      className={cn(
        "inline-flex items-center select-none font-bold",
        getColors(),
        sizes[size],
        className,
      )}
      {...props}
    >
      {showIcon && (
        <>
          {isPositive && <TrendingUp size={size === "sm" ? 10 : 12} />}
          {isNegative && <TrendingDown size={size === "sm" ? 10 : 12} />}
          {isZero && <Minus size={size === "sm" ? 10 : 12} />}
        </>
      )}
      <span>
        {isPositive ? "+" : ""}
        {value.toFixed(1)}%
      </span>
    </span>
  );
};

export default PercentageDisplay;
