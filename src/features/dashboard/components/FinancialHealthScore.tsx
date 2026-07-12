import React from "react";
import Card from "@/components/ui/Card";

export interface FinancialHealthScoreProps {
  score: number;
  loading?: boolean;
}

const FinancialHealthScore: React.FC<FinancialHealthScoreProps> = ({ score, loading = false }) => {
  const strokeLength = 110;
  const strokeOffset = strokeLength - (strokeLength * score) / 100;

  return (
    <Card title="Finansal Sağlık" className="flex flex-col items-center text-center">
      {loading ? (
        <div className="space-y-4 w-full flex flex-col items-center">
          <div className="h-20 w-40 animate-pulse rounded-t-full bg-slate-100 dark:bg-slate-800" />
          <div className="h-4 w-1/3 animate-pulse rounded bg-slate-100 dark:bg-slate-800" />
          <div className="h-10 w-full animate-pulse rounded bg-slate-100 dark:bg-slate-800" />
        </div>
      ) : (
        <div className="flex flex-col items-center w-full">
          {/* SVG Gauge */}
          <div className="relative w-40 h-24 flex items-center justify-center overflow-hidden">
            <svg viewBox="0 0 100 50" className="w-40 h-20 absolute top-2">
              {/* Background Arc */}
              <path
                d="M 15 50 A 35 35 0 0 1 85 50"
                fill="none"
                stroke="var(--color-surface-container-highest, #e2e8f0)"
                className="stroke-slate-100 dark:stroke-slate-800"
                strokeWidth="10"
                strokeLinecap="round"
              />

              <path
                d="M 15 50 A 35 35 0 0 1 85 50"
                fill="none"
                stroke="#0053db"
                strokeWidth="10"
                strokeLinecap="round"
                strokeDasharray={strokeLength}
                strokeDashoffset={strokeOffset}
                className="transition-all duration-1000 ease-out"
              />
            </svg>
            <div className="absolute bottom-1 flex flex-col items-center">
              <span className="text-3xl font-extrabold text-slate-800 dark:text-white leading-none">
                {score}
              </span>
              <span className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 mt-1 select-none">
                100 üzerinden
              </span>
            </div>
          </div>

          <p className="text-[13px] text-slate-700 dark:text-slate-350 bg-slate-50 dark:bg-slate-900/60 p-3.5 rounded-xl border border-slate-200/50 dark:border-slate-800/60 leading-relaxed mt-4 w-full text-left">
            Kullanıcıların **en iyi %15'lik** dilimindesiniz. Düşük limit kullanımını korumaya devam
            edin.
          </p>
        </div>
      )}
    </Card>
  );
};

export default FinancialHealthScore;
