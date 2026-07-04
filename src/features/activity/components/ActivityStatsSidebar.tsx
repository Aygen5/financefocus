import React from "react";
import { PlusCircle, Edit3, Trash2, ArrowRight } from "lucide-react";

export interface ActivityStatsSidebarProps {
  onViewReport?: () => void;
}

const ActivityStatsSidebar: React.FC<ActivityStatsSidebarProps> = ({ onViewReport }) => {
  return (
    <div className="space-y-gutter text-left">
      {/* Activity Stats */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800/80 rounded-xl p-6 shadow-soft-sm">
        <h3 className="font-headline-sm text-headline-sm text-slate-800 dark:text-white font-bold mb-4">
          Aktivite İstatistikleri (Activity Stats)
        </h3>
        <div className="space-y-4">
          <div className="p-3 bg-blue-500/10 rounded-lg flex items-center justify-between text-sm font-semibold">
            <div className="flex items-center gap-3 text-primary dark:text-brand-400">
              <PlusCircle size={18} />
              <span>Total Added</span>
            </div>
            <span className="font-bold text-primary dark:text-brand-400">142</span>
          </div>

          <div className="p-3 bg-slate-500/10 rounded-lg flex items-center justify-between text-sm font-semibold">
            <div className="flex items-center gap-3 text-slate-650 dark:text-slate-400">
              <Edit3 size={18} />
              <span>Updated</span>
            </div>
            <span className="font-bold text-slate-700 dark:text-slate-300">86</span>
          </div>

          <div className="p-3 bg-red-500/10 rounded-lg flex items-center justify-between text-sm font-semibold">
            <div className="flex items-center gap-3 text-red-650 dark:text-red-400">
              <Trash2 size={18} />
              <span>Deleted</span>
            </div>
            <span className="font-bold text-red-650 dark:text-red-400">12</span>
          </div>
        </div>
      </div>

      {/* Intelligence report card */}
      <div className="bg-blue-600/90 dark:bg-brand-900/40 text-white p-6 rounded-xl shadow-soft-sm relative overflow-hidden">
        <div className="relative z-10">
          <h4 className="font-headline-sm text-headline-sm font-bold mb-2">Insight</h4>
          <p className="text-body-sm text-body-sm text-blue-100 dark:text-slate-350 opacity-90 leading-relaxed mb-4 font-medium">
            Aktivite hacmi bu hafta geçen aya göre %15 arttı. Çoğu güncelleme 'Bütçe Planlayıcı'
            modülünde gerçekleşti.
          </p>
          <button
            onClick={onViewReport}
            className="text-label-md font-label-md flex items-center gap-1 hover:underline cursor-pointer font-bold text-white"
          >
            Zeka Raporunu Görüntüle <ArrowRight size={16} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default ActivityStatsSidebar;
