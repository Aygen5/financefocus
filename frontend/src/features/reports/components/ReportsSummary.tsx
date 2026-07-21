import React from "react";
import { TrendingUp, Landmark, ShieldAlert, Sparkles } from "lucide-react";
import { formatCurrency } from "@/utils/financial";

export interface ReportsSummaryProps {
  netWorth: number;
  expenses: number;
  savingsProgress: number;
  riskScore: string;
  loading?: boolean;
}

const ReportsSummary: React.FC<ReportsSummaryProps> = ({
  netWorth,
  expenses,
  savingsProgress,
  riskScore,
  loading = false,
}) => {
  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-4 gap-gutter">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="h-32 animate-pulse rounded-xl bg-slate-100 dark:bg-slate-800" />
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-gutter text-left">
      {/* Net Worth */}
      <div className="bg-white dark:bg-slate-900 p-6 rounded-xl border border-slate-200/80 dark:border-slate-800/80 hover:shadow-soft-md transition-shadow group">
        <div className="flex justify-between items-start mb-4">
          <div className="p-2 bg-primary/10 text-primary dark:text-brand-400 rounded-lg">
            <TrendingUp size={20} />
          </div>
          <span className="text-xs font-bold text-emerald-600 bg-emerald-50 dark:bg-emerald-950/20 px-2 py-1 rounded">
            +12.5%
          </span>
        </div>
        <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">
          Total Net Worth
        </p>
        <h3 className="font-headline-md text-headline-md text-slate-800 dark:text-white font-extrabold">
          {formatCurrency(netWorth, "TRY", "tr-TR")}
        </h3>
      </div>

      <div className="bg-white dark:bg-slate-900 p-6 rounded-xl border border-slate-200/80 dark:border-slate-800/80 hover:shadow-soft-md transition-shadow group">
        <div className="flex justify-between items-start mb-4">
          <div className="p-2 bg-amber-500/10 text-amber-600 rounded-lg">
            <Landmark size={20} />
          </div>
          <span className="text-xs font-bold text-red-650 bg-red-50 dark:bg-red-950/20 px-2 py-1 rounded">
            -2.4%
          </span>
        </div>
        <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">
          Monthly Expenses
        </p>
        <h3 className="font-headline-md text-headline-md text-slate-800 dark:text-white font-extrabold">
          {formatCurrency(expenses, "TRY", "tr-TR")}
        </h3>
      </div>

      <div className="bg-white dark:bg-slate-900 p-6 rounded-xl border border-slate-200/80 dark:border-slate-800/80 hover:shadow-soft-md transition-shadow group">
        <div className="flex justify-between items-start mb-4">
          <div className="p-2 bg-emerald-500/10 text-emerald-600 rounded-lg">
            <Sparkles size={20} />
          </div>
          <span className="text-xs font-bold text-emerald-600 bg-emerald-50 dark:bg-emerald-950/20 px-2 py-1 rounded">
            +8.1%
          </span>
        </div>
        <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">
          Savings Goal Progress
        </p>
        <h3 className="font-headline-md text-headline-md text-slate-800 dark:text-white font-extrabold">
          {savingsProgress}%
        </h3>
      </div>

      <div className="bg-white dark:bg-slate-900 p-6 rounded-xl border border-slate-200/80 dark:border-slate-800/80 hover:shadow-soft-md transition-shadow group">
        <div className="flex justify-between items-start mb-4">
          <div className="p-2 bg-red-500/10 text-red-600 rounded-lg">
            <ShieldAlert size={20} />
          </div>
          <span className="text-xs font-bold text-slate-400 bg-slate-50 dark:bg-slate-800 px-2 py-1 rounded">
            Stable
          </span>
        </div>
        <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Risk Score</p>
        <h3 className="font-headline-md text-headline-md text-slate-800 dark:text-white font-extrabold">
          {riskScore}
        </h3>
      </div>
    </div>
  );
};

export default ReportsSummary;
