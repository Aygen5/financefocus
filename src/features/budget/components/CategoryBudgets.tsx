import React from "react";
import { Home, Utensils, Car, Film, ShieldAlert, HeartHandshake } from "lucide-react";
import ProgressBar from "@/components/display/ProgressBar";
import type { Budget } from "../budgetSlice";
import { formatCurrency } from "@/utils/financial";

export interface CategoryBudgetsProps {
  budgets: Budget[];
  loading?: boolean;
}

const CategoryBudgets: React.FC<CategoryBudgetsProps> = ({ budgets, loading = false }) => {
  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-gutter">
        <div className="h-44 animate-pulse rounded-xl bg-slate-100 dark:bg-slate-800" />
        <div className="h-44 animate-pulse rounded-xl bg-slate-100 dark:bg-slate-800" />
      </div>
    );
  }

  // Kategori ikon helper
  const getCategoryIcon = (category: string) => {
    const lower = category.toLowerCase();
    if (lower.includes("housing") || lower.includes("konut") || lower.includes("kira")) {
      return <Home size={22} />;
    }
    if (
      lower.includes("food") ||
      lower.includes("yemek") ||
      lower.includes("gıda") ||
      lower.includes("market")
    ) {
      return <Utensils size={22} />;
    }
    if (lower.includes("transport") || lower.includes("ulaşım") || lower.includes("araba")) {
      return <Car size={22} />;
    }
    if (lower.includes("entertainment") || lower.includes("eğlence") || lower.includes("sinema")) {
      return <Film size={22} />;
    }
    return <HeartHandshake size={22} />;
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-gutter text-left">
      {budgets.map((budget) => {
        const spent = budget.spentAmount;
        const limit = budget.limitAmount;
        const isOver = spent > limit;
        const remaining = Math.max(limit - spent, 0);
        const overAmount = Math.max(spent - limit, 0);
        const ratio = limit > 0 ? spent / limit : 0;
        const percentage = Math.round(ratio * 100);

        const isSavings =
          budget.category.toLowerCase().includes("savings") ||
          budget.category.toLowerCase().includes("tasarruf") ||
          budget.category.toLowerCase().includes("invest");

        // Bütçe kartının genişliği (Tasarruf kartı geniş grid kaplar)
        const gridColSpan = isSavings ? "col-span-1 md:col-span-2" : "col-span-1";

        return (
          <div
            key={budget.id}
            className={`bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800/80 rounded-xl p-6 shadow-soft-sm hover:shadow-soft-md transition-shadow relative overflow-hidden ${gridColSpan}`}
          >
            {/* Limit aşımında sağ üstte hafif kırmızı gölge detayı */}
            {isOver && (
              <div className="absolute top-0 right-0 w-16 h-16 bg-red-500/5 rotate-45 translate-x-8 -translate-y-8 rounded-lg pointer-events-none" />
            )}

            {/* Header */}
            <div className="flex justify-between items-start mb-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-200/50 dark:border-slate-800/80 flex items-center justify-center text-slate-550 dark:text-slate-400">
                  {getCategoryIcon(budget.category)}
                </div>
                <div>
                  <h4 className="font-headline-sm text-headline-sm text-slate-800 dark:text-white font-bold leading-tight">
                    {budget.category}
                  </h4>
                  <p className="text-[11px] font-medium text-slate-400 dark:text-slate-500 mt-1">
                    {budget.description || "Aylık Harcama Limiti"}
                  </p>
                </div>
              </div>

              {/* Over Budget Uyarısı */}
              {isOver && (
                <span className="bg-red-500 text-white font-semibold text-[11px] px-2.5 py-1 rounded-md flex items-center gap-1 shadow-sm select-none leading-none">
                  <ShieldAlert size={14} /> Limit Aşımı
                </span>
              )}
            </div>

            {/* Progress Area */}
            <div className="mb-4">
              <div className="flex justify-between text-sm font-semibold mb-2">
                <span className={isOver ? "text-red-500" : "text-slate-800 dark:text-slate-200"}>
                  {formatCurrency(spent, "USD", "en-US")}{" "}
                  <span className="text-slate-400 dark:text-slate-500 font-normal">harcanan</span>
                </span>
                <span className="text-slate-455">
                  Limit: {formatCurrency(limit, "USD", "en-US")}
                </span>
              </div>

              {/* Bütçe aşımında kırmızı doluluk */}
              <div className="w-full">
                <ProgressBar
                  value={spent}
                  max={limit}
                  variant={
                    isOver ? "danger" : isSavings ? "success" : ratio >= 0.9 ? "warning" : "brand"
                  }
                />
              </div>
            </div>

            {/* Footer */}
            <div className="flex justify-between items-center text-xs font-semibold">
              <span className={isOver ? "text-red-500" : "text-slate-500"}>
                {isOver
                  ? `-${formatCurrency(overAmount, "USD", "en-US")} limit aşımı`
                  : `${formatCurrency(remaining, "USD", "en-US")} kaldı`}
              </span>
              <span
                className={`px-2 py-1 rounded text-[11px] font-bold ${
                  isOver
                    ? "bg-red-50 dark:bg-red-950/20 text-red-650"
                    : ratio >= 0.9
                      ? "bg-amber-50 dark:bg-amber-950/20 text-amber-600"
                      : "bg-slate-50 dark:bg-slate-800 text-slate-500 dark:text-slate-400"
                }`}
              >
                %{percentage} Kullanıldı
              </span>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default CategoryBudgets;
