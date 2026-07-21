import { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "@/store";
import {
  fetchGoals,
  addGoal,
  updateGoal,
  deleteGoal,
  selectGoals,
  selectGoalsLoading,
  selectGoalsError,
} from "../goalsSlice";
import type { FinancialGoal } from "../goalsSlice";
import { addActivityLog } from "@/features/activity/activitySlice";
import { addNotification } from "@/features/notifications/notificationsSlice";
import toast from "react-hot-toast";

export const useGoals = () => {
  const dispatch = useAppDispatch();
  const goals = useAppSelector(selectGoals);
  const loading = useAppSelector(selectGoalsLoading);
  const error = useAppSelector(selectGoalsError);

  useEffect(() => {
    dispatch(fetchGoals());
  }, [dispatch]);

  const handleRetry = () => {
    dispatch(fetchGoals());
  };

  const handleAddGoal = async (data: Omit<FinancialGoal, "id" | "userId">) => {
    try {
      const resultAction = await dispatch(addGoal(data));
      if (addGoal.fulfilled.match(resultAction)) {
        dispatch(
          addActivityLog({
            action: "Goal Created",
            category: "Goals",
            description: `"${data.name}" isimli yeni hedef oluşturuldu.`,
            user: "Aygen",
            icon: "Award",
            status: "success",
          }),
        );
        dispatch(
          addNotification({
            title: "Goal Created",
            message: `"${data.name}" isimli yeni hedef başarıyla oluşturuldu.`,
            type: "success",
            icon: "Award",
          }),
        );
        toast.success("Finansal hedef başarıyla eklendi.");
        return true;
      } else {
        toast.error((resultAction.payload as string) || "Hedef eklenemedi.");
        return false;
      }
    } catch {
      toast.error("Bir hata oluştu.");
      return false;
    }
  };

  const handleUpdateGoal = async (id: string, data: Partial<FinancialGoal>) => {
    try {
      const resultAction = await dispatch(updateGoal({ id, data }));
      if (updateGoal.fulfilled.match(resultAction)) {
        const isCompleted =
          data.currentAmount !== undefined &&
          data.targetAmount !== undefined &&
          data.currentAmount >= data.targetAmount;
        dispatch(
          addActivityLog({
            action: isCompleted ? "Goal Completed" : "Goal Updated",
            category: "Goals",
            description: isCompleted ? `Hedef başarıyla tamamlandı!` : `Hedef güncellendi.`,
            user: "Aygen",
            icon: "Award",
            status: "success",
          }),
        );
        dispatch(
          addNotification({
            title: isCompleted ? "Goal Completed" : "Goal Updated",
            message: isCompleted
              ? `Tebrikler! Hedefiniz başarıyla tamamlandı.`
              : `Hedef bilgileriniz güncellendi.`,
            type: "success",
            icon: "Award",
          }),
        );
        toast.success("Hedef başarıyla güncellendi.");
        return true;
      } else {
        toast.error((resultAction.payload as string) || "Hedef güncellenemedi.");
        return false;
      }
    } catch {
      toast.error("Bir hata oluştu.");
      return false;
    }
  };

  const handleDeleteGoal = async (id: string) => {
    try {
      const resultAction = await dispatch(deleteGoal(id));
      if (deleteGoal.fulfilled.match(resultAction)) {
        dispatch(
          addActivityLog({
            action: "Goal Deleted",
            category: "Goals",
            description: `Hedef başarıyla silindi.`,
            user: "Aygen",
            icon: "Trash2",
            status: "warning",
          }),
        );
        dispatch(
          addNotification({
            title: "Goal Deleted",
            message: `Finansal hedef silindi.`,
            type: "warning",
            icon: "Trash2",
          }),
        );
        toast.success("Hedef başarıyla silindi.");
        return true;
      } else {
        toast.error((resultAction.payload as string) || "Hedef silinemedi.");
        return false;
      }
    } catch {
      toast.error("Bir hata oluştu.");
      return false;
    }
  };

  return {
    goals,
    loading,
    error,
    handleRetry,
    handleAddGoal,
    handleUpdateGoal,
    handleDeleteGoal,
  };
};

export default useGoals;
