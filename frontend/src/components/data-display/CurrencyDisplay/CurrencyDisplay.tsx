import React from "react";
import { formatCurrency } from "@/utils/financial";
import { cn } from "@/utils/styles";

export interface CurrencyDisplayProps {
  amount: number;
  currency?: string;
  className?: string;
  colored?: boolean;
  type?: "income" | "expense" | "neutral";
  size?: "sm" | "md" | "lg" | "xl";
}

export const CurrencyDisplay: React.FC<CurrencyDisplayProps> = ({
  amount,
  currency = "TRY",
  className = "",
  colored = false,
  type = "neutral",
  size = "md",
}) => {
  const formatted = formatCurrency(amount, currency);

  const getColors = () => {
    if (!colored) return "text-slate-800 dark:text-slate-100";
    if (type === "income" || (type === "neutral" && amount > 0)) {
      return "text-emerald-600 dark:text-emerald-450 font-bold";
    }
    if (type === "expense" || (type === "neutral" && amount < 0)) {
      return "text-red-650 dark:text-red-450 font-bold";
    }
    return "text-slate-700 dark:text-slate-300";
  };

  const sizes = {
    sm: "text-xs",
    md: "text-sm",
    lg: "text-base font-bold",
    xl: "text-xl font-extrabold tracking-tight",
  };

  const prefix = colored && amount > 0 && type !== "expense" ? "+" : "";

  return (
    <span className={cn(getColors(), sizes[size], className)}>
      {prefix}
      {formatted}
    </span>
  );
};

export default CurrencyDisplay;
