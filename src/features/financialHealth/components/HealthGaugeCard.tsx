import React from "react";
import { formatCurrency } from "@/utils/financial";

export interface HealthGaugeCardProps {
  score: number;
  loading?: boolean;
}

const HealthGaugeCard: React.FC<HealthGaugeCardProps> = ({ score, loading = false }) => {
  if (loading) {
    return <div className="h-80 animate-pulse rounded-xl bg-slate-100 dark:bg-slate-800" />;
  }

  // SVG dairesel gösterge hesaplamaları
  const radius = 90;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (score / 100) * circumference;

  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800/80 rounded-xl p-8 flex flex-col md:flex-row items-center gap-10 shadow-soft-sm text-left h-full">
      {/* Gauge SVG Circle chart */}
      <div className="relative w-48 h-48 flex-shrink-0 flex items-center justify-center">
        <svg className="w-full h-full transform -rotate-90" viewBox="0 0 200 200">
          <circle
            cx="100"
            cy="100"
            r={radius}
            fill="none"
            stroke="#f1f5f9"
            className="dark:stroke-slate-800"
            strokeWidth="12"
          />
          <circle
            cx="100"
            cy="100"
            r={radius}
            fill="none"
            stroke="#004ac6"
            strokeWidth="12"
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            className="transition-all duration-1000 ease-out"
          />
        </svg>
        <div className="absolute flex flex-col items-center justify-center select-none">
          <span className="font-display-lg text-display-lg text-primary dark:text-brand-400 font-extrabold leading-none">
            {score}
          </span>
          <span className="font-label-md text-label-md text-slate-400 dark:text-slate-500 uppercase tracking-widest mt-1">
            Exceptional
          </span>
        </div>
      </div>

      {/* Detail info */}
      <div className="flex-1 space-y-6">
        <div>
          <h3 className="font-headline-md text-headline-md text-slate-800 dark:text-white font-bold mb-2">
            En iyi %2'lik dilimdesiniz
          </h3>
          <p className="font-body-md text-body-md text-slate-550 dark:text-slate-400 leading-relaxed font-medium">
            Finansal alışkanlıklarınız, yüksek net değerli en iyi uygulamalarla uyumludur. Güçlü
            likiditeniz var ve üretken olmayan borçlarınız oldukça düşük seviyede.
          </p>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div className="p-4 bg-slate-50 dark:bg-slate-850 rounded-lg border border-slate-200/50 dark:border-slate-800/80">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
              Monthly Surplus
            </span>
            <span className="font-headline-sm text-headline-sm text-primary dark:text-brand-400 font-extrabold">
              {formatCurrency(4290, "USD", "en-US")}
            </span>
          </div>
          <div className="p-4 bg-slate-50 dark:bg-slate-850 rounded-lg border border-slate-200/50 dark:border-slate-800/80">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
              Safety Margin
            </span>
            <span className="font-headline-sm text-headline-sm text-primary dark:text-brand-400 font-extrabold">
              14 Months
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HealthGaugeCard;
