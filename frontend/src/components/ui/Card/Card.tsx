import React, { forwardRef } from "react";
import { cn } from "@/utils/styles";

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  hoverable?: boolean;
  title?: string;
  extra?: React.ReactNode;
}

export const Card = forwardRef<HTMLDivElement, CardProps>(
  ({ className = "", hoverable = false, title, extra, children, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          "bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800/80 rounded-2xl shadow-soft-sm transition-all duration-200 text-left overflow-hidden",
          hoverable &&
            "hover:shadow-soft-md hover:border-slate-300 dark:hover:border-slate-700 hover:-translate-y-0.5",
          className,
        )}
        {...props}
      >
        {(title || extra) && (
          <div className="px-6 py-4 border-b border-slate-200/60 dark:border-slate-800/60 flex items-center justify-between shrink-0">
            {title && (
              <h3 className="text-base font-bold text-slate-800 dark:text-slate-100 tracking-tight">
                {title}
              </h3>
            )}
            {extra && <div>{extra}</div>}
          </div>
        )}
        {children}
      </div>
    );
  },
);

Card.displayName = "Card";
export default Card;
