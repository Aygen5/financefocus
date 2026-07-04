import React from "react";
import { Lightbulb, ArrowRight, Gauge } from "lucide-react";
import { Sparkles } from "lucide-react";
import toast from "react-hot-toast";

const AiInsights: React.FC = () => {
  const handleApplyScenario = () => {
    toast.success("Senaryo uygulandı! Aylık birikim tutarınız güncellendi.");
  };

  const handleViewSuggestions = () => {
    toast.success("Portföy optimizasyon önerileri yükleniyor.");
  };

  return (
    <div className="flex flex-col gap-gutter text-left">
      {/* Insight Card 1 */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800/80 rounded-xl p-6 border-l-4 border-l-amber-600 dark:border-l-amber-500 shadow-soft-sm relative overflow-hidden group">
        <div className="absolute top-0 right-0 p-2 opacity-5 text-slate-400 pointer-events-none">
          <Lightbulb size={64} />
        </div>
        <div className="flex items-center gap-2 mb-2">
          <span className="text-amber-600 dark:text-amber-500">
            <Sparkles size={16} />
          </span>
          <h4 className="font-label-md text-label-md font-bold text-slate-800 dark:text-white">
            Insight Engine
          </h4>
        </div>
        <p className="font-body-sm text-body-sm text-slate-500 dark:text-slate-400 mb-4 leading-relaxed relative z-10">
          Aylık birikimlerinizi{" "}
          <strong className="text-slate-800 dark:text-white font-bold">$200/ay</strong> artırmak,
          finansal hedeflerinize ulaşma tarihinizi{" "}
          <strong className="text-amber-600 font-bold">14 ay</strong> öne çekebilir.
        </p>
        <button
          onClick={handleApplyScenario}
          className="text-label-sm font-label-sm text-amber-600 hover:text-amber-700 transition-colors flex items-center gap-1 font-bold cursor-pointer relative z-10"
        >
          Senaryoyu uygula <ArrowRight size={14} />
        </button>
      </div>

      {/* Insight Card 2 */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800/80 rounded-xl p-6 border-l-4 border-l-primary dark:border-l-brand-500 shadow-soft-sm relative overflow-hidden group">
        <div className="flex items-center gap-2 mb-2">
          <span className="text-primary dark:text-brand-400">
            <Gauge size={16} />
          </span>
          <h4 className="font-label-md text-label-md font-bold text-slate-800 dark:text-white">
            Portföy Optimizasyonu
          </h4>
        </div>
        <p className="font-body-sm text-body-sm text-slate-500 dark:text-slate-400 mb-4 leading-relaxed relative z-10">
          Mevcut varlık dağılımınız 10 yıllık hedefleriniz için biraz muhafazakar kalıyor.
          Varlıklarınızı dengelemeyi düşünün.
        </p>
        <button
          onClick={handleViewSuggestions}
          className="text-label-sm font-label-sm text-primary dark:text-brand-400 hover:text-primary-container transition-colors flex items-center gap-1 font-bold cursor-pointer relative z-10"
        >
          Önerileri görüntüle <ArrowRight size={14} />
        </button>
      </div>
    </div>
  );
};

export default AiInsights;
