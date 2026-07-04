import React from "react";

export interface Tab {
  id: string;
  label: string;
  icon?: React.ReactNode;
  content?: React.ReactNode;
}

export interface TabsProps {
  tabs: Tab[];
  activeTabId: string;
  onChange: (id: string) => void;
  className?: string;
}

const Tabs: React.FC<TabsProps> = ({ tabs, activeTabId, onChange, className = "" }) => {
  const activeStyle = "border-brand-500 text-brand-600 dark:text-brand-400 font-bold border-b-2";
  const inactiveStyle =
    "border-transparent text-slate-500 hover:text-slate-700 dark:hover:text-slate-300 font-medium hover:border-slate-300 dark:hover:border-slate-700";

  return (
    <div className={`w-full ${className}`}>
      {/* Tab Header Buttons */}
      <div className="border-b border-slate-200/80 dark:border-slate-800/80">
        <nav className="flex gap-6 -mb-px" aria-label="Sekmeler">
          {tabs.map((tab) => {
            const isActive = tab.id === activeTabId;
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => onChange(tab.id)}
                className={`flex items-center gap-2 py-3 px-1 text-sm transition-all duration-200 border-b-2 cursor-pointer focus:outline-none select-none ${
                  isActive ? activeStyle : inactiveStyle
                }`}
                role="tab"
                aria-selected={isActive}
                aria-controls={`tabpanel-${tab.id}`}
              >
                {Icon && <span className="shrink-0">{Icon}</span>}
                <span>{tab.label}</span>
              </button>
            );
          })}
        </nav>
      </div>

      {/* Tab Content Panels */}
      <div className="mt-4">
        {tabs.map((tab) => {
          if (tab.id !== activeTabId || !tab.content) return null;
          return (
            <div
              key={tab.id}
              id={`tabpanel-${tab.id}`}
              role="tabpanel"
              tabIndex={0}
              className="focus:outline-none"
            >
              {tab.content}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Tabs;
