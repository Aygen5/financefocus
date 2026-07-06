import React from "react";
import Modal from "@/components/ui/Modal";
import Button from "@/components/ui/Button";
import { AlertTriangle } from "lucide-react";
import { cn } from "@/utils/styles";

export interface ConfirmDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title?: string;
  description?: string;
  confirmLabel?: string;
  cancelLabel?: string;
  loading?: boolean;
  variant?: "danger" | "primary" | "warning";
}

export const ConfirmDialog: React.FC<ConfirmDialogProps> = ({
  isOpen,
  onClose,
  onConfirm,
  title = "İşlemi Onaylıyor musunuz?",
  description = "Bu işlem geri alınamaz. Devam etmek istediğinize emin misiniz?",
  confirmLabel = "Onayla",
  cancelLabel = "İptal",
  loading = false,
  variant = "danger",
}) => {
  const getIconColor = () => {
    switch (variant) {
      case "danger":
        return "text-red-500 bg-red-500/10";
      case "warning":
        return "text-amber-500 bg-amber-500/10";
      default:
        return "text-primary bg-primary/10 dark:text-brand-400 dark:bg-brand-500/10";
    }
  };

  const footer = (
    <div className="flex gap-3 justify-end w-full select-none">
      <Button variant="outline" size="sm" onClick={onClose} disabled={loading}>
        {cancelLabel}
      </Button>
      <Button
        variant={variant === "danger" ? "danger" : "primary"}
        size="sm"
        onClick={onConfirm}
        loading={loading}
      >
        {confirmLabel}
      </Button>
    </div>
  );

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={title} footer={footer} size="sm">
      <div className="flex items-start gap-4 text-left">
        {/* Warning Icon */}
        <div
          className={cn(
            "w-10 h-10 rounded-full flex items-center justify-center shrink-0",
            getIconColor(),
          )}
        >
          <AlertTriangle size={20} />
        </div>

        {/* Text Description */}
        <div className="space-y-1">
          <p className="text-sm font-semibold text-slate-700 dark:text-slate-200">{title}</p>
          <p className="text-xs font-medium text-slate-500 dark:text-slate-400 leading-relaxed">
            {description}
          </p>
        </div>
      </div>
    </Modal>
  );
};

export default ConfirmDialog;
