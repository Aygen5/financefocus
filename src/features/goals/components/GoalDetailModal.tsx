import React, { useMemo } from "react";
import Modal from "@/components/ui/Modal";
import Progress from "@/components/ui/Progress";
import Badge from "@/components/ui/Badge";
import {
  formatCurrency,
  calculateGoalProgress,
  calculateGoalRemainingAmount,
  calculateGoalRemainingMonths,
  calculateGoalRequiredMonthlySaving,
} from "@/utils/financial";
import { format, parseISO } from "date-fns";
import { tr } from "date-fns/locale";
import { Calendar, Target, PiggyBank, DollarSign, Clock, AlertCircle } from "lucide-react";
import type { FinancialGoal } from "../goalsSlice";

interface GoalDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  goal: FinancialGoal | null;
}

export const GoalDetailModal: React.FC<GoalDetailModalProps> = ({ isOpen, onClose, goal }) => {
  const calculations = useMemo(() => {
    if (!goal) return null;
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

  if (!goal || !calculations) return null;

  const getPriorityBadge = (p?: "low" | "medium" | "high") => {
    switch (p) {
      case "low":
        return <Badge variant="neutral">Düşük Öncelik</Badge>;
      case "high":
        return <Badge variant="danger">Yüksek Öncelik</Badge>;
      default:
        return <Badge variant="warning">Orta Öncelik</Badge>;
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

  const formattedDeadline = (() => {
    try {
      return format(parseISO(goal.deadline), "dd MMMM yyyy", { locale: tr });
    } catch {
      return goal.deadline;
    }
  })();

  const formattedStartDate = (() => {
    if (!goal.startDate) return "-";
    try {
      return format(parseISO(goal.startDate), "dd MMMM yyyy", { locale: tr });
    } catch {
      return goal.startDate;
    }
  })();

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Hedef Detayı" size="md">
      <div className="space-y-6 text-left">
        {/* Header Title with color accent */}
        <div className="flex items-start justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1.5">
              <span
                className="w-3.5 h-3.5 rounded-full inline-block shrink-0"
                style={{ backgroundColor: goal.color || "#004ac6" }}
              />
              <span className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                {goal.category}
              </span>
            </div>
            <h3 className="text-lg font-extrabold text-slate-800 dark:text-slate-100 tracking-tight">
              {goal.name}
            </h3>
          </div>
          <div className="flex gap-2 shrink-0">
            {getPriorityBadge(goal.priority)}
            {getStatusBadge(goal.status)}
          </div>
        </div>

        {/* Progress Section */}
        <div className="bg-slate-50 dark:bg-slate-850 p-4 rounded-2xl border border-slate-100 dark:border-slate-800/80">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-slate-500 dark:text-slate-400">
              İlerleme Oranı
            </span>
            <span className="text-sm font-extrabold text-slate-800 dark:text-slate-200">
              %{calculations.progress}
            </span>
          </div>
          <Progress value={calculations.progress} variant="brand" size="md" className="mb-3" />
          <div className="flex justify-between text-[11px] font-bold text-slate-400 dark:text-slate-500">
            <span>{formatCurrency(goal.currentAmount, "TRY")} biriktirildi</span>
            <span>Hedef: {formatCurrency(goal.targetAmount, "TRY")}</span>
          </div>
        </div>

        {/* Breakdown details */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="flex items-center gap-3 p-3.5 border border-slate-200/85 dark:border-slate-800 rounded-xl bg-white dark:bg-slate-900">
            <div className="w-10 h-10 bg-blue-500/10 text-primary dark:text-brand-400 rounded-lg flex items-center justify-center shrink-0">
              <Target size={20} />
            </div>
            <div>
              <div className="text-[11px] font-bold text-slate-400 dark:text-slate-500">
                Hedeflenen Tutar
              </div>
              <div className="text-sm font-extrabold text-slate-800 dark:text-slate-200">
                {formatCurrency(goal.targetAmount, "TRY")}
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3 p-3.5 border border-slate-200/85 dark:border-slate-800 rounded-xl bg-white dark:bg-slate-900">
            <div className="w-10 h-10 bg-emerald-500/10 text-emerald-600 dark:text-emerald-450 rounded-lg flex items-center justify-center shrink-0">
              <PiggyBank size={20} />
            </div>
            <div>
              <div className="text-[11px] font-bold text-slate-400 dark:text-slate-500">
                Mevcut Birikim
              </div>
              <div className="text-sm font-extrabold text-slate-800 dark:text-slate-200">
                {formatCurrency(goal.currentAmount, "TRY")}
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3 p-3.5 border border-slate-200/85 dark:border-slate-800 rounded-xl bg-white dark:bg-slate-900">
            <div className="w-10 h-10 bg-red-500/10 text-red-650 dark:text-red-400 rounded-lg flex items-center justify-center shrink-0">
              <DollarSign size={20} />
            </div>
            <div>
              <div className="text-[11px] font-bold text-slate-400 dark:text-slate-500">
                Kalan Tutar
              </div>
              <div className="text-sm font-extrabold text-slate-800 dark:text-slate-200">
                {formatCurrency(calculations.remainingAmount, "TRY")}
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3 p-3.5 border border-slate-200/85 dark:border-slate-800 rounded-xl bg-white dark:bg-slate-900">
            <div className="w-10 h-10 bg-purple-500/10 text-purple-650 dark:text-purple-400 rounded-lg flex items-center justify-center shrink-0">
              <Clock size={20} />
            </div>
            <div>
              <div className="text-[11px] font-bold text-slate-400 dark:text-slate-500">
                Kalan Süre
              </div>
              <div className="text-sm font-extrabold text-slate-800 dark:text-slate-200">
                {calculations.remainingMonths} Ay
              </div>
            </div>
          </div>
        </div>

        {/* Required savings suggestion */}
        {calculations.remainingAmount > 0 && (
          <div className="bg-amber-500/10 border border-amber-500/20 text-amber-800 dark:text-amber-400 p-4 rounded-xl flex items-start gap-3">
            <AlertCircle size={18} className="shrink-0 mt-0.5" />
            <div>
              <div className="text-xs font-extrabold">Aylık Biriktirilmesi Gereken Tutar</div>
              <div className="text-base font-black mt-1">
                {formatCurrency(calculations.requiredMonthly, "TRY")} / Ay
              </div>
              <p className="text-[10px] font-bold mt-1 text-amber-700/80 dark:text-amber-400/80">
                Hedefinize zamanında ({formattedDeadline}) ulaşmak için her ay bu tutarı
                biriktirmeniz önerilir.
              </p>
            </div>
          </div>
        )}

        {/* Dates & Notes Section */}
        <div className="border-t border-slate-100 dark:border-slate-800/80 pt-4 space-y-3">
          <div className="flex justify-between text-xs font-bold">
            <span className="text-slate-400 dark:text-slate-500">Başlangıç Tarihi</span>
            <span className="text-slate-700 dark:text-slate-300 flex items-center gap-1">
              <Calendar size={12} /> {formattedStartDate}
            </span>
          </div>
          <div className="flex justify-between text-xs font-bold">
            <span className="text-slate-400 dark:text-slate-500">Hedeflenen Tarih</span>
            <span className="text-slate-700 dark:text-slate-300 flex items-center gap-1">
              <Calendar size={12} /> {formattedDeadline}
            </span>
          </div>

          {goal.notes && (
            <div className="pt-2">
              <div className="text-[11px] font-bold text-slate-400 dark:text-slate-500 mb-1">
                Açıklama & Notlar
              </div>
              <p className="text-xs font-bold text-slate-600 dark:text-slate-400 leading-relaxed bg-slate-50 dark:bg-slate-850 p-3 rounded-lg border border-slate-100 dark:border-slate-800/80">
                {goal.notes}
              </p>
            </div>
          )}
        </div>
      </div>
    </Modal>
  );
};

export default GoalDetailModal;
