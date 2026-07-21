import React from "react";
import { cn } from "@/utils/styles";

export interface DividerProps extends React.HTMLAttributes<HTMLDivElement> {
  orientation?: "horizontal" | "vertical";
  label?: string;
}

export const Divider: React.FC<DividerProps> = ({
  className = "",
  orientation = "horizontal",
  label,
  children,
  ...props
}) => {
  const isHorizontal = orientation === "horizontal";

  return (
    <div
      className={cn(
        "flex items-center text-center select-none font-semibold text-xs text-slate-400 dark:text-slate-500",
        isHorizontal ? "w-full flex-row" : "h-full flex-col py-2",
        className,
      )}
      role="separator"
      aria-orientation={orientation}
      {...props}
    >
      <div
        className={cn(
          "bg-slate-200/80 dark:bg-slate-800/80 transition-colors",
          isHorizontal ? "h-px flex-1" : "w-px flex-1",
        )}
      />

      {label && isHorizontal && (
        <span className="px-3 shrink-0 uppercase tracking-widest text-[10px]">{label}</span>
      )}

      {children && isHorizontal && !label && <span className="px-3 shrink-0">{children}</span>}

      <div
        className={cn(
          "bg-slate-200/80 dark:bg-slate-800/80 transition-colors",
          isHorizontal ? "h-px flex-1" : "w-px flex-1",
        )}
      />
    </div>
  );
};

export default Divider;
