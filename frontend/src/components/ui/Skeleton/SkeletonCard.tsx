import React from "react";
import Skeleton from "./Skeleton";
import { cn } from "@/utils/styles";

export interface SkeletonCardProps extends React.HTMLAttributes<HTMLDivElement> {
  hasAvatar?: boolean;
  lines?: number;
}

export const SkeletonCard: React.FC<SkeletonCardProps> = ({
  className = "",
  hasAvatar = true,
  lines = 2,
  ...props
}) => {
  return (
    <div
      className={cn(
        "p-5 border border-slate-200 dark:border-slate-800 rounded-2xl bg-white dark:bg-slate-900 flex flex-col gap-4 w-full select-none",
        className,
      )}
      {...props}
    >
      <div className="flex items-center gap-3">
        {hasAvatar && <Skeleton variant="circular" className="w-10 h-10 shrink-0" />}
        <div className="flex-1 space-y-2">
          <Skeleton variant="text" className="w-1/3 h-4" />
          <Skeleton variant="text" className="w-1/4 h-3" />
        </div>
      </div>
      <div className="space-y-2 pt-2">
        {Array.from({ length: lines }).map((_, index) => (
          <Skeleton
            key={index}
            variant="text"
            className={cn("h-3", index === lines - 1 ? "w-4/5" : "w-full")}
          />
        ))}
      </div>
    </div>
  );
};

export default SkeletonCard;
