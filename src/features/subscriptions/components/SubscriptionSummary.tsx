import React from "react";
import { TrendingUp, CreditCard, CalendarDays, RefreshCw } from "lucide-react";
import { formatCurrency } from "@/utils/financial";

export interface SubscriptionSummaryProps {
  totalCost: number;
  activeCount: number;
  dueSoonCount: number;
  autoRenewCount: number;
  loading?: boolean;
}

const SubscriptionSummary: React.FC<SubscriptionSummaryProps> = ({
  totalCost,
  activeCount,
  dueSoonCount,
  autoRenewCount,
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
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-gutter mb-stack-lg text-left">
      {/* Total Monthly Cost */}
      <div className="bg-white dark:bg-slate-900 p-6 rounded-xl border border-slate-200/80 dark:border-slate-800/80 shadow-soft-sm hover:shadow-soft-md transition-shadow">
        <div className="flex items-center justify-between mb-4">
          <span className="text-slate-500 font-label-sm uppercase tracking-wider">
            Total Monthly Cost
          </span>
          <div className="p-2 bg-primary/10 rounded-lg text-primary">
            <CreditCard size={20} />
          </div>
        </div>
        <div className="flex items-baseline gap-2">
          <span className="font-display-lg text-headline-lg text-slate-800 dark:text-white font-extrabold">
            {formatCurrency(totalCost, "USD", "en-US")}
          </span>
          <span className="text-xs font-bold text-red-650 bg-red-50 dark:bg-red-950/20 px-2 py-0.5 rounded-full flex items-center gap-0.5">
            <TrendingUp size={12} />
            4.2%
          </span>
        </div>
        <p className="text-xs text-slate-400 dark:text-slate-500 mt-2 font-medium">v. geçen ay</p>
      </div>

      {/* Active Subscriptions */}
      <div className="bg-white dark:bg-slate-900 p-6 rounded-xl border border-slate-200/80 dark:border-slate-800/80 shadow-soft-sm hover:shadow-soft-md transition-shadow">
        <div className="flex items-center justify-between mb-4">
          <span className="text-slate-500 font-label-sm uppercase tracking-wider">
            Active Subscriptions
          </span>
          <div className="p-2 bg-slate-500/10 rounded-lg text-slate-500">
            <RefreshCw size={20} />
          </div>
        </div>
        <div className="flex items-baseline gap-2">
          <span className="font-display-lg text-headline-lg text-slate-800 dark:text-white font-extrabold">
            {activeCount}
          </span>
          <span className="text-slate-400 dark:text-slate-500 font-label-sm">Aktif</span>
        </div>
        <p className="text-xs text-slate-400 dark:text-slate-500 mt-2 font-medium">
          4 farklı kategoride
        </p>
      </div>

      {/* Upcoming Payments */}
      <div className="bg-white dark:bg-slate-900 p-6 rounded-xl border border-slate-200/80 dark:border-slate-800/80 shadow-soft-sm hover:shadow-soft-md transition-shadow">
        <div className="flex items-center justify-between mb-4">
          <span className="text-slate-500 font-label-sm uppercase tracking-wider">
            Upcoming Payments
          </span>
          <div className="p-2 bg-amber-500/10 rounded-lg text-amber-600">
            <CalendarDays size={20} />
          </div>
        </div>
        <div className="flex items-baseline gap-2">
          <span className="font-display-lg text-headline-lg text-slate-800 dark:text-white font-extrabold">
            {dueSoonCount < 10 ? `0${dueSoonCount}` : dueSoonCount}
          </span>
          <span className="text-slate-400 dark:text-slate-500 font-label-sm">Ödeme Yakın</span>
        </div>
        <p className="text-xs text-slate-400 dark:text-slate-500 mt-2 font-medium">
          Gelecek 7 gün içinde
        </p>
      </div>

      {/* Auto Renew Count */}
      <div className="bg-white dark:bg-slate-900 p-6 rounded-xl border border-slate-200/80 dark:border-slate-800/80 shadow-soft-sm hover:shadow-soft-md transition-shadow">
        <div className="flex items-center justify-between mb-4">
          <span className="text-slate-500 font-label-sm uppercase tracking-wider">
            Auto Renew Count
          </span>
          <div className="p-2 bg-emerald-500/10 rounded-lg text-emerald-600">
            <RefreshCw size={20} />
          </div>
        </div>
        <div className="flex items-baseline gap-2">
          <span className="font-display-lg text-headline-lg text-slate-800 dark:text-white font-extrabold">
            {autoRenewCount}
          </span>
          <span className="text-slate-400 dark:text-slate-500 font-label-sm">Açık</span>
        </div>
        <p className="text-xs text-slate-400 dark:text-slate-500 mt-2 font-medium">
          Otomatik faturalama aktif
        </p>
      </div>
    </div>
  );
};

export default SubscriptionSummary;
