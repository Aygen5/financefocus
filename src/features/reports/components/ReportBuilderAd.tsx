import React from "react";
import Button from "@/components/ui/Button";

export interface ReportBuilderAdProps {
  onBuildReport?: () => void;
}

const ReportBuilderAd: React.FC<ReportBuilderAdProps> = ({ onBuildReport }) => {
  return (
    <div className="bg-blue-600/90 dark:bg-brand-900/40 text-white p-8 rounded-2xl overflow-hidden relative text-left">
      <div className="relative z-10 grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
        <div>
          <h3 className="font-headline-lg text-headline-lg font-bold mb-4">
            Aradığınız raporu bulamadınız mı?
          </h3>
          <p className="font-body-lg text-body-lg text-blue-100 dark:text-slate-350 opacity-90 mb-6 font-medium">
            Gelişmiş veri motorumuzu kullanarak özel bir finansal rapor oluşturun. Saniyeler içinde
            parametrelerinizi, boyutlarınızı ve görsel stillerinizi seçin.
          </p>
          <Button
            variant="primary"
            onClick={onBuildReport}
            className="bg-white hover:bg-slate-100 text-blue-600 font-bold border-none shadow-xl shadow-blue-900/20"
          >
            Report Builder'ı Aç
          </Button>
        </div>

        <div className="hidden md:flex justify-center select-none">
          <div className="relative w-72 h-48 bg-white/10 rounded-xl border border-white/20 backdrop-blur-md p-4 rotate-3 transform hover:rotate-0 transition-transform duration-500">
            <div className="w-full h-4 bg-white/20 rounded mb-4" />
            <div className="grid grid-cols-3 gap-2 mb-4">
              <div className="h-20 bg-white/10 rounded" />
              <div className="h-20 bg-white/30 rounded" />
              <div className="h-20 bg-white/10 rounded" />
            </div>
            <div className="w-2/3 h-3 bg-white/10 rounded" />
          </div>
          <div className="absolute w-72 h-48 bg-white/5 rounded-xl border border-white/10 backdrop-blur-sm p-4 -rotate-6 -translate-x-12 -translate-y-4 -z-10" />
        </div>
      </div>

      <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -mr-32 -mt-32 pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-64 h-64 bg-amber-500/10 rounded-full blur-3xl -ml-32 -mb-32 pointer-events-none" />
    </div>
  );
};

export default ReportBuilderAd;
