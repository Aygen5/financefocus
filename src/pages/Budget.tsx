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
import { addActivityLog } from "@/features/activity/activitySlice";
import { addNotification } from "@/features/notifications/notificationsSlice";
import { Plus } from "lucide-react";
import toast from "react-hot-toast";

const Budget: React.FC = () => {
  const dispatch = useAppDispatch();
  const { items: budgets, loading } = useAppSelector((state) => state.budget);

  const [isModalOpen, setIsModalOpen] = useState(false);

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
        dispatch(
          addActivityLog({
            action: "Budget Updated",
            category: "Budget",
            description: `"${data.category}" kategorisi için ${data.limit} TRY bütçe limiti tanımlandı.`,
            user: "Aygen",
            icon: "Sliders",
            status: "success",
          }),
        );
        dispatch(
          addNotification({
            title: "Budget Updated",
            message: `"${data.category}" kategorisi için ${data.limit} TRY bütçe limiti başarıyla tanımlandı.`,
            type: "success",
            icon: "Sliders",
          }),
        );
        toast.success("Bütçe limiti başarıyla tanımlandı!");
        reset();
        setIsModalOpen(false);
      }
    } catch {
      toast.error("Bütçe eklenirken hata oluştu");
    }
  };

  const totalBudget = budgets.reduce((sum, b) => sum + b.limitAmount, 0);
  const spent = budgets.reduce((sum, b) => sum + b.spentAmount, 0);
  const remaining = Math.max(totalBudget - spent, 0);

  return (
    <div className="w-full max-w-container-max mx-auto text-left">
      <div className="flex justify-between items-end mb-stack-lg">
        <div>
          <h2 className="font-headline-lg text-headline-lg text-on-surface">Bütçe Planlayıcı</h2>
          <p className="font-body-md text-body-md text-on-surface-variant mt-1">
            Aylık harcama limitlerinizi tanımlayın ve takip edin.
          </p>
        </div>
        <Button variant="primary" icon={<Plus size={18} />} onClick={() => setIsModalOpen(true)}>
          Yeni Limit Tanımla
        </Button>
      </div>

      <BudgetSummaryCards
        totalBudget={totalBudget || 5000}
        spent={spent || 3200}
        remaining={remaining || 1800}
        loading={loading}
      />

      <div className="mb-stack-md flex justify-between items-center">
        <h3 className="font-headline-md text-headline-md text-on-surface font-bold tracking-tight">
          Kategori Dağılımı
        </h3>
        <div className="font-label-md text-label-md text-slate-500 font-semibold select-none">
          Mevcut Ay Gösteriliyor
        </div>
      </div>

      <CategoryBudgets budgets={budgets} loading={loading} />

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Yeni Limit Belirle">
        <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4">
          <Select
            label="Kategori"
            error={errors.category?.message}
            options={[
              { value: "", label: "Seçiniz" },
              { value: "Housing", label: "Konut & Kira" },
              { value: "Food", label: "Gıda & Market" },
              { value: "Transport", label: "Ulaşım" },
              { value: "Entertainment", label: "Eğlence" },
              { value: "Savings", label: "Birikim & Yatırım" },
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
