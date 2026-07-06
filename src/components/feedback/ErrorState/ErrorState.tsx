import React from "react";
import { cn } from "@/utils/styles";
import { AlertCircle } from "lucide-react";
import Button from "@/components/ui/Button";

export interface ErrorStateProps extends React.HTMLAttributes<HTMLDivElement> {
  title?: string;
  description?: string;
  icon?: React.ReactNode;
  onRetry?: () => void;
  retryLabel?: string;
  retryIcon?: React.ReactNode;
  secondaryActionLabel?: string;
  onSecondaryActionClick?: () => void;
  secondaryActionIcon?: React.ReactNode;
}

export const ErrorState: React.FC<ErrorStateProps> = ({
  className = "",
  title = "Bir Hata Oluştu",
  description = "Veriler yüklenirken bir problem yaşandı. Lütfen internet bağlantınızı kontrol edip tekrar deneyin.",
  icon,
  onRetry,
  retryLabel = "Yeniden Dene",
  retryIcon,
  secondaryActionLabel,
  onSecondaryActionClick,
  secondaryActionIcon,
  ...props
}) => {
  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center text-center p-8 md:p-12 border border-slate-200 dark:border-slate-800 rounded-2xl bg-white dark:bg-slate-900 select-none w-full",
        className,
      )}
      role="alert"
      {...props}
    >
      {/* Icon Area */}
      <div className="w-14 h-14 bg-red-500/10 rounded-full flex items-center justify-center text-red-500 mb-4 shrink-0 shadow-soft-sm animate-bounce-slow">
        {icon || <AlertCircle size={24} />}
      </div>

      {/* Text Area */}
      <h3 className="text-base font-extrabold text-slate-800 dark:text-slate-100 tracking-tight mb-1">
        {title}
      </h3>
      <p className="text-xs font-bold text-slate-500 dark:text-slate-400 max-w-sm mb-6 leading-relaxed">
        {description}
      </p>

      {/* Action Buttons Area */}
      {(onRetry || secondaryActionLabel) && (
        <div className="flex flex-wrap items-center justify-center gap-3 shrink-0">
          {secondaryActionLabel && onSecondaryActionClick && (
            <Button variant="secondary" onClick={onSecondaryActionClick} icon={secondaryActionIcon}>
              {secondaryActionLabel}
            </Button>
          )}

          {onRetry && (
            <Button variant="primary" onClick={onRetry} icon={retryIcon}>
              {retryLabel}
            </Button>
          )}
        </div>
      )}
    </div>
  );
};

export default ErrorState;
