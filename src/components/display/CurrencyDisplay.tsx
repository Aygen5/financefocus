import React from "react";
import { formatCurrency } from "@/utils/financial";

export interface CurrencyDisplayProps {
  amount: number;
  currency?: string;
  className?: string;
  colored?: boolean;
  type?: "income" | "expense" | "neutral";
  size?: "sm" | "md" | "lg" | "xl";
}

const CurrencyDisplay: React.FC<CurrencyDisplayProps> = ({
  amount,
  currency = "TRY",
  className = "",
  colored = false,
  type = "neutral",
  size = "md",
}) => {
  const formatted = formatCurrency(amount, currency);

  // Renk kodlaması (Gelir = Yeşil, Gider = Kırmızı)
  const getColors = () => {
    if (!colored) return "text-slate-800 dark:text-slate-100";
    if (type === "income" || (type === "neutral" && amount > 0)) {
      return "text-emerald-600 dark:text-emerald-400 font-semibold";
    }
    if (type === "expense" || (type === "neutral" && amount < 0)) {
      return "text-red-600 dark:text-red-400 font-semibold";
    }
    return "text-slate-700 dark:text-slate-300";
  };

  const sizes = {
    sm: "text-xs",
    md: "text-sm",
    lg: "text-base font-semibold",
    xl: "text-xl font-bold tracking-tight",
  };

  const prefix = colored && amount > 0 && type !== "expense" ? "+" : "";

  return (
    <span className={`${getColors()} ${sizes[size]} ${className}`}>
      {prefix}
      {formatted}
    </span>
  );
};

export default CurrencyDisplay;
