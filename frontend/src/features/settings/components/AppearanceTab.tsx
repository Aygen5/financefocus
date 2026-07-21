import React from "react";
import { CheckCircle2, Sun, Moon, Laptop } from "lucide-react";

export interface AppearanceTabProps {
  theme: "light" | "dark" | "system";
  onChangeTheme?: (mode: "light" | "dark" | "system") => void;
}

const AppearanceTab: React.FC<AppearanceTabProps> = ({ theme, onChangeTheme }) => {
  const options = [
    {
      mode: "light" as const,
      label: "Açık Tema (Light Mode)",
      icon: <Sun size={24} className="text-amber-500" />,
      previewClass: "bg-slate-50 border-slate-200",
    },
    {
      mode: "dark" as const,
      label: "Koyu Tema (Dark Mode)",
      icon: <Moon size={24} className="text-blue-400" />,
      previewClass: "bg-slate-900 border-slate-800",
    },
    {
      mode: "system" as const,
      label: "Sistem Varsayılanı (System)",
      icon: <Laptop size={24} className="text-slate-500" />,
      previewClass: "bg-gradient-to-br from-slate-50 to-slate-900 border-slate-300",
    },
  ];

  return (
    <div className="p-8 space-y-8 text-left">
      <div>
        <h3 className="font-headline-sm text-headline-sm text-slate-800 dark:text-white font-bold leading-tight">
          Görünüm
        </h3>
        <p className="text-xs font-semibold text-slate-400 dark:text-slate-500 mt-1">
          FinanceFocus'un cihazınızda nasıl görüneceğini özelleştirin.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {options.map((opt) => {
          const isSelected = theme === opt.mode;

          return (
            <button
              key={opt.mode}
              onClick={() => onChangeTheme?.(opt.mode)}
              className={`p-4 border-2 rounded-2xl space-y-3 text-left transition-all cursor-pointer flex flex-col justify-between ${
                isSelected
                  ? "border-primary dark:border-brand-500 bg-blue-50/10"
                  : "border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 hover:border-slate-300 dark:hover:border-slate-700"
              }`}
            >
              <div
                className={`h-24 rounded-lg border p-3 space-y-1.5 flex flex-col justify-center items-center ${opt.previewClass}`}
              >
                {opt.icon}
              </div>

              <div className="flex items-center justify-between font-bold text-sm text-slate-800 dark:text-white pt-2">
                <span>{opt.label}</span>
                {isSelected ? (
                  <CheckCircle2 size={18} className="text-primary dark:text-brand-400" />
                ) : (
                  <div className="w-5 h-5 rounded-full border border-slate-200 dark:border-slate-850" />
                )}
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default AppearanceTab;
