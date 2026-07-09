import React, { useState, useRef, useEffect } from "react";
import { cn } from "@/utils/styles";

export interface DropdownItem {
  key: string;
  label: string;
  icon?: React.ReactNode;
  onClick?: () => void;
  disabled?: boolean;
}

export interface DropdownProps {
  trigger: React.ReactNode;
  items: DropdownItem[];
  className?: string;
  align?: "left" | "right";
}

export const Dropdown: React.FC<DropdownProps> = ({
  trigger,
  items,
  className = "",
  align = "right",
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const alignments = {
    left: "left-0 origin-top-left",
    right: "right-0 origin-top-right",
  };

  return (
    <div ref={dropdownRef} className={cn("relative inline-block text-left", className)}>
      <div onClick={() => setIsOpen(!isOpen)} className="cursor-pointer">
        {trigger}
      </div>

      {isOpen && (
        <div
          className={cn(
            "absolute mt-2 w-48 bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800/80 rounded-xl shadow-soft-xl z-50 flex flex-col py-1 focus:outline-none",
            alignments[align],
          )}
          role="menu"
          aria-orientation="vertical"
        >
          {items.map((item) => (
            <button
              key={item.key}
              onClick={() => {
                if (item.disabled) return;
                item.onClick?.();
                setIsOpen(false);
              }}
              disabled={item.disabled}
              className={cn(
                "w-full px-4 py-2 text-sm font-semibold flex items-center gap-2.5 transition-colors cursor-pointer text-left",
                item.disabled
                  ? "opacity-40 cursor-not-allowed text-slate-400"
                  : "text-slate-700 dark:text-slate-350 hover:bg-slate-50 dark:hover:bg-slate-800/60",
              )}
              role="menuitem"
            >
              {item.icon && <span className="shrink-0 text-slate-400">{item.icon}</span>}
              <span>{item.label}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default Dropdown;
