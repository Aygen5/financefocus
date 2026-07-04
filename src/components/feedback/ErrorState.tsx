import React from "react";
import { AlertCircle, RotateCcw } from "lucide-react";
import Button from "../ui/Button";

export interface ErrorStateProps {
  title?: string;
  message: string;
  onRetry?: () => void;
  className?: string;
}

const ErrorState: React.FC<ErrorStateProps> = ({
  title = "Bir Hata Oluştu",
  message,
  onRetry,
  className = "",
}) => {
  return (
    <div
      className={`flex flex-col items-center justify-center text-center p-8 border-2 border-red-100 dark:border-red-950/20 rounded-xl bg-red-50/20 dark:bg-red-950/5 min-h-[320px] ${className}`}
    >
      {/* Icon Area */}
      <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-red-50 dark:bg-red-950/30 text-red-500 mb-4 shadow-soft-sm">
        <AlertCircle size={28} />
      </div>

      {/* Texts */}
      <h3 className="text-base font-bold text-red-600 dark:text-red-400 tracking-tight mb-1.5">
        {title}
      </h3>
      <p className="text-[13px] text-slate-500 dark:text-slate-400 max-w-sm mb-6 leading-relaxed">
        {message}
      </p>

      {/* Retry Button */}
      {onRetry && (
        <Button variant="danger" size="sm" onClick={onRetry} leftIcon={<RotateCcw size={14} />}>
          Tekrar Dene
        </Button>
      )}
    </div>
  );
};

export default ErrorState;
