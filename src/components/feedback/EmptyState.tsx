import React from "react";
import { Inbox } from "lucide-react";

export interface EmptyStateProps {
  title: string;
  description: string;
  icon?: React.ReactNode;
  action?: React.ReactNode;
  className?: string;
}

const EmptyState: React.FC<EmptyStateProps> = ({
  title,
  description,
  icon,
  action,
  className = "",
}) => {
  return (
    <div
      className={`flex flex-col items-center justify-center text-center p-8 border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-xl bg-white/40 dark:bg-slate-900/10 min-h-[320px] ${className}`}
    >
      {/* Icon Area */}
      <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-slate-50 dark:bg-slate-900/60 border border-slate-100 dark:border-slate-800/80 text-slate-400 mb-4 shadow-soft-sm">
        {icon || <Inbox size={28} />}
      </div>

      {/* Texts */}
      <h3 className="text-base font-bold text-slate-800 dark:text-slate-100 tracking-tight mb-1.5">
        {title}
      </h3>
      <p className="text-[13px] text-slate-500 dark:text-slate-400 max-w-sm mb-6 leading-relaxed">
        {description}
      </p>

      {/* Action Button */}
      {action && <div className="flex items-center justify-center">{action}</div>}
    </div>
  );
};

export default EmptyState;
