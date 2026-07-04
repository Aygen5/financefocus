import React from "react";

export interface SectionHeaderProps {
  title: string;
  description?: string;
  actions?: React.ReactNode;
  className?: string;
}

const SectionHeader: React.FC<SectionHeaderProps> = ({
  title,
  description,
  actions,
  className = "",
}) => {
  return (
    <div className={`flex items-center justify-between py-3 mb-4 text-left ${className}`}>
      <div className="space-y-0.5">
        <h3 className="text-base font-bold text-slate-800 dark:text-slate-100 tracking-tight">
          {title}
        </h3>
        {description && (
          <p className="text-[12px] text-slate-500 dark:text-slate-400">{description}</p>
        )}
      </div>
      {actions && <div className="flex items-center gap-2">{actions}</div>}
    </div>
  );
};

export default SectionHeader;
