import React from "react";
import Button from "@/components/ui/Button";
import { CheckCircle2, Rocket } from "lucide-react";

export interface PathToPerfectScoreProps {
  onUnlockRoadmap?: () => void;
}

const PathToPerfectScore: React.FC<PathToPerfectScoreProps> = ({ onUnlockRoadmap }) => {
  return (
    <div className="bg-blue-600/90 dark:bg-brand-900/40 text-white rounded-xl overflow-hidden relative shadow-soft-sm h-full flex flex-col justify-between p-8 text-left">
      <div>
        <h3 className="font-headline-sm text-headline-sm font-bold mb-2">The Path to 100</h3>
        <p className="font-body-md text-body-md text-blue-100 dark:text-slate-350 opacity-90 mb-8 font-medium">
          Mükemmel bir finansal puana ulaşmak için sadece 8 puanınız kaldı. Mevcut gidişatınız Kasım
          ayına kadar 100 puana ulaşacağınızı gösteriyor.
        </p>

        <div className="space-y-4">
          <div className="flex items-center gap-4 bg-white/10 p-4 rounded-lg border border-white/20">
            <CheckCircle2 size={24} className="text-white flex-shrink-0" />
            <div>
              <p className="font-label-md text-label-md font-bold">Borç Dönüm Noktasına Ulaşıldı</p>
              <p className="text-body-sm text-body-sm text-blue-100 dark:text-slate-300 opacity-80 mt-0.5">
                Konut kredisi (Mortgage) artık kalan tek borcunuz.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-4 bg-white/10 p-4 rounded-lg border border-white/20">
            <Rocket size={24} className="text-white flex-shrink-0" />
            <div>
              <p className="font-label-md text-label-md font-bold">Sonraki Hedef: Net Worth</p>
              <p className="text-body-sm text-body-sm text-blue-100 dark:text-slate-300 opacity-80 mt-0.5">
                4 ay içinde $1.2M sınırının aşılacağı tahmin ediliyor.
              </p>
            </div>
          </div>
        </div>
      </div>

      <Button
        variant="primary"
        onClick={onUnlockRoadmap}
        className="mt-8 bg-white hover:bg-slate-100 text-blue-600 font-bold border-none shadow-xl shadow-blue-900/20"
      >
        Tüm Yol Haritasının Kilidini Aç
      </Button>
    </div>
  );
};

export default PathToPerfectScore;
