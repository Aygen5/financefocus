import React from "react";
import { cn } from "@/utils/styles";

export interface SkeletonProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: "text" | "circular" | "rectangular";
}

export const Skeleton: React.FC<SkeletonProps> = ({
  className = "",
  variant = "rectangular",
  ...props
}) => {
  const baseStyles = "animate-pulse bg-slate-200 dark:bg-slate-800 motion-reduce:animate-none";

  const variants = {
    text: "h-3 w-full rounded-md",
    circular: "rounded-full",
    rectangular: "rounded-xl",
  };

  return (
    <div className={cn(baseStyles, variants[variant], className)} aria-hidden="true" {...props} />
  );
};

export default Skeleton;
