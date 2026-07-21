import React, { useMemo } from "react";
import Progress from "@/components/ui/Progress";
import Badge from "@/components/ui/Badge";
import {
  formatCurrency,
  calculateGoalProgress,
  calculateGoalRemainingAmount,
  calculateGoalRemainingMonths,
  calculateGoalRequiredMonthlySaving,
} from "@/utils/financial";
import { Edit2, Trash2, Eye, Calendar, TrendingUp } from "lucide-react";
import type { FinancialGoal } from "../goalsSlice";

interface GoalCardProps {
  goal: FinancialGoal;
  onEdit: (goal: FinancialGoal) => void;
  onDelete: (goal: FinancialGoal) => void;
  onView: (goal: FinancialGoal) => void;
}

export const GoalCard: React.FC<GoalCardProps> = ({ goal, onEdit, onDelete, onView }) => {
  const calculations = useMemo(() => {
    const progress = calculateGoalProgress(goal.currentAmount, goal.targetAmount);
    const remainingAmount = calculateGoalRemainingAmount(goal.currentAmount, goal.targetAmount);
    const remainingMonths = calculateGoalRemainingMonths(goal.deadline);
    const requiredMonthly = calculateGoalRequiredMonthlySaving(remainingAmount, remainingMonths);

    return {
      progress,
      remainingAmount,
      remainingMonths,
      requiredMonthly,
    };
  }, [goal]);

  const getPriorityBadge = (p?: "low" | "medium" | "high") => {
    switch (p) {
      case "low":
        return <Badge variant="neutral">Düşük</Badge>;
      case "high":
        return <Badge variant="danger">Yüksek</Badge>;
      default:
        return <Badge variant="warning">Orta</Badge>;
    }
  };

  const getStatusBadge = (s?: "active" | "completed" | "paused") => {
    switch (s) {
      case "completed":
        return <Badge variant="success">Tamamlandı</Badge>;
      case "paused":
        return <Badge variant="neutral">Duraklatıldı</Badge>;
      default:
        return <Badge variant="brand">Aktif</Badge>;
    }
  };

  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800/80 rounded-2xl p-6 shadow-soft-sm hover:shadow-soft-md transition-all flex flex-col justify-between h-full select-none text-left">
      <div>
        <div className="flex items-center justify-between gap-2 mb-3">
          <div className="flex items-center gap-1.5">
            <span
              className="w-3 h-3 rounded-full shrink-0"
              style={{ backgroundColor: goal.color || "#004ac6" }}
            />
            <span className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-wider">
              {goal.category}
            </span>
          </div>
          <div className="flex items-center gap-1.5 shrink-0">
            {getPriorityBadge(goal.priority)}
            {getStatusBadge(goal.status)}
          </div>
        </div>

        <h4 className="text-base font-extrabold text-slate-800 dark:text-slate-100 tracking-tight mb-4">
          {goal.name}
        </h4>

        <div className="space-y-2 mb-6 bg-slate-50 dark:bg-slate-850 p-3 rounded-xl border border-slate-100 dark:border-slate-800/80">
          <div className="flex items-center justify-between text-xs">
            <span className="font-bold text-slate-500 dark:text-slate-400">İlerleme</span>
            <span className="font-extrabold text-slate-800 dark:text-slate-200">
              %{calculations.progress}
            </span>
          </div>
          <Progress value={calculations.progress} variant="brand" size="sm" />
          <div className="flex justify-between text-[10px] font-bold text-slate-400 dark:text-slate-500">
            <span>{formatCurrency(goal.currentAmount, "TRY")}</span>
            <span>Hedef: {formatCurrency(goal.targetAmount, "TRY")}</span>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4 mb-6">
          <div>
            <div className="text-[10px] font-bold text-slate-400 dark:text-slate-500 mb-0.5">
              Kalan Tutar
            </div>
            <div className="text-xs font-extrabold text-slate-800 dark:text-slate-200">
              {formatCurrency(calculations.remainingAmount, "TRY")}
            </div>
          </div>
          <div>
            <div className="text-[10px] font-bold text-slate-400 dark:text-slate-500 mb-0.5">
              Kalan Süre
            </div>
            <div className="text-xs font-extrabold text-slate-800 dark:text-slate-200 flex items-center gap-1">
              <Calendar size={12} className="text-slate-400" />
              {calculations.remainingMonths} Ay
            </div>
          </div>
          {calculations.remainingAmount > 0 && (
            <div className="col-span-2 pt-2 border-t border-slate-100 dark:border-slate-800/80">
              <div className="text-[10px] font-bold text-slate-400 dark:text-slate-500 mb-0.5 flex items-center gap-1">
                <TrendingUp size={11} className="text-emerald-500" />
                Önerilen Aylık Birikim
              </div>
              <div className="text-xs font-black text-emerald-600 dark:text-emerald-450">
                {formatCurrency(calculations.requiredMonthly, "TRY")} / Ay
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="flex justify-between items-center pt-4 border-t border-slate-100 dark:border-slate-800/80">
        <button
          onClick={() => onView(goal)}
          className="text-xs font-extrabold text-primary hover:underline flex items-center gap-1 cursor-pointer"
        >
          <Eye size={14} /> Detayları Gör
        </button>

        <div className="flex items-center gap-2">
          <button
            onClick={() => onEdit(goal)}
            className="p-1.5 rounded border border-slate-200 dark:border-slate-800 text-slate-400 hover:text-primary hover:border-primary/30 dark:hover:text-brand-400 transition-colors cursor-pointer"
            title="Düzenle"
          >
            <Edit2 size={12} />
          </button>
          <button
            onClick={() => onDelete(goal)}
            className="p-1.5 rounded border border-slate-200 dark:border-slate-800 text-slate-400 hover:text-red-500 hover:border-red-500/30 transition-colors cursor-pointer"
            title="Sil"
          >
            <Trash2 size={12} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default GoalCard;
