import React from "react";
import { PlusCircle } from "lucide-react";
import ProgressBar from "@/components/display/ProgressBar";
import type { FinancialGoal } from "@/features/goals/goalsSlice";

export interface ActiveGoalsProps {
  goals: FinancialGoal[];
  loading?: boolean;
}

const ActiveGoals: React.FC<ActiveGoalsProps> = ({ goals, loading = false }) => {
  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800/80 rounded-xl p-6 shadow-soft-sm text-left">
      <div className="flex justify-between items-center mb-5">
        <h3 className="text-base font-bold text-slate-800 dark:text-white tracking-tight">
          Aktif Hedefler
        </h3>
        <button className="text-slate-400 hover:text-primary transition-colors cursor-pointer">
          <PlusCircle size={20} />
        </button>
      </div>

      {loading ? (
        <div className="space-y-4">
          <div className="h-10 w-full animate-pulse rounded bg-slate-100 dark:bg-slate-800" />
          <div className="h-10 w-full animate-pulse rounded bg-slate-100 dark:bg-slate-800" />
        </div>
      ) : (
        <div className="flex flex-col gap-5">
          {goals.map((goal) => {
            const getProgressVariant = (current: number, target: number) => {
              const ratio = current / target;
              if (ratio >= 0.75) return "success";
              if (ratio >= 0.25) return "brand";
              return "warning";
            };

            return (
              <div key={goal.id} className="space-y-2">
                <div className="flex justify-between text-sm font-semibold mb-1">
                  <span className="text-slate-800 dark:text-slate-200">{goal.name}</span>
                  <span className="text-slate-500 dark:text-slate-450">
                    %{Math.round((goal.currentAmount / goal.targetAmount) * 100)}
                  </span>
                </div>
                <ProgressBar
                  value={goal.currentAmount}
                  max={goal.targetAmount}
                  variant={getProgressVariant(goal.currentAmount, goal.targetAmount)}
                />
                <p className="text-[11px] text-slate-400 dark:text-slate-500 text-right font-medium">
                  ${goal.currentAmount.toLocaleString()} / ${goal.targetAmount.toLocaleString()}
                </p>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default ActiveGoals;
