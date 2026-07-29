import React, { useState } from "react";
import { Sparkles, LogOut, Loader2, AlertTriangle } from "lucide-react";
import useIsDemoActive from "@/hooks/useIsDemoActive";
import Modal from "@/components/overlay/Modal";
import Button from "@/components/ui/Button";

export const DemoModeBanner: React.FC = () => {
  const { isDemoActive, demoCounts, exitDemoMode } = useIsDemoActive();
  const [loading, setLoading] = useState(false);
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);

  if (!isDemoActive) return null;

  const handleExitConfirm = async () => {
    setLoading(true);
    try {
      await exitDemoMode();
    } finally {
      setLoading(false);
      setIsConfirmOpen(false);
    }
  };

  const countsSummary = [
    demoCounts.transactions > 0 && `${demoCounts.transactions} Demo İşlem`,
    demoCounts.budgets > 0 && `${demoCounts.budgets} Demo Bütçe`,
    demoCounts.goals > 0 && `${demoCounts.goals} Demo Hedef`,
    demoCounts.subscriptions > 0 && `${demoCounts.subscriptions} Demo Abonelik`,
    demoCounts.portfolio > 0 && `${demoCounts.portfolio} Demo Portföy`,
    demoCounts.notifications > 0 && `${demoCounts.notifications} Demo Bildirim`,
    demoCounts.activities > 0 && `${demoCounts.activities} Demo Aktivite`,
  ]
    .filter(Boolean)
    .join(", ");

  return (
    <>
      <div className="w-full rounded-2xl bg-gradient-to-r from-amber-900/90 via-slate-900 to-slate-950 text-white px-6 py-3.5 shadow-md border border-amber-500/30 flex flex-col md:flex-row items-center justify-between gap-4 transition-all mb-6 select-none">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-amber-500/20 border border-amber-400/30 flex items-center justify-center text-amber-400 shrink-0">
            <Sparkles size={18} />
          </div>
          <div>
            <h4 className="font-bold text-sm text-white flex items-center gap-1.5">
              🎯 Şu anda Demo Modundasınız
              {countsSummary && (
                <span className="text-xs text-amber-300/90 font-medium">({countsSummary})</span>
              )}
            </h4>
            <p className="text-xs text-amber-200/80 font-medium mt-0.5">
              Bu mod uygulamanın tüm özelliklerini incelemeniz için hazırlanmıştır. Demo verileri
              üzerinde değişiklik yapılamaz.
            </p>
          </div>
        </div>

        <div className="shrink-0">
          <button
            onClick={() => setIsConfirmOpen(true)}
            disabled={loading}
            className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-600 active:scale-[0.98] text-slate-950 font-extrabold text-xs shadow-md transition-all flex items-center gap-2 cursor-pointer disabled:opacity-50"
          >
            <LogOut size={14} />
            <span>Demo'dan Çık</span>
          </button>
        </div>
      </div>

      <Modal
        isOpen={isConfirmOpen}
        onClose={() => setIsConfirmOpen(false)}
        title="Demo Modundan Çık"
        footer={
          <div className="flex justify-end gap-3">
            <Button variant="outline" onClick={() => setIsConfirmOpen(false)}>
              İptal
            </Button>
            <Button
              variant="primary"
              className="bg-red-600 hover:bg-red-700 text-white"
              onClick={handleExitConfirm}
              loading={loading}
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
            </Button>
          </div>
        }
      >
        <div className="flex items-start gap-4 text-left">
          <div className="w-10 h-10 rounded-full bg-red-100 dark:bg-red-950/40 text-red-600 flex items-center justify-center shrink-0">
            <AlertTriangle size={20} />
          </div>
          <div className="space-y-2">
            <h4 className="font-bold text-sm text-slate-800 dark:text-white">
              Demo modundan çıkmak istediğinize emin misiniz?
            </h4>
            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed font-medium">
              Demo verileri silinecek, manuel eklediğiniz gerçek verileriniz kesinlikle
              korunacaktır.
            </p>
          </div>
        </div>
      </Modal>
    </>
  );
};

export default DemoModeBanner;
