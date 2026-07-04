import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useAppDispatch, useAppSelector } from "@/store";
import { fetchBudgets, addBudget } from "@/features/budget/budgetSlice";
import { budgetFormSchema } from "@/features/budget/budget.types";
import type { BudgetFormData } from "@/features/budget/budget.types";
import BudgetSummaryCards from "@/features/budget/components/BudgetSummaryCards";
import CategoryBudgets from "@/features/budget/components/CategoryBudgets";
import Modal from "@/components/overlay/Modal";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import Select from "@/components/ui/Select";
import { Plus } from "lucide-react";
import toast from "react-hot-toast";

const Budget: React.FC = () => {
  const dispatch = useAppDispatch();
  const { items: budgets, loading } = useAppSelector((state) => state.budget);

  // States
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Form
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<BudgetFormData>({
    resolver: zodResolver(budgetFormSchema),
    defaultValues: {
      category: "",
      limit: undefined,
      description: "",
    },
  });

  useEffect(() => {
    dispatch(fetchBudgets());
  }, [dispatch]);

  const handleFormSubmit = async (data: BudgetFormData) => {
    try {
      const resultAction = await dispatch(
        addBudget({
          category: data.category,
          limitAmount: data.limit,
          period: "monthly",
          description: data.description,
        }),
      );

      if (addBudget.fulfilled.match(resultAction)) {
        toast.success("Bütçe limiti başarıyla tanımlandı!");
        reset();
        setIsModalOpen(false);
      }
    } catch {
      toast.error("Bütçe eklenirken hata oluştu");
    }
  };

  // Dinamik Bütçe Hesaplamaları
  const totalBudget = budgets.reduce((sum, b) => sum + b.limitAmount, 0);
  const spent = budgets.reduce((sum, b) => sum + b.spentAmount, 0);
  const remaining = Math.max(totalBudget - spent, 0);

  return (
    <div className="w-full max-w-container-max mx-auto text-left">
      {/* Page Header */}
      <div className="flex justify-between items-end mb-stack-lg">
        <div>
          <h2 className="font-headline-lg text-headline-lg text-on-surface">Budget Planner</h2>
          <p className="font-body-md text-body-md text-on-surface-variant mt-1">
            Manage and track your monthly spending limits.
          </p>
        </div>
        <Button variant="primary" icon={<Plus size={18} />} onClick={() => setIsModalOpen(true)}>
          Set New Budget
        </Button>
      </div>

      {/* Bento Grid Top summaries */}
      <BudgetSummaryCards
        totalBudget={totalBudget || 5000}
        spent={spent || 3200}
        remaining={remaining || 1800}
        loading={loading}
      />

      {/* Category Breakdown list header */}
      <div className="mb-stack-md flex justify-between items-center">
        <h3 className="font-headline-md text-headline-md text-on-surface font-bold tracking-tight">
          Category Breakdown
        </h3>
        <div className="font-label-md text-label-md text-slate-500 font-semibold select-none">
          Mevcut Ay Gösteriliyor
        </div>
      </div>

      {/* Budgets Progress Grid list */}
      <CategoryBudgets budgets={budgets} loading={loading} />

      {/* Modal - Yeni Limit Belirleme */}
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Set New Budget">
        <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4">
          <Select
            label="Kategori"
            error={errors.category?.message}
            options={[
              { value: "", label: "Seçiniz" },
              { value: "Housing", label: "Konut & Kira (Housing)" },
              { value: "Food", label: "Gıda & Market (Food)" },
              { value: "Transport", label: "Ulaşım (Transport)" },
              { value: "Entertainment", label: "Eğlence (Entertainment)" },
              { value: "Savings", label: "Birikim & Yatırım (Savings)" },
            ]}
            {...register("category")}
          />

          <Input
            label="Bütçe Limiti (Aylık)"
            type="number"
            placeholder="0.00"
            error={errors.limit?.message}
            {...register("limit", { valueAsNumber: true })}
          />

          <Input
            label="Açıklama / Alt Başlık"
            placeholder="Örn. Kira, Faturalar veya Dışarıda Yemek"
            error={errors.description?.message}
            {...register("description")}
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

export default Budget;
