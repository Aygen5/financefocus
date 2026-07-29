import React, { useState } from "react";
import { Sparkles, LogOut, Loader2 } from "lucide-react";
import useIsDemoActive from "@/hooks/useIsDemoActive";

export const DemoModeBanner: React.FC = () => {
  const { isDemoActive, exitDemoMode } = useIsDemoActive();
  const [loading, setLoading] = useState(false);

  if (!isDemoActive) return null;

  const handleExit = async () => {
    setLoading(true);
    try {
      await exitDemoMode();
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full rounded-2xl bg-gradient-to-r from-amber-900/90 via-slate-900 to-slate-950 text-white px-6 py-3.5 shadow-md border border-amber-500/30 flex flex-col md:flex-row items-center justify-between gap-4 transition-all mb-6 select-none">
      <div className="flex items-center gap-3">
        <div className="w-9 h-9 rounded-xl bg-amber-500/20 border border-amber-400/30 flex items-center justify-center text-amber-400 shrink-0">
          <Sparkles size={18} />
        </div>
        <div>
          <h4 className="font-bold text-sm text-white flex items-center gap-1.5">
            🎯 Şu anda Demo Modundasınız.
          </h4>
          <p className="text-xs text-amber-200/80 font-medium mt-0.5">
            Bu mod uygulamanın tüm özelliklerini incelemeniz için hazırlanmıştır. Demo verileri
            üzerinde değişiklik yapılamaz.
          </p>
        </div>
      </div>

      <div className="shrink-0">
        <button
          onClick={handleExit}
          disabled={loading}
          className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-600 active:scale-[0.98] text-slate-950 font-extrabold text-xs shadow-md transition-all flex items-center gap-2 cursor-pointer disabled:opacity-50"
        >
          {loading ? (
            <>
              <Loader2 size={14} className="animate-spin" />
              <span>Çıkılıyor...</span>
            </>
          ) : (
            <>
              <LogOut size={14} />
              <span>Demo'dan Çık</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
};

export default DemoModeBanner;
