import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useAppDispatch, useAppSelector } from "@/store";
import { fetchGoals, addGoal } from "@/features/goals/goalsSlice";
import { goalFormSchema } from "@/features/goals/goals.types";
import type { GoalFormData } from "@/features/goals/goals.types";
import ProgressBar from "@/components/display/ProgressBar";
import Modal from "@/components/overlay/Modal";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import { Plus, ArrowRight, Plane, Home, Shield, Sparkles } from "lucide-react";
import toast from "react-hot-toast";
import type { FinancialGoal } from "@/features/goals/goalsSlice";

const Goals: React.FC = () => {
  const dispatch = useAppDispatch();
  const { items: goals, loading } = useAppSelector((state) => state.goals);

  // States
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Form
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<GoalFormData>({
    resolver: zodResolver(goalFormSchema),
    defaultValues: {
      name: "",
      targetAmount: undefined,
      currentAmount: undefined,
      deadline: "",
      monthlyContribution: undefined,
    },
  });

  useEffect(() => {
    dispatch(fetchGoals());
  }, [dispatch]);

  const handleFormSubmit = async (data: GoalFormData) => {
    try {
      const resultAction = await dispatch(addGoal(data));
      if (addGoal.fulfilled.match(resultAction)) {
        toast.success("Yeni hedef başarıyla oluşturuldu!");
        reset();
        setIsModalOpen(false);
      }
    } catch {
      toast.error("Hedef oluşturulurken hata oluşdu");
    }
  };

  // İkon atama helper'ı
  const getGoalIcon = (name: string) => {
    const lower = name.toLowerCase();
    if (lower.includes("vacation") || lower.includes("tatil") || lower.includes("seyahat")) {
      return <Plane size={20} className="text-primary" />;
    }
    if (lower.includes("house") || lower.includes("ev") || lower.includes("konut")) {
      return <Home size={20} className="text-primary" />;
    }
    if (lower.includes("emergency") || lower.includes("acil") || lower.includes("fon")) {
      return <Shield size={20} className="text-primary" />;
    }
    return <Sparkles size={20} className="text-primary" />;
  };

  // Kart renk varyantı helper'ı
  const getGoalVariant = (current: number, target: number) => {
    const ratio = current / target;
    if (ratio >= 0.75) return "success";
    if (ratio >= 0.25) return "brand";
    return "warning";
  };

  return (
    <div className="w-full max-w-container-max mx-auto text-left">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <h2 className="font-headline-lg-mobile md:font-headline-lg text-headline-lg-mobile md:text-headline-lg text-on-surface">
            Financial Goals
          </h2>
          <p className="font-body-md text-body-md text-on-surface-variant mt-1">
            Track and manage your strategic financial targets.
          </p>
        </div>
        <Button variant="primary" icon={<Plus size={18} />} onClick={() => setIsModalOpen(true)}>
          Add Goal
        </Button>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          <div className="h-48 animate-pulse rounded-xl bg-slate-100 dark:bg-slate-800" />
          <div className="h-48 animate-pulse rounded-xl bg-slate-100 dark:bg-slate-800" />
          <div className="h-48 animate-pulse rounded-xl bg-slate-100 dark:bg-slate-800" />
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {goals.map((goal: FinancialGoal) => {
            const ratio = goal.currentAmount / goal.targetAmount;
            const percentage = Math.round(ratio * 100);
            const variant = getGoalVariant(goal.currentAmount, goal.targetAmount);

            // Bitiş tarihi formatı (örn. "2024-08" -> "Ağu 2024")
            const formatDeadline = (dateStr: string) => {
              try {
                const date = new Date(dateStr);
                return date.toLocaleDateString("tr-TR", { month: "short", year: "numeric" });
              } catch {
                return dateStr;
              }
            };

            // Her hedef için dinamik bir sparkline çizimi (statik SVG dalgaları)
            const getSparklinePath = (val: number) => {
              if (val >= 0.75) return "M2 18L15 15L25 10L40 8L55 4L62 2";
              if (val >= 0.2) return "M2 22L12 18L22 20L32 15L42 12L52 10L62 6";
              return "M2 20L15 12L25 15L40 5L55 12L62 4";
            };

            return (
              <div
                key={goal.id}
                className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200/80 dark:border-slate-800/80 p-6 flex flex-col relative overflow-hidden group hover:shadow-soft-md transition-shadow duration-300"
              >
                {/* Background decorative path */}
                <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-bl-full pointer-events-none" />

                {/* Card Title & Icon */}
                <div className="flex justify-between items-start mb-4 relative z-10">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-slate-50 dark:bg-slate-800 flex items-center justify-center border border-slate-200/50 dark:border-slate-800">
                      {getGoalIcon(goal.name)}
                    </div>
                    <h3 className="font-headline-sm text-headline-sm text-slate-800 dark:text-white font-bold leading-tight">
                      {goal.name}
                    </h3>
                  </div>
                  <span className="bg-slate-50 dark:bg-slate-800 text-slate-500 dark:text-slate-400 font-label-sm text-label-sm px-2.5 py-1 rounded-full border border-slate-200/50 dark:border-slate-850">
                    {formatDeadline(goal.deadline)}
                  </span>
                </div>

                {/* Progress Detail */}
                <div className="mt-2 mb-6 relative z-10">
                  <div className="flex items-end justify-between mb-1">
                    <span className="font-headline-md text-headline-md text-slate-800 dark:text-white font-bold">
                      ${goal.currentAmount.toLocaleString()}
                    </span>
                    <span className="font-body-sm text-body-sm text-slate-400 dark:text-slate-500 mb-1">
                      of ${goal.targetAmount.toLocaleString()}
                    </span>
                  </div>
                  {/* Progress Bar */}
                  <div className="mt-3">
                    <ProgressBar
                      value={goal.currentAmount}
                      max={goal.targetAmount}
                      variant={variant}
                    />
                  </div>
                  <div className="flex justify-between mt-2 font-medium">
                    <span
                      className={`font-label-sm text-label-sm ${
                        variant === "success"
                          ? "text-emerald-600"
                          : variant === "brand"
                            ? "text-primary dark:text-brand-400"
                            : "text-amber-500"
                      }`}
                    >
                      %{percentage} Tamamlandı
                    </span>
                    <span className="font-label-sm text-label-sm text-slate-400 dark:text-slate-500">
                      {percentage >= 90
                        ? "Neredeyse Bitti"
                        : percentage >= 50
                          ? "Hedefe Yakın"
                          : "Uzun Vadeli"}
                    </span>
                  </div>
                </div>

                {/* Card Footer Actions */}
                <div className="mt-auto pt-4 border-t border-slate-100 dark:border-slate-800/80 flex justify-between items-center relative z-10">
                  <a
                    className="font-label-md text-label-md text-primary dark:text-brand-400 hover:underline flex items-center gap-1 cursor-pointer"
                    href="#"
                  >
                    Details <ArrowRight size={14} />
                  </a>

                  {/* Sparkline Graph Chart placeholder */}
                  <svg
                    className={`w-16 h-6 opacity-60 ${
                      variant === "success"
                        ? "text-emerald-600"
                        : variant === "brand"
                          ? "text-primary dark:text-brand-400"
                          : "text-amber-500"
                    }`}
                    fill="none"
                    viewBox="0 0 64 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d={getSparklinePath(ratio)}
                      stroke="currentColor"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                    />
                  </svg>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Modal - Yeni Hedef Tanımlama */}
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Add Goal">
        <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4">
          <Input
            label="Hedef Adı"
            placeholder="Örn. Ev Peşinatı, Yaz Tatili"
            error={errors.name?.message}
            {...register("name")}
          />

          <Input
            label="Hedeflenen Tutar"
            type="number"
            placeholder="0.00"
            error={errors.targetAmount?.message}
            {...register("targetAmount", { valueAsNumber: true })}
          />

          <Input
            label="Mevcut Birikim"
            type="number"
            placeholder="0.00"
            error={errors.currentAmount?.message}
            {...register("currentAmount", { valueAsNumber: true })}
          />

          <Input
            label="Hedef Bitiş Tarihi"
            type="date"
            error={errors.deadline?.message}
            {...register("deadline")}
          />

          <Input
            label="Aylık Yatırılacak Katkı Payı"
            type="number"
            placeholder="0.00"
            error={errors.monthlyContribution?.message}
            {...register("monthlyContribution", { valueAsNumber: true })}
          />

          <div className="flex justify-end gap-3 pt-4 border-t border-slate-100 dark:border-slate-800">
            <Button variant="outline" type="button" onClick={() => setIsModalOpen(false)}>
              İptal
            </Button>
            <Button variant="primary" type="submit" loading={isSubmitting}>
              Kaydet
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default Goals;
