import React from "react";
import { cn } from "@/utils/styles";
import { FolderOpen } from "lucide-react";
import Button from "@/components/ui/Button";

export interface EmptyStateProps extends React.HTMLAttributes<HTMLDivElement> {
  title?: string;
  description?: string;
  icon?: React.ReactNode;
  action?: React.ReactNode; // Geriye dönük uyumluluk için
  primaryActionLabel?: string;
  onPrimaryActionClick?: () => void;
  primaryActionIcon?: React.ReactNode;
  secondaryActionLabel?: string;
  onSecondaryActionClick?: () => void;
  secondaryActionIcon?: React.ReactNode;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  className = "",
  title = "Veri Bulunamadı",
  description = "Gösterilecek herhangi bir kayıt mevcut değil.",
  icon,
  action,
  primaryActionLabel,
  onPrimaryActionClick,
  primaryActionIcon,
  secondaryActionLabel,
  onSecondaryActionClick,
  secondaryActionIcon,
  ...props
}) => {
  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center text-center p-8 md:p-12 border border-dashed border-slate-200 dark:border-slate-800/80 rounded-2xl bg-white dark:bg-slate-900 select-none w-full",
        className,
      )}
      {...props}
    >
      {/* Icon Area */}
      <div className="w-14 h-14 bg-slate-50 dark:bg-slate-800/50 rounded-full flex items-center justify-center text-slate-400 dark:text-slate-500 mb-4 shrink-0 shadow-soft-sm">
        {icon || <FolderOpen size={24} />}
      </div>

      {/* Text Area */}
      <h3 className="text-base font-extrabold text-slate-800 dark:text-slate-100 tracking-tight mb-1">
        {title}
      </h3>
      <p className="text-xs font-bold text-slate-500 dark:text-slate-400 max-w-sm mb-6 leading-relaxed">
        {description}
      </p>

      {/* Actions Area */}
      {(action || primaryActionLabel || secondaryActionLabel) && (
        <div className="flex flex-wrap items-center justify-center gap-3 shrink-0">
          {secondaryActionLabel && onSecondaryActionClick && (
            <Button variant="secondary" onClick={onSecondaryActionClick} icon={secondaryActionIcon}>
              {secondaryActionLabel}
            </Button>
          )}

          {primaryActionLabel && onPrimaryActionClick && (
            <Button variant="primary" onClick={onPrimaryActionClick} icon={primaryActionIcon}>
              {primaryActionLabel}
            </Button>
          )}

          {action && <div className="shrink-0">{action}</div>}
        </div>
      )}
    </div>
  );
};

export default EmptyState;
