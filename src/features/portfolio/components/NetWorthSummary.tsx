import React from "react";
import { TrendingUp, TrendingDown, Award } from "lucide-react";
import { formatCurrency } from "@/utils/financial";

export interface NetWorthSummaryProps {
  netWorth: number;
  assetsTotal: number;
  largestAssetName: string;
  largestAssetValue: number;
  trend: number;
  trendValue: number;
  loading?: boolean;
}

const NetWorthSummary: React.FC<NetWorthSummaryProps> = ({
  netWorth,
  assetsTotal,
  largestAssetName,
  largestAssetValue,
  trend,
  trendValue,
  loading = false,
}) => {
  if (loading) {
    return <div className="h-64 animate-pulse rounded-xl bg-slate-100 dark:bg-slate-800" />;
  }

  const isTrendUp = trend >= 0;

  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800/80 rounded-xl p-6 shadow-soft-sm flex flex-col justify-between text-left h-full select-none">
      <div>
        <h3 className="font-label-sm text-label-sm text-slate-500 uppercase tracking-wider mb-2">
          Toplam Portföy Değeri
        </h3>
        <div className="font-display-lg text-display-lg text-slate-800 dark:text-white leading-none font-extrabold">
          {formatCurrency(netWorth, "TRY", "tr-TR")}
        </div>
        <div className="flex items-center gap-1 mt-3">
          <span
            className={`flex items-center gap-0.5 font-semibold text-sm ${
              isTrendUp ? "text-emerald-600" : "text-red-500"
            }`}
          >
            {isTrendUp ? <TrendingUp size={16} /> : <TrendingDown size={16} />}
            {isTrendUp ? "+" : ""}
            {trend}% ({formatCurrency(trendValue, "TRY", "tr-TR")})
          </span>
          <span className="text-xs text-slate-400 dark:text-slate-500 ml-2 font-medium">
            Toplam Kâr/Zarar
          </span>
        </div>
      </div>

      <div className="mt-8 pt-6 border-t border-slate-100 dark:border-slate-800/80 flex justify-between gap-4">
        <div>
          <div className="font-label-sm text-label-sm text-slate-400 dark:text-slate-500 mb-1">
            Toplam Varlık
          </div>
          <div className="font-headline-sm text-headline-sm text-primary dark:text-brand-400 font-extrabold">
            {formatCurrency(assetsTotal, "TRY", "tr-TR")}
          </div>
        </div>
        <div className="text-right">
          <div className="font-label-sm text-label-sm text-slate-400 dark:text-slate-500 mb-1 flex items-center justify-end gap-1">
            <Award size={12} className="text-amber-500" />
            En Büyük Varlık
          </div>
          <div className="font-headline-sm text-headline-sm text-slate-800 dark:text-slate-200 font-extrabold">
            {largestAssetName} ({formatCurrency(largestAssetValue, "TRY", "tr-TR")})
          </div>
        </div>
      </div>
    </div>
  );
};

export default NetWorthSummary;
