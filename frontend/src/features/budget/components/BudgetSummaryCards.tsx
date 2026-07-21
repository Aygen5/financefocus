import React from "react";
import { Landmark, Banknote, Wallet } from "lucide-react";
import { formatCurrency } from "@/utils/financial";

export interface BudgetSummaryCardsProps {
  totalBudget: number;
  spent: number;
  remaining: number;
  loading?: boolean;
}

const BudgetSummaryCards: React.FC<BudgetSummaryCardsProps> = ({
  totalBudget,
  spent,
  remaining,
  loading = false,
}) => {
  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-3 gap-gutter mb-stack-lg">
        <div className="h-32 animate-pulse rounded-xl bg-slate-100 dark:bg-slate-800" />
        <div className="h-32 animate-pulse rounded-xl bg-slate-100 dark:bg-slate-800" />
        <div className="h-32 animate-pulse rounded-xl bg-slate-100 dark:bg-slate-800" />
      </div>
    );
  }

  const spentPercentage = totalBudget > 0 ? Math.round((spent / totalBudget) * 100) : 0;

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-gutter mb-stack-lg text-left">
      {/* Total Budget */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800/80 rounded-xl p-6 shadow-soft-sm flex flex-col justify-between">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-full bg-blue-500/10 flex items-center justify-center text-primary dark:text-brand-400">
            <Landmark size={20} />
          </div>
          <h3 className="font-label-md text-label-md text-slate-500 uppercase tracking-wider">
            Toplam Bütçe
          </h3>
        </div>
        <div>
          <p className="font-display-lg text-display-lg text-slate-800 dark:text-white leading-none">
            {formatCurrency(totalBudget, "TRY", "tr-TR")}
          </p>
          <p className="font-body-sm text-body-sm text-slate-400 mt-2 font-medium">Aylık Limit</p>
        </div>
      </div>

      {/* Spent */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800/80 rounded-xl p-6 shadow-soft-sm flex flex-col justify-between">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-full bg-red-500/10 flex items-center justify-center text-red-650">
            <Banknote size={20} />
          </div>
          <h3 className="font-label-md text-label-md text-slate-500 uppercase tracking-wider">
            Harcanan
          </h3>
        </div>
        <div>
          <p className="font-display-lg text-display-lg text-slate-800 dark:text-white leading-none">
            {formatCurrency(spent, "TRY", "tr-TR")}
          </p>
          <div className="flex items-center gap-2 mt-2 font-semibold text-xs">
            <span className="bg-red-50 dark:bg-red-950/20 text-red-600 dark:text-red-400 px-2 py-0.5 rounded-full">
              %{spentPercentage}
            </span>
            <span className="text-slate-400 dark:text-slate-500 font-medium">
              toplam bütçe oranı
            </span>
          </div>
        </div>
      </div>

      {/* Remaining */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800/80 rounded-xl p-6 shadow-soft-sm flex flex-col justify-between">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-full bg-emerald-500/10 flex items-center justify-center text-emerald-600">
            <Wallet size={20} />
          </div>
          <h3 className="font-label-md text-label-md text-slate-500 uppercase tracking-wider">
            Kalan Bütçe
          </h3>
        </div>
        <div>
          <p className="font-display-lg text-display-lg text-primary dark:text-brand-400 leading-none">
            {formatCurrency(remaining, "TRY", "tr-TR")}
          </p>
          <p className="font-body-sm text-body-sm text-slate-400 mt-2 font-medium">
            Harcanabilir Tutar
          </p>
        </div>
      </div>
    </div>
  );
};

export default BudgetSummaryCards;
