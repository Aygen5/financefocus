import React from "react";

export interface PageHeaderProps {
  title: string;
  description?: string;
  actions?: React.ReactNode;
  className?: string;
}

const PageHeader: React.FC<PageHeaderProps> = ({ title, description, actions, className = "" }) => {
  return (
    <div
      className={`flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between pb-6 border-b border-slate-200/50 dark:border-slate-800/40 mb-6 text-left ${className}`}
    >
      <div className="space-y-1">
        <h1 className="text-2xl font-bold tracking-tight text-slate-800 dark:text-white leading-none">
          {title}
        </h1>
        {description && (
          <p className="text-[13px] text-slate-500 dark:text-slate-400">{description}</p>
        )}
      </div>
      {actions && <div className="flex flex-wrap items-center gap-3 shrink-0">{actions}</div>}
    </div>
  );
};

export default PageHeader;
