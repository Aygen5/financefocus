import React from "react";
import { AlertTriangle, X } from "lucide-react";
import Button from "../ui/Button";

export interface ConfirmDialogProps {
  isOpen: boolean;
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  onConfirm: () => void;
  onCancel: () => void;
  variant?: "danger" | "primary";
  loading?: boolean;
}

const ConfirmDialog: React.FC<ConfirmDialogProps> = ({
  isOpen,
  title,
  message,
  confirmText = "Onayla",
  cancelText = "İptal",
  onConfirm,
  onCancel,
  variant = "primary",
  loading = false,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 dark:bg-slate-950/60 backdrop-blur-sm">
      <div
        className="relative w-full max-w-md bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800/80 rounded-xl shadow-soft-xl overflow-hidden text-left"
        role="dialog"
        aria-modal="true"
        aria-labelledby="confirm-dialog-title"
      >
        {/* Close Button */}
        <button
          onClick={onCancel}
          disabled={loading}
          className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          aria-label="Kapat"
        >
          <X size={16} />
        </button>

        {/* Content Area */}
        <div className="p-6">
          <div className="flex gap-4">
            {/* Warning Icon */}
            <div
              className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl shadow-soft-sm ${
                variant === "danger"
                  ? "bg-red-50 dark:bg-red-950/20 text-red-600 dark:text-red-400"
                  : "bg-brand-50 dark:bg-brand-950/20 text-brand-600 dark:text-brand-400"
              }`}
            >
              <AlertTriangle size={20} />
            </div>

            {/* Description */}
            <div className="space-y-1.5">
              <h3
                id="confirm-dialog-title"
                className="text-base font-bold text-slate-800 dark:text-slate-100 tracking-tight"
              >
                {title}
              </h3>
              <p className="text-[13px] text-slate-500 dark:text-slate-400 leading-relaxed">
                {message}
              </p>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex justify-end gap-3 px-6 py-4 bg-slate-50/40 dark:bg-slate-900/40 border-t border-slate-100 dark:border-slate-800/50">
          <Button variant="ghost" size="sm" onClick={onCancel} disabled={loading}>
            {cancelText}
          </Button>
          <Button
            variant={variant === "danger" ? "danger" : "primary"}
            size="sm"
            loading={loading}
            onClick={onConfirm}
          >
            {confirmText}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmDialog;
