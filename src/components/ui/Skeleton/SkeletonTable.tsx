import React from "react";
import Skeleton from "./Skeleton";
import { cn } from "@/utils/styles";

export interface SkeletonTableProps extends React.HTMLAttributes<HTMLDivElement> {
  rows?: number;
  columns?: number;
}

export const SkeletonTable: React.FC<SkeletonTableProps> = ({
  className = "",
  rows = 5,
  columns = 5,
  ...props
}) => {
  return (
    <div
      className={cn(
        "w-full overflow-x-auto select-none border border-slate-200/80 dark:border-slate-800/80 rounded-2xl bg-white dark:bg-slate-900",
        className,
      )}
      {...props}
    >
      <table className="w-full text-left border-collapse">
        {/* Table Header Skeleton */}
        <thead>
          <tr className="border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/50">
            {Array.from({ length: columns }).map((_, i) => (
              <th key={i} className="p-4">
                <Skeleton variant="text" className="w-16 h-3.5 bg-slate-300 dark:bg-slate-700" />
              </th>
            ))}
          </tr>
        </thead>

        {/* Table Body Skeleton */}
        <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60">
          {Array.from({ length: rows }).map((_, rowIndex) => (
            <tr key={rowIndex} className="hover:bg-slate-50/40 dark:hover:bg-slate-850/20">
              {Array.from({ length: columns }).map((_, colIndex) => {
                // Her hücredeki skeleton genişliğini hafif farklı yapalım ki daha doğal dursun
                const widths = ["w-3/4", "w-2/3", "w-1/2", "w-4/5", "w-1/3"];
                const widthClass = widths[(rowIndex + colIndex) % widths.length];

                return (
                  <td key={colIndex} className="p-4">
                    <Skeleton variant="text" className={cn("h-3", widthClass)} />
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default SkeletonTable;
