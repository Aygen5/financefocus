import React, { useState } from "react";
import useGoals from "@/features/goals/hooks/useGoals";
import GoalCard from "@/features/goals/components/GoalCard";
import GoalForm from "@/features/goals/components/GoalForm";
import GoalDetailModal from "@/features/goals/components/GoalDetailModal";
import ConfirmDialog from "@/components/feedback/ConfirmDialog";
import Modal from "@/components/ui/Modal";
import Button from "@/components/ui/Button";
import EmptyState from "@/components/feedback/EmptyState";
import ErrorState from "@/components/feedback/ErrorState";
import { SkeletonCard } from "@/components/ui/Skeleton";
import { Plus, RotateCcw, Award } from "lucide-react";
import type { FinancialGoal } from "@/features/goals/goalsSlice";
import type { GoalFormData } from "@/features/goals/components/GoalForm";

export const Goals: React.FC = () => {
  const { goals, loading, error, handleRetry, handleAddGoal, handleUpdateGoal, handleDeleteGoal } =
    useGoals();

  // Modals & States
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [selectedGoal, setSelectedGoal] = useState<FinancialGoal | null>(null);
  const [isSubmitLoading, setIsSubmitLoading] = useState(false);

  const handleOpenEdit = (goal: FinancialGoal) => {
    setSelectedGoal(goal);
    setIsEditModalOpen(true);
  };

  const handleOpenDelete = (goal: FinancialGoal) => {
    setSelectedGoal(goal);
    setIsDeleteOpen(true);
  };

  const handleOpenView = (goal: FinancialGoal) => {
    setSelectedGoal(goal);
    setIsDetailModalOpen(true);
  };

  const onAddSubmit = async (data: GoalFormData) => {
    setIsSubmitLoading(true);
    const success = await handleAddGoal({
      ...data,
      startDate: new Date().toISOString().split("T")[0],
    });
    setIsSubmitLoading(false);
    if (success) {
      setIsAddModalOpen(false);
    }
  };

  const onEditSubmit = async (data: GoalFormData) => {
    if (!selectedGoal) return;
    setIsSubmitLoading(true);
    const success = await handleUpdateGoal(selectedGoal.id, data);
    setIsSubmitLoading(false);
    if (success) {
      setIsEditModalOpen(false);
      setSelectedGoal(null);
    }
  };

  const onDeleteConfirm = async () => {
    if (!selectedGoal) return;
    setIsSubmitLoading(true);
    const success = await handleDeleteGoal(selectedGoal.id);
    setIsSubmitLoading(false);
    if (success) {
      setIsDeleteOpen(false);
      setSelectedGoal(null);
    }
  };

  // Render loading state
  if (loading) {
    return (
      <div className="w-full max-w-container-max mx-auto text-left space-y-8 select-none">
        <div className="space-y-2">
          <div className="h-8 w-1/4 bg-slate-200 dark:bg-slate-800 rounded animate-pulse" />
          <div className="h-4 w-1/3 bg-slate-200 dark:bg-slate-800 rounded animate-pulse" />
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
          title="Hedefler Yüklenemedi"
          description="Finansal hedefler sunucudan çekilirken bir problem yaşandı. Lütfen tekrar deneyiniz."
          onRetry={handleRetry}
          retryLabel="Yeniden Dene"
          retryIcon={<RotateCcw size={16} />}
        />
      </div>
    );
  }

  // Render empty state
  if (goals.length === 0) {
    return (
      <div className="w-full max-w-container-max mx-auto text-left py-12">
        <EmptyState
          title="Henüz Hedef Oluşturulmadı"
          description="Birikimlerinizi planlamak ve hayallerinize ulaşmak için ilk hedefinizi oluşturun."
          icon={<Award size={24} />}
          primaryActionLabel="Yeni Hedef Ekle"
          onPrimaryActionClick={() => setIsAddModalOpen(true)}
          primaryActionIcon={<Plus size={16} />}
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
            Financial Goals
          </h2>
          <p className="font-body-md text-body-md text-slate-500 dark:text-slate-400 font-medium mt-1">
            Geleceğinizi planlayın, tasarruflarınızı ve stratejik finansal hedeflerinizi yönetin.
          </p>
        </div>
        <Button variant="primary" icon={<Plus size={18} />} onClick={() => setIsAddModalOpen(true)}>
          Add Goal
        </Button>
      </div>

      {/* Goals Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {goals.map((goal) => (
          <GoalCard
            key={goal.id}
            goal={goal}
            onEdit={handleOpenEdit}
            onDelete={handleOpenDelete}
            onView={handleOpenView}
          />
        ))}
      </div>

      {/* Add Goal Modal */}
      <Modal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        title="Yeni Hedef Ekle"
        size="md"
      >
        <GoalForm onSubmit={onAddSubmit} loading={isSubmitLoading} submitLabel="Ekle" />
      </Modal>

      {/* Edit Goal Modal */}
      <Modal
        isOpen={isEditModalOpen}
        onClose={() => {
          setIsEditModalOpen(false);
          setSelectedGoal(null);
        }}
        title="Hedefi Düzenle"
        size="md"
      >
        {selectedGoal && (
          <GoalForm
            onSubmit={onEditSubmit}
            loading={isSubmitLoading}
            defaultValues={{
              name: selectedGoal.name,
              category: selectedGoal.category,
              targetAmount: selectedGoal.targetAmount,
              currentAmount: selectedGoal.currentAmount,
              deadline: selectedGoal.deadline,
              monthlyContribution: selectedGoal.monthlyContribution,
              priority: selectedGoal.priority || "medium",
              status: selectedGoal.status || "active",
              notes: selectedGoal.notes || "",
              color: selectedGoal.color || "#004ac6",
            }}
            submitLabel="Güncelle"
          />
        )}
      </Modal>

      {/* Detail Goal Modal */}
      <GoalDetailModal
        isOpen={isDetailModalOpen}
        onClose={() => {
          setIsDetailModalOpen(false);
          setSelectedGoal(null);
        }}
        goal={selectedGoal}
      />

      {/* Delete Confirmation Dialog */}
      <ConfirmDialog
        isOpen={isDeleteOpen}
        onClose={() => {
          setIsDeleteOpen(false);
          setSelectedGoal(null);
        }}
        onConfirm={onDeleteConfirm}
        loading={isSubmitLoading}
        title="Hedefi Silmek İstediğinize Emin misiniz?"
        description="Bu işlem seçilen finansal hedefi kalıcı olarak silecektir ve işlem geri alınamaz."
        confirmLabel="Sil"
        cancelLabel="Vazgeç"
        variant="danger"
      />
    </div>
  );
};

export default Goals;
