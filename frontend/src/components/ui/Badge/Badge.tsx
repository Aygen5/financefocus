import React from "react";
import { cn } from "@/utils/styles";

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: "primary" | "secondary" | "success" | "warning" | "danger" | "neutral" | "brand";
  size?: "sm" | "md";
}

export const Badge: React.FC<BadgeProps> = ({
  className = "",
  variant = "neutral",
  size = "md",
  children,
  ...props
}) => {
  const baseStyles = "inline-flex items-center font-bold rounded-full select-none";

  const variants = {
    primary: "bg-primary/10 text-primary dark:text-brand-400 dark:bg-brand-500/10",
    secondary: "bg-slate-500/10 text-slate-650 dark:text-slate-450",
    success: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-450",
    warning: "bg-amber-500/10 text-amber-600 dark:text-amber-450",
    danger: "bg-red-500/10 text-red-650 dark:text-red-450",
    neutral: "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400",
    brand: "bg-blue-600/10 text-blue-600 dark:text-brand-400 dark:bg-brand-900/20",
  };

  const sizes = {
    sm: "px-2 py-0.5 text-[10px] tracking-wider uppercase",
    md: "px-2.5 py-1 text-xs",
  };

  return (
    <span className={cn(baseStyles, variants[variant], sizes[size], className)} {...props}>
      {children}
    </span>
  );
};

export default Badge;
