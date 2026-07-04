import React from "react";

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  title?: React.ReactNode;
  subtitle?: React.ReactNode;
  extra?: React.ReactNode;
  footer?: React.ReactNode;
  noPadding?: boolean;
}

const Card: React.FC<CardProps> = ({
  children,
  title,
  subtitle,
  extra,
  footer,
  noPadding = false,
  className = "",
  ...props
}) => {
  return (
    <div
      className={`rounded-xl border border-slate-200/80 dark:border-slate-800/80 bg-white dark:bg-slate-900 shadow-soft-sm hover:shadow-soft-md transition-shadow duration-200 ${className}`}
      {...props}
    >
      {/* Card Header */}
      {(title || subtitle || extra) && (
        <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800/50 px-6 py-4">
          <div className="flex flex-col gap-0.5 text-left">
            {title && (
              <h3 className="text-base font-bold text-slate-800 dark:text-slate-100 tracking-tight">
                {title}
              </h3>
            )}
            {subtitle && (
              <p className="text-[12px] text-slate-500 dark:text-slate-400">{subtitle}</p>
            )}
          </div>
          {extra && <div className="flex items-center">{extra}</div>}
        </div>
      )}

      {/* Card Body */}
      <div className={`text-left ${noPadding ? "p-0" : "p-6"}`}>{children}</div>

      {/* Card Footer */}
      {footer && (
        <div className="border-t border-slate-100 dark:border-slate-800/50 px-6 py-4 bg-slate-50/40 dark:bg-slate-900/40 rounded-b-xl text-left">
          {footer}
        </div>
      )}
    </div>
  );
};

export default Card;
