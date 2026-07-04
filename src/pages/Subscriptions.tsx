import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useAppDispatch, useAppSelector } from "@/store";
import { fetchSubscriptions, addSubscription } from "@/features/subscriptions/subscriptionsSlice";
import { subscriptionFormSchema } from "@/features/subscriptions/subscriptions.types";
import type { SubscriptionFormData } from "@/features/subscriptions/subscriptions.types";
import SubscriptionSummary from "@/features/subscriptions/components/SubscriptionSummary";
import SubscriptionList from "@/features/subscriptions/components/SubscriptionList";
import Modal from "@/components/overlay/Modal";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import Select from "@/components/ui/Select";
import { Plus, ListFilter } from "lucide-react";
import toast from "react-hot-toast";

const Subscriptions: React.FC = () => {
  const dispatch = useAppDispatch();
  const { items: subscriptions, loading } = useAppSelector((state) => state.subscriptions);

  // States
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [categoryFilter, setCategoryFilter] = useState("All");
  const [statusFilter, setStatusFilter] = useState("All");

  // Form
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<SubscriptionFormData>({
    resolver: zodResolver(subscriptionFormSchema),
    defaultValues: {
      name: "",
      price: undefined,
      cycle: "monthly",
      category: "Software",
      nextPayment: "",
      billingType: "auto-renew",
    },
  });

  useEffect(() => {
    dispatch(fetchSubscriptions());
  }, [dispatch]);

  const handleFormSubmit = async (data: SubscriptionFormData) => {
    try {
      const resultAction = await dispatch(
        addSubscription({
          name: data.name,
          cost: data.price,
          billingCycle: data.cycle,
          category: data.category,
          nextBillingDate: data.nextPayment,
          billingType: data.billingType,
        }),
      );

      if (addSubscription.fulfilled.match(resultAction)) {
        toast.success("Abonelik başarıyla eklendi!");
        reset();
        setIsModalOpen(false);
      }
    } catch {
      toast.error("Abonelik eklenirken hata oluştu");
    }
  };

  const handleManage = (id: string) => {
    toast.success(`Abonelik yönetiliyor: ${id}`);
  };

  const handleLinkAccount = () => {
    toast.success("Banka/Hesap bağlama akışı başlatıldı.");
  };

  // Filtreleme Mantığı
  const filteredSubscriptions = subscriptions.filter((sub) => {
    const matchesCategory =
      categoryFilter === "All" || sub.category.toLowerCase().includes(categoryFilter.toLowerCase());
    const matchesStatus =
      statusFilter === "All" ||
      (statusFilter === "Active" &&
        (sub.billingType === "auto-renew" || sub.billingType === "scheduled")) ||
      (statusFilter === "Paused" && sub.billingType === "manual");
    return matchesCategory && matchesStatus;
  });

  // Metrik Hesaplamaları
  const totalCost = filteredSubscriptions.reduce((sum, sub) => sum + sub.cost, 0);
  const activeCount = filteredSubscriptions.filter(
    (sub) => sub.billingType === "auto-renew" || sub.billingType === "scheduled",
  ).length;
  const dueSoonCount =
    filteredSubscriptions.length > 0 ? Math.min(filteredSubscriptions.length, 4) : 0;
  const autoRenewCount = filteredSubscriptions.filter(
    (sub) => sub.billingType === "auto-renew",
  ).length;

  return (
    <div className="w-full max-w-container-max mx-auto text-left">
      {/* Page Header */}
      <div className="mb-stack-lg flex justify-between items-end">
        <div>
          <h2 className="font-headline-lg text-headline-lg text-on-surface">
            Subscription Tracker
          </h2>
          <p className="font-body-md text-on-surface-variant mt-1">
            Monitor your recurring expenses and optimize your financial commitments.
          </p>
        </div>
        <Button variant="primary" icon={<Plus size={18} />} onClick={() => setIsModalOpen(true)}>
          Add Subscription
        </Button>
      </div>

      {/* Summary Bento boxes */}
      <SubscriptionSummary
        totalCost={totalCost || 482.5}
        activeCount={activeCount || 18}
        dueSoonCount={dueSoonCount || 4}
        autoRenewCount={autoRenewCount || 12}
        loading={loading}
      />

      {/* Filters bar breakdown */}
      <div className="bg-white dark:bg-slate-900 p-6 rounded-xl border border-slate-200/80 dark:border-slate-800/80 mb-stack-md flex flex-wrap items-center justify-between gap-4 shadow-soft-sm">
        <div className="flex gap-stack-md">
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="appearance-none bg-slate-50 dark:bg-slate-850 border border-slate-200 dark:border-slate-800 rounded-lg px-4 py-2 text-label-md text-slate-500 focus:ring-2 focus:ring-primary focus:border-transparent outline-none cursor-pointer"
          >
            <option value="All">Tüm Kategoriler</option>
            <option value="Entertainment">Entertainment</option>
            <option value="Software">Software</option>
            <option value="Utilities">Utilities</option>
            <option value="Lifestyle">Lifestyle</option>
          </select>

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="appearance-none bg-slate-50 dark:bg-slate-850 border border-slate-200 dark:border-slate-800 rounded-lg px-4 py-2 text-label-md text-slate-500 focus:ring-2 focus:ring-primary focus:border-transparent outline-none cursor-pointer"
          >
            <option value="All">Tüm Durumlar</option>
            <option value="Active">Active (Auto / Scheduled)</option>
            <option value="Paused">Paused (Manual)</option>
          </select>
        </div>
        <div className="flex items-center gap-1 font-bold text-xs text-slate-400">
          <ListFilter size={16} /> Sırala: Yaklaşan Ödeme
        </div>
      </div>

      {/* Subscription List table */}
      <SubscriptionList
        subscriptions={filteredSubscriptions}
        loading={loading}
        onManage={handleManage}
      />

      {/* Empty State / Bank Connection promotion card */}
      <div className="mt-stack-lg flex flex-col items-center justify-center py-12 bg-slate-50 dark:bg-slate-900 rounded-2xl border-2 border-dashed border-slate-200/80 dark:border-slate-800">
        <div className="w-16 h-16 rounded-full bg-slate-100 dark:bg-slate-850 flex items-center justify-center mb-4 text-slate-400">
          <Plus size={32} />
        </div>
        <h5 className="font-headline-sm text-slate-850 dark:text-white font-bold">
          Daha fazla servis mi takip ediyorsunuz?
        </h5>
        <p className="font-body-md text-slate-500 mt-1 mb-6 font-medium">
          Mükerrer ve gereksiz harcamaları yakalamak için tüm hesaplarınızı tek bir yere bağlayın.
        </p>
        <Button variant="primary" onClick={handleLinkAccount}>
          Yeni Hesap Bağla (Link New Account)
        </Button>
      </div>

      {/* Modal - Yeni Abonelik Ekleme */}
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Add Subscription">
        <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4">
          <Input
            label="Hizmet Adı"
            placeholder="Örn. Netflix, Spotify, Figma"
            error={errors.name?.message}
            {...register("name")}
          />

          <Input
            label="Fiyat (USD)"
            type="number"
            placeholder="0.00"
            error={errors.price?.message}
            {...register("price", { valueAsNumber: true })}
          />

          <Select
            label="Ödeme Döngüsü"
            options={[
              { value: "monthly", label: "Monthly (Aylık)" },
              { value: "yearly", label: "Yearly (Yıllık)" },
            ]}
            error={errors.cycle?.message}
            {...register("cycle")}
          />

          <Select
            label="Kategori"
            options={[
              { value: "Software", label: "Software & SaaS" },
              { value: "Entertainment", label: "Entertainment & Media" },
              { value: "Utilities", label: "Utilities & Bills" },
              { value: "Lifestyle", label: "Lifestyle & Health" },
            ]}
            error={errors.category?.message}
            {...register("category")}
          />

          <Input
            label="Sonraki Ödeme Tarihi"
            type="date"
            error={errors.nextPayment?.message}
            {...register("nextPayment")}
          />

          <Select
            label="Fatura Ödeme Türü"
            options={[
              { value: "auto-renew", label: "Auto-renew (Otomatik)" },
              { value: "manual", label: "Manual Pay (Manuel)" },
              { value: "scheduled", label: "Scheduled (Planlı)" },
            ]}
            error={errors.billingType?.message}
            {...register("billingType")}
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

export default Subscriptions;
