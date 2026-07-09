import React, { useState } from "react";
import { cn } from "@/utils/styles";

export interface Tab {
  id: string;
  label: string;
  icon?: React.ReactNode;
  content: React.ReactNode;
}

export interface TabsProps {
  tabs: Tab[];
  defaultTabId?: string;
  className?: string;
  variant?: "line" | "pill";
}

export const Tabs: React.FC<TabsProps> = ({
  tabs,
  defaultTabId,
  className = "",
  variant = "line",
}) => {
  const [activeTabId, setActiveTabId] = useState(defaultTabId || tabs[0]?.id);

  const activeContent = tabs.find((t) => t.id === activeTabId)?.content;

  const headerVariants = {
    line: "border-b border-slate-100 dark:border-slate-800 gap-6",
    pill: "bg-slate-50 dark:bg-slate-900 p-1 rounded-xl gap-2 inline-flex",
  };

  const btnVariants = (isActive: boolean) => {
    if (variant === "line") {
      return cn(
        "pb-3 text-sm font-bold border-b-2 transition-all cursor-pointer flex items-center gap-2",
        isActive
          ? "border-primary dark:border-brand-500 text-primary dark:text-brand-400"
          : "border-transparent text-slate-500 hover:text-slate-700 dark:hover:text-slate-350",
      );
    } else {
      return cn(
        "px-4 py-2 text-sm font-bold rounded-lg transition-all cursor-pointer flex items-center gap-2",
        isActive
          ? "bg-white dark:bg-slate-800 text-primary dark:text-brand-400 shadow-soft-sm"
          : "text-slate-500 hover:text-slate-700 dark:hover:text-slate-350",
      );
    }
  };

  return (
    <div className={cn("w-full space-y-6 text-left", className)}>
      <div className={cn("flex select-none", headerVariants[variant])}>
        {tabs.map((tab) => {
          const isActive = tab.id === activeTabId;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTabId(tab.id)}
              className={btnVariants(isActive)}
            >
              {tab.icon && <span className="shrink-0">{tab.icon}</span>}
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      <div className="w-full">{activeContent}</div>
    </div>
  );
};

export default Tabs;
