import React, { useState } from "react";
import { Sparkles, PieChart, Target, Activity, Rocket, Loader2 } from "lucide-react";

interface OnboardingCardProps {
  onSeedDemoData: () => Promise<void>;
}

const OnboardingCard: React.FC<OnboardingCardProps> = ({ onSeedDemoData }) => {
  const [loading, setLoading] = useState(false);

  const handleSeed = async () => {
    setLoading(true);
    try {
      await onSeedDemoData();
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-container-max mx-auto text-left space-y-6">
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-brand-900 via-slate-900 to-slate-950 text-white p-8 md:p-12 shadow-2xl border border-brand-500/20">
        <div className="absolute top-0 right-0 -translate-y-12 translate-x-12 w-96 h-96 bg-brand-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 max-w-3xl space-y-6">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-brand-500/20 border border-brand-400/30 text-brand-300 text-xs font-semibold tracking-wide">
            <Sparkles size={14} className="text-brand-400" />
            <span>Hoş Geldiniz • Onboarding Deneyimi</span>
          </div>

          <h1 className="text-3xl md:text-4xl font-black tracking-tight text-white leading-tight">
            FinanceFocus Finansal Yönetim Platformuna Hoş Geldiniz
          </h1>

          <p className="text-sm md:text-base text-slate-300 font-medium leading-relaxed">
            Hesabınız başarıyla oluşturuldu. Temiz bir finansal başlangıç yapabilir veya platformun
            tüm gelişmiş özelliklerini, grafiklerini ve analizlerini anında keşfetmek için tek tıkla
            örnek demo verilerini yükleyebilirsiniz.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
            <div className="p-4 rounded-2xl bg-white/5 border border-white/10 space-y-2">
              <div className="w-9 h-9 rounded-xl bg-brand-500/20 flex items-center justify-center text-brand-400">
                <PieChart size={18} />
              </div>
              <h4 className="font-bold text-sm text-white">Canlı Finans Analizleri</h4>
              <p className="text-xs text-slate-400 leading-relaxed font-medium">
                Gelir, gider ve nakit akış grafiklerini görsel olarak takip edin.
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-white/5 border border-white/10 space-y-2">
              <div className="w-9 h-9 rounded-xl bg-emerald-500/20 flex items-center justify-center text-emerald-400">
                <Target size={18} />
              </div>
              <h4 className="font-bold text-sm text-white">Bütçe & Hedef Yönetimi</h4>
              <p className="text-xs text-slate-400 leading-relaxed font-medium">
                Kategori bazlı harcama limitleri koyun ve birikim hedefleri belirleyin.
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-white/5 border border-white/10 space-y-2">
              <div className="w-9 h-9 rounded-xl bg-purple-500/20 flex items-center justify-center text-purple-400">
                <Activity size={18} />
              </div>
              <h4 className="font-bold text-sm text-white">Finansal Sağlık Skoru</h4>
              <p className="text-xs text-slate-400 leading-relaxed font-medium">
                Yapay zeka algoritması ile finansal alışkanlıklarınızı puanlayın.
              </p>
            </div>
          </div>

          <div className="pt-4 flex flex-col sm:flex-row items-stretch sm:items-center gap-4">
            <button
              onClick={handleSeed}
              disabled={loading}
              className="px-6 py-3.5 rounded-2xl bg-brand-500 hover:bg-brand-600 active:scale-[0.99] text-white font-bold text-sm shadow-lg shadow-brand-500/30 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
            >
              {loading ? (
                <>
                  <Loader2 size={18} className="animate-spin" />
                  <span>Demo Verileri Yükleniyor...</span>
                </>
              ) : (
                <>
                  <Rocket size={18} />
                  <span>Demo Verilerini Yükle (Tek Tıkla Keşfet)</span>
                </>
              )}
            </button>
            <p className="text-xs text-slate-400 self-center font-medium">
              İsterseniz bu butona basmayıp uygulamanıza sıfırdan işlem ekleyebilirsiniz.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OnboardingCard;
