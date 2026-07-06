import React, { useState } from "react";
import { TrendingUp } from "lucide-react";
import { formatCurrency } from "@/utils/financial";

const SavingsTrajectory: React.FC = () => {
  const [savingsRate, setSavingsRate] = useState(15000);

  // Basit dinamik özgürlük tarihi simülasyonu
  // ₺15000 -> Ekim 2034. Her +₺5000 artışta tarihi yaklaşık 8 ay öne çekeriz
  const calculateFreedomDate = (rate: number) => {
    // Değişime göre ay farkı hesapla
    const difference = rate - 15000;
    const monthsOffset = Math.round((difference / 1000) * -1.5); // Her ₺1000 tasarruf artışı 1.5 ay kazandırır

    const targetDate = new Date(2026, 9, 1); // Bugünden itibaren simülasyon
    // 2026 Ekim + (2034 Ekim - 2026 Ekim = 96 ay) + monthsOffset
    const totalMonths = 96 + monthsOffset;
    targetDate.setMonth(targetDate.getMonth() + totalMonths);

    return targetDate.toLocaleDateString("tr-TR", { month: "long", year: "numeric" });
  };

  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800/80 rounded-xl p-6 shadow-soft-sm text-left">
      <h3 className="font-label-md text-label-md font-bold text-slate-800 dark:text-white uppercase tracking-wider mb-4">
        Birikim Projeksiyonu (Savings Trajectory)
      </h3>

      <div className="mb-6">
        <div className="flex justify-between items-end mb-2">
          <span className="font-body-sm text-body-sm text-slate-500 font-medium">
            Aylık Birikim Oranı
          </span>
          <span className="font-headline-sm text-headline-sm text-primary dark:text-brand-400 font-extrabold leading-none">
            {formatCurrency(savingsRate, "TRY", "tr-TR")}
          </span>
        </div>
        <input
          type="range"
          min="5000"
          max="50000"
          step="500"
          value={savingsRate}
          onChange={(e) => setSavingsRate(Number(e.target.value))}
          className="w-full h-1.5 bg-slate-100 dark:bg-slate-800 rounded-lg appearance-none cursor-pointer accent-primary"
        />
        <div className="flex justify-between text-[11px] text-slate-400 font-bold mt-1.5">
          <span>₺5.000</span>
          <span>₺50.000</span>
        </div>
      </div>

      {/* Trajectory Insights widget */}
      <div className="p-4 bg-slate-50 dark:bg-slate-850 rounded-lg border border-slate-200/50 dark:border-slate-800/80 flex items-start gap-3">
        <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary shrink-0">
          <TrendingUp size={16} />
        </div>
        <div>
          <h4 className="text-xs font-bold text-slate-700 dark:text-white mb-1">
            Finansal Özgürlük Hedefi
          </h4>
          <p className="text-[11px] text-slate-500 leading-relaxed font-semibold">
            Mevcut tasarruf oranıyla finansal özgürlük hedefinize{" "}
            <span className="text-primary dark:text-brand-400 font-bold">
              {calculateFreedomDate(savingsRate)}
            </span>{" "}
            tarihinde ulaşmanız bekleniyor. Tasarrufunuzu artırarak bu süreyi kısaltabilirsiniz.
          </p>
        </div>
      </div>
    </div>
  );
};

export default SavingsTrajectory;
