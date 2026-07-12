import React from "react";
import { ArrowLeftRight, Download } from "lucide-react";

export interface QuickActionsProps {
  onTransfer?: () => void;
  onExport?: () => void;
}

const QuickActions: React.FC<QuickActionsProps> = ({ onTransfer, onExport }) => {
  return (
    <div className="grid grid-cols-2 gap-3">
      <button
        onClick={onTransfer}
        className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800/80 rounded-xl p-4 flex flex-col items-center justify-center gap-2 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors shadow-soft-sm cursor-pointer select-none group"
      >
        <span className="text-primary group-hover:scale-110 transition-transform">
          <ArrowLeftRight size={20} />
        </span>
        <span className="font-label-sm text-label-sm text-slate-800 dark:text-slate-200">
          Transfer Et
        </span>
      </button>

      <button
        onClick={onExport}
        className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800/80 rounded-xl p-4 flex flex-col items-center justify-center gap-2 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors shadow-soft-sm cursor-pointer select-none group"
      >
        <span className="text-primary group-hover:scale-110 transition-transform">
          <Download size={20} />
        </span>
        <span className="font-label-sm text-label-sm text-slate-800 dark:text-slate-200">
          Dışa Aktar
        </span>
      </button>
    </div>
  );
};

export default QuickActions;
