import React, { useState } from "react";
import { TrendingUp } from "lucide-react";
import { formatCurrency } from "@/utils/financial";

const SavingsTrajectory: React.FC = () => {
  const [savingsRate, setSavingsRate] = useState(1500);

  // Basit dinamik özgürlük tarihi simülasyonu
  // $1500 -> Ekim 2034. Her +$500 artışta tarihi yaklaşık 8 ay öne çekeriz
  const calculateFreedomDate = (rate: number) => {
    // Değişime göre ay farkı hesapla
    const difference = rate - 1500;
    const monthsOffset = Math.round((difference / 100) * -1.5); // Her $100 tasarruf artışı 1.5 ay kazandırır

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
            {formatCurrency(savingsRate, "USD", "en-US")}
          </span>
        </div>
        <input
          type="range"
          min="500"
          max="5000"
          step="100"
          value={savingsRate}
          onChange={(e) => setSavingsRate(Number(e.target.value))}
          className="w-full h-1.5 bg-slate-100 dark:bg-slate-800 rounded-lg appearance-none cursor-pointer accent-primary"
        />
        <div className="flex justify-between text-[11px] text-slate-400 font-bold mt-1.5">
          <span>$500</span>
          <span>$5,000</span>
        </div>
      </div>

      <div className="bg-slate-50 dark:bg-slate-800/50 rounded-xl p-4 border border-slate-200/50 dark:border-slate-800/60">
        <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1">
          Tahmini Finansal Özgürlük Tarihi
        </div>
        <div className="font-headline-md text-headline-md text-slate-800 dark:text-white font-extrabold flex items-center gap-2">
          {calculateFreedomDate(savingsRate)}
          <span className="text-primary dark:text-brand-400">
            <TrendingUp size={20} />
          </span>
        </div>
      </div>
    </div>
  );
};

export default SavingsTrajectory;
