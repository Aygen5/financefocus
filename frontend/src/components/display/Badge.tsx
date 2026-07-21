import React from "react";

export interface BadgeProps {
  children: React.ReactNode;
  variant?: "brand" | "success" | "danger" | "warning" | "info" | "neutral";
  size?: "sm" | "md";
  className?: string;
}

const Badge: React.FC<BadgeProps> = ({
  children,
  variant = "neutral",
  size = "md",
  className = "",
}) => {
  const baseStyles =
    "inline-flex items-center justify-center font-bold rounded-lg tracking-wide uppercase select-none";

  const variants = {
    brand: "bg-brand-50 dark:bg-brand-950/20 text-brand-600 dark:text-brand-400",
    success: "bg-emerald-50 dark:bg-emerald-950/20 text-emerald-600 dark:text-emerald-400",
    danger: "bg-red-50 dark:bg-red-950/20 text-red-600 dark:text-red-400",
    warning: "bg-amber-50 dark:bg-amber-950/20 text-amber-600 dark:text-amber-400",
    info: "bg-blue-50 dark:bg-blue-950/20 text-blue-600 dark:text-blue-400",
    neutral: "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400",
  };

  const sizes = {
    sm: "px-1.5 py-0.5 text-[10px]",
    md: "px-2.5 py-1 text-[11px]",
  };

  return (
    <span className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`}>
      {children}
    </span>
  );
};

export default Badge;
