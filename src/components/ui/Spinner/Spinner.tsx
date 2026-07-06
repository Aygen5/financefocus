import React from "react";
import { cn } from "@/utils/styles";

export interface SpinnerProps extends React.HTMLAttributes<HTMLDivElement> {
  size?: "sm" | "md" | "lg";
  variant?: "primary" | "brand" | "white" | "slate";
}

export const Spinner: React.FC<SpinnerProps> = ({
  className = "",
  size = "md",
  variant = "primary",
  ...props
}) => {
  const sizes = {
    sm: "h-4 w-4 stroke-[3]",
    md: "h-8 w-8 stroke-[2.5]",
    lg: "h-12 w-12 stroke-[2]",
  };

  const variants = {
    primary: "text-primary dark:text-brand-500",
    brand: "text-blue-600 dark:text-brand-400",
    white: "text-white",
    slate: "text-slate-400 dark:text-slate-600",
  };

  return (
    <div
      className={cn("flex items-center justify-center select-none", className)}
      role="status"
      aria-label="Yükleniyor"
      {...props}
    >
      <svg
        className={cn("animate-spin", sizes[size], variants[variant])}
        fill="none"
        viewBox="0 0 24 24"
        xmlns="http://www.w3.org/2000/svg"
      >
        <circle
          className="opacity-20"
          cx="12"
          cy="12"
          r="10"
          stroke="currentColor"
          strokeWidth="4"
        />
        <path
          className="opacity-90"
          fill="currentColor"
          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
        />
      </svg>
    </div>
  );
};

export default Spinner;
