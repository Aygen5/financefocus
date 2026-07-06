import React, { useEffect, useRef } from "react";
import { X } from "lucide-react";
import { cn } from "@/utils/styles";

export interface DrawerProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
  position?: "left" | "right";
  size?: "sm" | "md" | "lg";
}

export const Drawer: React.FC<DrawerProps> = ({
  isOpen,
  onClose,
  title,
  children,
  position = "right",
  size = "md",
}) => {
  const drawerRef = useRef<HTMLDivElement>(null);

  // ESC tuşuna basıldığında drawer'ı kapat
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape" && isOpen) {
        onClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  // Sayfa kaydırmasını engelle (drawer açıkken)
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

  const positions = {
    left: "left-0 border-r",
    right: "right-0 border-l",
  };

  const sizes = {
    sm: "max-w-xs",
    md: "max-w-md",
    lg: "max-w-lg",
  };

  return (
    <div className="fixed inset-0 z-50 flex bg-slate-900/40 dark:bg-slate-950/60 backdrop-blur-sm select-none">
      {/* Backdrop */}
      <div className="fixed inset-0" onClick={onClose} />

      {/* Drawer Box */}
      <div
        ref={drawerRef}
        className={cn(
          "fixed top-0 bottom-0 h-full w-full bg-white dark:bg-slate-900 border-slate-200/80 dark:border-slate-800/80 shadow-soft-xl flex flex-col z-10 transition-transform duration-300 ease-in-out text-left",
          positions[position],
          sizes[size],
        )}
        role="dialog"
        aria-modal="true"
        aria-labelledby="drawer-title"
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800/50 px-6 py-4">
          <h3
            id="drawer-title"
            className="text-base font-bold text-slate-800 dark:text-slate-100 tracking-tight"
          >
            {title}
          </h3>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-650 dark:hover:text-slate-255 p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-850 transition-colors cursor-pointer"
            aria-label="Kapat"
          >
            <X size={16} />
          </button>
        </div>

        {/* Content Body */}
        <div className="flex-1 overflow-y-auto p-6 custom-scrollbar">{children}</div>
      </div>
    </div>
  );
};

export default Drawer;
