import React, { useEffect, useRef } from "react";
import { X } from "lucide-react";
import { cn } from "@/utils/styles";

export interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
  footer?: React.ReactNode;
  size?: "sm" | "md" | "lg" | "xl";
  className?: string;
}

export const Modal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  title,
  children,
  footer,
  size = "md",
  className = "",
}) => {
  const modalRef = useRef<HTMLDivElement>(null);

  // ESC tuşuna basıldığında modalı kapat
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape" && isOpen) {
        onClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  // Sayfa kaydırmasını engelle (modal açıkken)
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  if (!isOpen) return null;

  const sizes = {
    sm: "max-w-sm",
    md: "max-w-md",
    lg: "max-w-lg",
    xl: "max-w-2xl",
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 dark:bg-slate-950/60 backdrop-blur-sm select-none animate-fadeIn">
      {/* Backdrop area click-handler */}
      <div className="fixed inset-0" onClick={onClose} />

      {/* Modal Dialog */}
      <div
        ref={modalRef}
        className={cn(
          "relative w-full bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800/80 rounded-xl shadow-soft-xl overflow-hidden text-left z-10 flex flex-col max-h-[90vh] animate-zoomIn",
          sizes[size],
          className,
        )}
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-title"
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800/50 px-6 py-4">
          <h3
            id="modal-title"
            className="text-base font-bold text-slate-800 dark:text-slate-100 tracking-tight"
          >
            {title}
          </h3>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-650 dark:hover:text-slate-250 p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-850 transition-colors cursor-pointer"
            aria-label="Modalı kapat"
          >
            <X size={16} />
          </button>
        </div>

        {/* Content Body */}
        <div className="flex-1 overflow-y-auto p-6 custom-scrollbar">{children}</div>

        {/* Footer */}
        {footer && (
          <div className="border-t border-slate-100 dark:border-slate-800/50 px-6 py-4 bg-slate-50/40 dark:bg-slate-900/40 flex justify-end gap-3">
            {footer}
          </div>
        )}
      </div>
    </div>
  );
};

export default Modal;
