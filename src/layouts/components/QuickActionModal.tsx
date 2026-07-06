import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import Modal from "@/components/ui/Modal";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import Select from "@/components/ui/Select";
import { useAppDispatch } from "@/store";
import { addTransaction } from "@/features/transactions/transactionsSlice";
import { addBudget } from "@/features/budget/budgetSlice";
import { addGoal } from "@/features/goals/goalsSlice";
import { addSubscription } from "@/features/subscriptions/subscriptionsSlice";
import { addActivityLog } from "@/features/activity/activitySlice";
import { addNotification } from "@/features/notifications/notificationsSlice";
import toast from "react-hot-toast";

export interface QuickActionModalProps {
  isOpen: boolean;
  onClose: () => void;
}

type TabType = "transaction" | "budget" | "goal" | "subscription";

// Form Validation Schemas
const transactionSchema = z.object({
  title: z.string().min(2, "Açıklama en az 2 karakter olmalıdır"),
  amount: z.coerce.number().positive("Tutar sıfırdan büyük olmalıdır"),
  transactionType: z.enum(["income", "expense"]),
  category: z.string().min(1, "Kategori seçiniz"),
  date: z.string().min(1, "Tarih seçiniz"),
  account: z.string().default("Banka Hesabı"),
});

const budgetSchema = z.object({
  category: z.string().min(1, "Kategori seçiniz"),
  limitAmount: z.coerce.number().positive("Limit sıfırdan büyük olmalıdır"),
});

const goalSchema = z.object({
  title: z.string().min(2, "Hedef adı en az 2 karakter olmalıdır"),
  targetAmount: z.coerce.number().positive("Hedef tutar sıfırdan büyük olmalıdır"),
  targetDate: z.string().min(1, "Hedef tarihi seçiniz"),
  notes: z.string().optional(),
});

const subscriptionSchema = z.object({
  name: z.string().min(2, "Abonelik adı en az 2 karakter olmalıdır"),
  cost: z.coerce.number().positive("Ücret sıfırdan büyük olmalıdır"),
  billingCycle: z.enum(["monthly", "yearly"]),
  nextBillingDate: z.string().min(1, "Fatura tarihi seçiniz"),
  category: z.string().min(1, "Kategori seçiniz"),
});

export const QuickActionModal: React.FC<QuickActionModalProps> = ({ isOpen, onClose }) => {
  const dispatch = useAppDispatch();
  const [activeTab, setActiveTab] = useState<TabType>("transaction");

  // Forms initialization
  const txForm = useForm({
    resolver: zodResolver(transactionSchema),
    defaultValues: {
      title: "",
      amount: 0,
      transactionType: "expense" as const,
      category: "Food",
      date: new Date().toISOString().split("T")[0],
      account: "Nakit",
    },
  });

  const budgetForm = useForm({
    resolver: zodResolver(budgetSchema),
    defaultValues: { category: "Food", limitAmount: 0 },
  });

  const goalForm = useForm({
    resolver: zodResolver(goalSchema),
    defaultValues: { title: "", targetAmount: 0, targetDate: "", notes: "" },
  });

  const subForm = useForm({
    resolver: zodResolver(subscriptionSchema),
    defaultValues: {
      name: "",
      cost: 0,
      billingCycle: "monthly" as const,
      nextBillingDate: "",
      category: "Video",
    },
  });

  const handleTxSubmit = async (data: z.infer<typeof transactionSchema>) => {
    try {
      const resultAction = await dispatch(
        addTransaction({
          ...data,
          userId: "1",
          status: "completed",
          paymentMethod: "Kredi Kartı",
          currency: "TRY",
        }),
      );
      if (addTransaction.fulfilled.match(resultAction)) {
        dispatch(
          addActivityLog({
            action: "Transaction Added",
            category: "Transactions",
            description: `"${data.title}" işlemi başarıyla eklendi.`,
            user: "Aygen",
            icon: "PlusCircle",
            status: "success",
          }),
        );
        dispatch(
          addNotification({
            title: "Transaction Added",
            message: `"${data.title}" işlemi başarıyla hesabınıza eklendi.`,
            type: "success",
            icon: "PlusCircle",
          }),
        );
        toast.success("İşlem başarıyla eklendi!");
        txForm.reset();
        onClose();
      }
    } catch {
      toast.error("İşlem eklenirken hata oluştu.");
    }
  };

  const handleBudgetSubmit = async (data: z.infer<typeof budgetSchema>) => {
    try {
      const resultAction = await dispatch(addBudget({ ...data, period: "monthly" }));
      if (addBudget.fulfilled.match(resultAction)) {
        dispatch(
          addActivityLog({
            action: "Budget Updated",
            category: "Budget",
            description: `"${data.category}" için bütçe limiti tanımlandı.`,
            user: "Aygen",
            icon: "Sliders",
            status: "success",
          }),
        );
        dispatch(
          addNotification({
            title: "Budget Updated",
            message: `"${data.category}" bütçe limiti başarıyla tanımlandı.`,
            type: "success",
            icon: "Sliders",
          }),
        );
        toast.success("Bütçe limiti tanımlandı!");
        budgetForm.reset();
        onClose();
      }
    } catch {
      toast.error("Bütçe eklenirken hata oluştu.");
    }
  };

  const handleGoalSubmit = async (data: z.infer<typeof goalSchema>) => {
    try {
      const resultAction = await dispatch(
        addGoal({ ...data, currentAmount: 0, status: "in_progress" }),
      );
      if (addGoal.fulfilled.match(resultAction)) {
        dispatch(
          addActivityLog({
            action: "Goal Created",
            category: "Goals",
            description: `"${data.title}" isimli yeni hedef oluşturuldu.`,
            user: "Aygen",
            icon: "Award",
            status: "success",
          }),
        );
        dispatch(
          addNotification({
            title: "Goal Created",
            message: `"${data.title}" hedefi başarıyla oluşturuldu.`,
            type: "success",
            icon: "Award",
          }),
        );
        toast.success("Finansal hedef oluşturuldu!");
        goalForm.reset();
        onClose();
      }
    } catch {
      toast.error("Hedef oluşturulurken hata oluştu.");
    }
  };

  const handleSubSubmit = async (data: z.infer<typeof subscriptionSchema>) => {
    try {
      const resultAction = await dispatch(
        addSubscription({
          ...data,
          status: "active",
          autoRenew: true,
          startDate: new Date().toISOString().split("T")[0],
        }),
      );
      if (addSubscription.fulfilled.match(resultAction)) {
        dispatch(
          addActivityLog({
            action: "Subscription Added",
            category: "Subscriptions",
            description: `"${data.name}" abonelik takibi eklendi.`,
            user: "Aygen",
            icon: "CreditCard",
            status: "success",
          }),
        );
        dispatch(
          addNotification({
            title: "Subscription Added",
            message: `"${data.name}" aboneliği takibe alındı.`,
            type: "success",
            icon: "CreditCard",
          }),
        );
        toast.success("Abonelik takibi başlatıldı!");
        subForm.reset();
        onClose();
      }
    } catch {
      toast.error("Abonelik eklenirken hata oluştu.");
    }
  };

  const tabs = [
    { id: "transaction" as TabType, label: "Gelir / Gider" },
    { id: "budget" as TabType, label: "Bütçe" },
    { id: "goal" as TabType, label: "Hedef" },
    { id: "subscription" as TabType, label: "Abonelik" },
  ];

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Hızlı İşlem Ekle" size="md">
      {/* Modal Tab header */}
      <div className="flex border-b border-slate-100 dark:border-slate-800 mb-6 select-none">
        {tabs.map((tab) => {
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex-1 py-3 text-xs font-bold transition-all border-b-2 cursor-pointer ${
                isActive
                  ? "border-primary dark:border-brand-500 text-primary dark:text-brand-400 font-extrabold"
                  : "border-transparent text-slate-400 hover:text-slate-600 dark:hover:text-slate-350"
              }`}
            >
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* Tab Contents */}
      <div className="text-left">
        {activeTab === "transaction" && (
          <form onSubmit={txForm.handleSubmit(handleTxSubmit)} className="space-y-4">
            <Input
              label="Açıklama / Başlık"
              {...txForm.register("title")}
              error={txForm.formState.errors.title?.message}
            />
            <div className="grid grid-cols-2 gap-4">
              <Input
                label="Tutar (₺)"
                type="number"
                step="0.01"
                {...txForm.register("amount")}
                error={txForm.formState.errors.amount?.message}
              />
              <Select
                label="İşlem Tipi"
                {...txForm.register("transactionType")}
                options={[
                  { value: "expense", label: "Gider" },
                  { value: "income", label: "Gelir" },
                ]}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <Select
                label="Kategori"
                {...txForm.register("category")}
                options={[
                  { value: "Salary", label: "Maaş" },
                  { value: "Food", label: "Mutfak / Yemek" },
                  { value: "Bills", label: "Faturalar" },
                  { value: "Entertainment", label: "Eğlence" },
                  { value: "Freelance", label: "Serbest Çalışma" },
                ]}
              />
              <Input
                label="Tarih"
                type="date"
                {...txForm.register("date")}
                error={txForm.formState.errors.date?.message}
              />
            </div>
            <div className="pt-4 flex gap-3">
              <Button type="button" variant="outline" className="flex-1" onClick={onClose}>
                İptal
              </Button>
              <Button
                type="submit"
                variant="brand"
                className="flex-1"
                loading={txForm.formState.isSubmitting}
              >
                İşlemi Kaydet
              </Button>
            </div>
          </form>
        )}

        {activeTab === "budget" && (
          <form onSubmit={budgetForm.handleSubmit(handleBudgetSubmit)} className="space-y-4">
            <Select
              label="Bütçe Kategorisi"
              {...budgetForm.register("category")}
              options={[
                { value: "Food", label: "Mutfak / Yemek" },
                { value: "Bills", label: "Faturalar" },
                { value: "Entertainment", label: "Eğlence / Sosyal" },
              ]}
            />
            <Input
              label="Bütçe Limiti (₺)"
              type="number"
              {...budgetForm.register("limitAmount")}
              error={budgetForm.formState.errors.limitAmount?.message}
            />
            <div className="pt-4 flex gap-3">
              <Button type="button" variant="outline" className="flex-1" onClick={onClose}>
                İptal
              </Button>
              <Button
                type="submit"
                variant="brand"
                className="flex-1"
                loading={budgetForm.formState.isSubmitting}
              >
                Limiti Tanımla
              </Button>
            </div>
          </form>
        )}

        {activeTab === "goal" && (
          <form onSubmit={goalForm.handleSubmit(handleGoalSubmit)} className="space-y-4">
            <Input
              label="Hedef İsmi"
              {...goalForm.register("title")}
              error={goalForm.formState.errors.title?.message}
            />
            <div className="grid grid-cols-2 gap-4">
              <Input
                label="Hedeflenen Tutar (₺)"
                type="number"
                {...goalForm.register("targetAmount")}
                error={goalForm.formState.errors.targetAmount?.message}
              />
              <Input
                label="Hedef Tarihi"
                type="date"
                {...goalForm.register("targetDate")}
                error={goalForm.formState.errors.targetDate?.message}
              />
            </div>
            <Input label="Notlar (Opsiyonel)" {...goalForm.register("notes")} />
            <div className="pt-4 flex gap-3">
              <Button type="button" variant="outline" className="flex-1" onClick={onClose}>
                İptal
              </Button>
              <Button
                type="submit"
                variant="brand"
                className="flex-1"
                loading={goalForm.formState.isSubmitting}
              >
                Hedef Tanımla
              </Button>
            </div>
          </form>
        )}

        {activeTab === "subscription" && (
          <form onSubmit={subForm.handleSubmit(handleSubSubmit)} className="space-y-4">
            <Input
              label="Abonelik Adı"
              {...subForm.register("name")}
              error={subForm.formState.errors.name?.message}
            />
            <div className="grid grid-cols-2 gap-4">
              <Input
                label="Aylık/Yıllık Ücret (₺)"
                type="number"
                {...subForm.register("cost")}
                error={subForm.formState.errors.cost?.message}
              />
              <Select
                label="Fatura Tipi"
                {...subForm.register("billingCycle")}
                options={[
                  { value: "monthly", label: "Aylık" },
                  { value: "yearly", label: "Yıllık" },
                ]}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <Select
                label="Kategori"
                {...subForm.register("category")}
                options={[
                  { value: "Video", label: "Video Yayın (Netflix vb.)" },
                  { value: "Music", label: "Müzik Yayın (Spotify vb.)" },
                  { value: "SaaS", label: "Bulut Servisleri (AWS, iCloud)" },
                ]}
              />
              <Input
                label="Fatura Kesim Tarihi"
                type="date"
                {...subForm.register("nextBillingDate")}
                error={subForm.formState.errors.nextBillingDate?.message}
              />
            </div>
            <div className="pt-4 flex gap-3">
              <Button type="button" variant="outline" className="flex-1" onClick={onClose}>
                İptal
              </Button>
              <Button
                type="submit"
                variant="brand"
                className="flex-1"
                loading={subForm.formState.isSubmitting}
              >
                Abonelik Ekle
              </Button>
            </div>
          </form>
        )}
      </div>
    </Modal>
  );
};
