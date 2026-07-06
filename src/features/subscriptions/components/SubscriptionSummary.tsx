import React from "react";
import { CreditCard, CalendarDays, RefreshCw, AlertCircle } from "lucide-react";
import { formatCurrency } from "@/utils/financial";

export interface SubscriptionSummaryProps {
  monthlyTotal: number;
  yearlyTotal: number;
  averageCost: number;
  mostExpensiveName: string;
  mostExpensiveCost: number;
  loading?: boolean;
}

const SubscriptionSummary: React.FC<SubscriptionSummaryProps> = ({
  monthlyTotal,
  yearlyTotal,
  averageCost,
  mostExpensiveName,
  mostExpensiveCost,
  loading = false,
}) => {
  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-gutter mb-stack-lg">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="h-32 animate-pulse rounded-xl bg-slate-100 dark:bg-slate-800" />
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-gutter mb-stack-lg text-left select-none">
      {/* Monthly Total Cost */}
      <div className="bg-white dark:bg-slate-900 p-6 rounded-xl border border-slate-200/80 dark:border-slate-800/80 shadow-soft-sm hover:shadow-soft-md transition-shadow">
        <div className="flex items-center justify-between mb-4">
          <span className="text-slate-500 font-label-sm uppercase tracking-wider text-[10px]">
            Aylık Toplam Maliyet
          </span>
          <div className="p-2 bg-primary/10 rounded-lg text-primary">
            <CreditCard size={18} />
          </div>
        </div>
        <div className="flex items-baseline gap-2">
          <span className="font-display-lg text-headline-lg text-slate-850 dark:text-white font-black">
            {formatCurrency(monthlyTotal, "TRY")}
          </span>
        </div>
        <p className="text-[10px] font-bold text-slate-400 dark:text-slate-500 mt-2">
          Aylık eşdeğer tüm harcamalar
        </p>
      </div>

      {/* Yearly Total Cost */}
      <div className="bg-white dark:bg-slate-900 p-6 rounded-xl border border-slate-200/80 dark:border-slate-800/80 shadow-soft-sm hover:shadow-soft-md transition-shadow">
        <div className="flex items-center justify-between mb-4">
          <span className="text-slate-500 font-label-sm uppercase tracking-wider text-[10px]">
            Yıllık Toplam Maliyet
          </span>
          <div className="p-2 bg-emerald-500/10 rounded-lg text-emerald-600">
            <CalendarDays size={18} />
          </div>
        </div>
        <div className="flex items-baseline gap-2">
          <span className="font-display-lg text-headline-lg text-slate-850 dark:text-white font-black">
            {formatCurrency(yearlyTotal, "TRY")}
          </span>
        </div>
        <p className="text-[10px] font-bold text-slate-400 dark:text-slate-500 mt-2">
          12 aylık kümülatif harcama
        </p>
      </div>

      {/* Most Expensive Subscription */}
      <div className="bg-white dark:bg-slate-900 p-6 rounded-xl border border-slate-200/80 dark:border-slate-800/80 shadow-soft-sm hover:shadow-soft-md transition-shadow">
        <div className="flex items-center justify-between mb-4">
          <span className="text-slate-500 font-label-sm uppercase tracking-wider text-[10px]">
            En Pahalı Abonelik
          </span>
          <div className="p-2 bg-red-500/10 rounded-lg text-red-650">
            <AlertCircle size={18} />
          </div>
        </div>
        <div className="flex items-baseline gap-2 overflow-hidden text-ellipsis whitespace-nowrap">
          <span className="font-display-lg text-headline-lg text-slate-850 dark:text-white font-black">
            {mostExpensiveName || "Yok"}
          </span>
        </div>
        <p className="text-[10px] font-black text-red-600 dark:text-red-400 mt-2">
          {mostExpensiveCost > 0 ? formatCurrency(mostExpensiveCost, "TRY") : "0.00 TL"} / Ay
          eşdeğeri
        </p>
      </div>

      {/* Average Cost */}
      <div className="bg-white dark:bg-slate-900 p-6 rounded-xl border border-slate-200/80 dark:border-slate-800/80 shadow-soft-sm hover:shadow-soft-md transition-shadow">
        <div className="flex items-center justify-between mb-4">
          <span className="text-slate-500 font-label-sm uppercase tracking-wider text-[10px]">
            Ortalama Aylık Gider
          </span>
          <div className="p-2 bg-purple-500/10 rounded-lg text-purple-650">
            <RefreshCw size={18} />
          </div>
        </div>
        <div className="flex items-baseline gap-2">
          <span className="font-display-lg text-headline-lg text-slate-850 dark:text-white font-black">
            {formatCurrency(averageCost, "TRY")}
          </span>
        </div>
        <p className="text-[10px] font-bold text-slate-400 dark:text-slate-500 mt-2">
          Abonelik başına ortalama maliyet
        </p>
      </div>
    </div>
  );
};

export default SubscriptionSummary;
