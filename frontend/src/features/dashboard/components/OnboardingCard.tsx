import React, { useState } from "react";
import { Sparkles, Rocket, Loader2, X } from "lucide-react";

interface OnboardingCardProps {
  onSeedDemoData: () => Promise<void>;
}

const OnboardingCard: React.FC<OnboardingCardProps> = ({ onSeedDemoData }) => {
  const [loading, setLoading] = useState(false);
  const [dismissed, setDismissed] = useState(false);

  if (dismissed) return null;

  const handleSeed = async () => {
    setLoading(true);
    try {
      await onSeedDemoData();
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full rounded-2xl bg-gradient-to-r from-brand-900 via-slate-900 to-slate-950 text-white px-6 py-4 shadow-md border border-brand-500/20 flex flex-col md:flex-row items-center justify-between gap-4 transition-all">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-brand-500/20 border border-brand-400/30 flex items-center justify-center text-brand-300 shrink-0">
          <Sparkles size={20} />
        </div>
        <div>
          <h4 className="font-bold text-sm text-white flex items-center gap-1.5">
            💡 FinanceFocus'a hoş geldiniz
          </h4>
          <p className="text-xs text-slate-300 font-medium mt-0.5">
            Demo verileriyle uygulamayı keşfetmek ister misiniz?
          </p>
        </div>
      </div>

      <div className="flex items-center gap-3 shrink-0 w-full md:w-auto justify-end">
        <button
          onClick={handleSeed}
          disabled={loading}
          className="px-4 py-2 rounded-xl bg-brand-500 hover:bg-brand-600 active:scale-[0.98] text-white font-bold text-xs shadow-md shadow-brand-500/20 transition-all flex items-center gap-2 cursor-pointer disabled:opacity-50"
        >
          {loading ? (
            <>
              <Loader2 size={14} className="animate-spin" />
              <span>Yükleniyor...</span>
            </>
          ) : (
            <>
              <Rocket size={14} />
              <span>Demo Verilerini Yükle</span>
            </>
          )}
        </button>

        <button
          onClick={() => setDismissed(true)}
          className="px-3.5 py-2 rounded-xl bg-white/10 hover:bg-white/15 text-slate-300 hover:text-white font-semibold text-xs transition-colors flex items-center gap-1.5 cursor-pointer"
        >
          <span>Sıfırdan Başla</span>
          <X size={14} />
        </button>
      </div>
    </div>
  );
};

export default OnboardingCard;
