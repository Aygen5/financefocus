import React, { useState, useMemo } from "react";
import useSubscriptions from "@/features/subscriptions/hooks/useSubscriptions";
import SubscriptionCard from "@/features/subscriptions/components/SubscriptionCard";
import SubscriptionForm from "@/features/subscriptions/components/SubscriptionForm";
import SubscriptionDetailModal from "@/features/subscriptions/components/SubscriptionDetailModal";
import SubscriptionSummary from "@/features/subscriptions/components/SubscriptionSummary";
import ConfirmDialog from "@/components/feedback/ConfirmDialog";
import Modal from "@/components/ui/Modal";
import Button from "@/components/ui/Button";
import EmptyState from "@/components/feedback/EmptyState";
import ErrorState from "@/components/feedback/ErrorState";
import { SkeletonCard } from "@/components/ui/Skeleton";
import {
  calculateMonthlySubscriptionTotal,
  calculateYearlySubscriptionTotal,
  calculateAverageSubscriptionCost,
  calculateMostExpensiveSubscription,
  calculateUpcomingPayments,
} from "@/utils/financial";
import { Plus, RotateCcw, CreditCard, ListFilter } from "lucide-react";
import type { Subscription } from "@/features/subscriptions/subscriptionsSlice";
import type { SubscriptionFormData } from "@/features/subscriptions/components/SubscriptionForm";

export const Subscriptions: React.FC = () => {
  const {
    subscriptions,
    loading,
    error,
    handleRetry,
    handleAddSubscription,
    handleUpdateSubscription,
    handleDeleteSubscription,
  } = useSubscriptions();

  // Modals & States
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [selectedSub, setSelectedSub] = useState<Subscription | null>(null);
  const [categoryFilter, setCategoryFilter] = useState("All");
  const [statusFilter, setStatusFilter] = useState("All");
  const [isSubmitLoading, setIsSubmitLoading] = useState(false);

  const handleOpenEdit = (sub: Subscription) => {
    setSelectedSub(sub);
    setIsEditModalOpen(true);
  };

  const handleOpenDelete = (sub: Subscription) => {
    setSelectedSub(sub);
    setIsDeleteOpen(true);
  };

  const handleOpenView = (sub: Subscription) => {
    setSelectedSub(sub);
    setIsDetailModalOpen(true);
  };

  const onAddSubmit = async (data: SubscriptionFormData) => {
    setIsSubmitLoading(true);
    const success = await handleAddSubscription(data);
    setIsSubmitLoading(false);
    if (success) {
      setIsAddModalOpen(false);
    }
  };

  const onEditSubmit = async (data: SubscriptionFormData) => {
    if (!selectedSub) return;
    setIsSubmitLoading(true);
    const success = await handleUpdateSubscription(selectedSub.id, data);
    setIsSubmitLoading(false);
    if (success) {
      setIsEditModalOpen(false);
      setSelectedSub(null);
    }
  };

  const onDeleteConfirm = async () => {
    if (!selectedSub) return;
    setIsSubmitLoading(true);
    const success = await handleDeleteSubscription(selectedSub.id);
    setIsSubmitLoading(false);
    if (success) {
      setIsDeleteOpen(false);
      setSelectedSub(null);
    }
  };

  // 1. Dinamik Hesaplamalar
  const monthlyTotal = useMemo(
    () => calculateMonthlySubscriptionTotal(subscriptions),
    [subscriptions],
  );
  const yearlyTotal = useMemo(
    () => calculateYearlySubscriptionTotal(subscriptions),
    [subscriptions],
  );
  const averageCost = useMemo(
    () => calculateAverageSubscriptionCost(subscriptions),
    [subscriptions],
  );
  const mostExpensive = useMemo(
    () => calculateMostExpensiveSubscription(subscriptions),
    [subscriptions],
  );
  const upcomingPayments = useMemo(() => calculateUpcomingPayments(subscriptions), [subscriptions]);

  const mostExpensiveName = mostExpensive ? mostExpensive.name : "Yok";
  const mostExpensiveCost = mostExpensive
    ? mostExpensive.billingCycle === "yearly"
      ? mostExpensive.cost / 12
      : mostExpensive.cost
    : 0;

  // 2. Filtreleme ve Sıralama
  const filteredSubscriptions = useMemo(() => {
    return upcomingPayments.filter((sub) => {
      const matchesCategory =
        categoryFilter === "All" || sub.category.toLowerCase() === categoryFilter.toLowerCase();
      const matchesStatus = statusFilter === "All" || sub.status === statusFilter.toLowerCase();
      return matchesCategory && matchesStatus;
    });
  }, [upcomingPayments, categoryFilter, statusFilter]);

  // Render loading state
  if (loading) {
    return (
      <div className="w-full max-w-container-max mx-auto text-left space-y-8 select-none">
        <div className="space-y-2">
          <div className="h-8 w-1/4 bg-slate-200 dark:bg-slate-800 rounded animate-pulse" />
          <div className="h-4 w-1/3 bg-slate-200 dark:bg-slate-800 rounded animate-pulse" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="h-28 bg-slate-200 dark:bg-slate-800 rounded animate-pulse" />
          <div className="h-28 bg-slate-200 dark:bg-slate-800 rounded animate-pulse" />
          <div className="h-28 bg-slate-200 dark:bg-slate-800 rounded animate-pulse" />
          <div className="h-28 bg-slate-200 dark:bg-slate-800 rounded animate-pulse" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          <SkeletonCard hasAvatar={false} lines={3} className="h-56" />
          <SkeletonCard hasAvatar={false} lines={3} className="h-56" />
          <SkeletonCard hasAvatar={false} lines={3} className="h-56" />
        </div>
      </div>
    );
  }

  // Render error state
  if (error) {
    return (
      <div className="w-full max-w-container-max mx-auto text-left py-12">
        <ErrorState
          title="Abonelikler Yüklenemedi"
          description="Abonelik listesi mock sunucudan çekilirken bir problem yaşandı. Lütfen tekrar deneyiniz."
          onRetry={handleRetry}
          retryLabel="Yeniden Dene"
          retryIcon={<RotateCcw size={16} />}
        />
      </div>
    );
  }

  return (
    <div className="w-full max-w-container-max mx-auto text-left">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8 select-none">
        <div>
          <h2 className="font-headline-lg text-headline-lg text-on-surface font-extrabold tracking-tight">
            Subscription Tracker
          </h2>
          <p className="font-body-md text-body-md text-slate-500 dark:text-slate-400 font-medium mt-1">
            Tekrarlayan giderlerinizi izleyin, gereksiz abonelikleri tespit edin ve bütçenizi
            optimize edin.
          </p>
        </div>
        <Button variant="primary" icon={<Plus size={18} />} onClick={() => setIsAddModalOpen(true)}>
          Add Subscription
        </Button>
      </div>

      {/* Summary metrics bento cards */}
      <SubscriptionSummary
        monthlyTotal={monthlyTotal}
        yearlyTotal={yearlyTotal}
        averageCost={averageCost}
        mostExpensiveName={mostExpensiveName}
        mostExpensiveCost={mostExpensiveCost}
        loading={false}
      />

      {/* Filters bar */}
      <div className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200/80 dark:border-slate-800/80 mb-6 flex flex-wrap items-center justify-between gap-4 shadow-soft-sm select-none">
        <div className="flex flex-wrap items-center gap-3">
          <div className="relative">
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="appearance-none bg-slate-50 dark:bg-slate-850 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-2 pr-8 text-xs font-bold text-slate-500 dark:text-slate-400 focus:ring-2 focus:ring-primary focus:border-transparent outline-none cursor-pointer"
            >
              <option value="All">Tüm Kategoriler</option>
              <option value="Video">Video</option>
              <option value="Music">Müzik</option>
              <option value="Cloud">Bulut</option>
              <option value="AI">AI / Yapay Zeka</option>
              <option value="Software">Yazılım</option>
              <option value="Education">Eğitim</option>
              <option value="Gaming">Oyun</option>
              <option value="Finance">Finans</option>
              <option value="Other">Diğer</option>
            </select>
            <span className="absolute right-3 top-1/2 -translate-y-1/2 w-0 h-0 border-l-4 border-l-transparent border-r-4 border-r-transparent border-t-4 border-t-slate-400 pointer-events-none" />
          </div>

          <div className="relative">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="appearance-none bg-slate-50 dark:bg-slate-850 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-2 pr-8 text-xs font-bold text-slate-500 dark:text-slate-400 focus:ring-2 focus:ring-primary focus:border-transparent outline-none cursor-pointer"
            >
              <option value="All">Tüm Durumlar</option>
              <option value="Active">Aktif</option>
              <option value="Paused">Duraklatıldı</option>
              <option value="Cancelled">İptal Edildi</option>
            </select>
            <span className="absolute right-3 top-1/2 -translate-y-1/2 w-0 h-0 border-l-4 border-l-transparent border-r-4 border-r-transparent border-t-4 border-t-slate-400 pointer-events-none" />
          </div>
        </div>
        <div className="flex items-center gap-1 font-bold text-[10px] text-slate-400 dark:text-slate-500 uppercase tracking-wider">
          <ListFilter size={14} /> Sıralama: Yaklaşan Ödeme
        </div>
      </div>

      {/* Subscription Cards Grid / Empty State */}
      {filteredSubscriptions.length === 0 ? (
        <EmptyState
          title="Abonelik Bulunamadı"
          description="Uygulanan filtrelere uygun veya kayıtlı herhangi bir abonelik bulunmamaktadır."
          icon={<CreditCard size={24} />}
          primaryActionLabel="Filtreleri Temizle"
          onPrimaryActionClick={() => {
            setCategoryFilter("All");
            setStatusFilter("All");
          }}
          primaryActionIcon={<RotateCcw size={16} />}
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {filteredSubscriptions.map((sub) => (
            <SubscriptionCard
              key={sub.id}
              subscription={sub}
              onEdit={handleOpenEdit}
              onDelete={handleOpenDelete}
              onView={handleOpenView}
            />
          ))}
        </div>
      )}

      {/* Add Subscription Modal */}
      <Modal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        title="Yeni Abonelik Ekle"
        size="md"
      >
        <SubscriptionForm onSubmit={onAddSubmit} loading={isSubmitLoading} submitLabel="Ekle" />
      </Modal>

      {/* Edit Subscription Modal */}
      <Modal
        isOpen={isEditModalOpen}
        onClose={() => {
          setIsEditModalOpen(false);
          setSelectedSub(null);
        }}
        title="Aboneliği Düzenle"
        size="md"
      >
        {selectedSub && (
          <SubscriptionForm
            onSubmit={onEditSubmit}
            loading={isSubmitLoading}
            defaultValues={{
              name: selectedSub.name,
              cost: selectedSub.cost,
              billingCycle: selectedSub.billingCycle,
              nextBillingDate: selectedSub.nextBillingDate,
              category: selectedSub.category,
              billingType: selectedSub.billingType || "Kredi Kartı",
              autoRenew: selectedSub.autoRenew !== undefined ? selectedSub.autoRenew : true,
              startDate: selectedSub.startDate,
              status: selectedSub.status || "active",
              notes: selectedSub.notes || "",
              color: selectedSub.color || "#004ac6",
            }}
            submitLabel="Güncelle"
          />
        )}
      </Modal>

      {/* Detail Subscription Modal */}
      <SubscriptionDetailModal
        isOpen={isDetailModalOpen}
        onClose={() => {
          setIsDetailModalOpen(false);
          setSelectedSub(null);
        }}
        subscription={selectedSub}
      />

      {/* Delete Confirmation Dialog */}
      <ConfirmDialog
        isOpen={isDeleteOpen}
        onClose={() => {
          setIsDeleteOpen(false);
          setSelectedSub(null);
        }}
        onConfirm={onDeleteConfirm}
        loading={isSubmitLoading}
        title="Aboneliği Silmek İstediğinize Emin misiniz?"
        description="Bu işlem seçilen abonelik kaydını kalıcı olarak silecektir ve işlem geri alınamaz."
        confirmLabel="Sil"
        cancelLabel="Vazgeç"
        variant="danger"
      />
    </div>
  );
};

export default Subscriptions;
