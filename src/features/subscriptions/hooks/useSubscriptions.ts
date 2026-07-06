import { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "@/store";
import {
  fetchSubscriptions,
  addSubscription,
  updateSubscription,
  deleteSubscription,
  selectSubscriptions,
  selectSubscriptionsLoading,
  selectSubscriptionsError,
} from "../subscriptionsSlice";
import type { Subscription } from "../subscriptionsSlice";
import { addActivityLog } from "@/features/activity/activitySlice";
import { addNotification } from "@/features/notifications/notificationsSlice";
import toast from "react-hot-toast";

export const useSubscriptions = () => {
  const dispatch = useAppDispatch();
  const subscriptions = useAppSelector(selectSubscriptions);
  const loading = useAppSelector(selectSubscriptionsLoading);
  const error = useAppSelector(selectSubscriptionsError);

  useEffect(() => {
    dispatch(fetchSubscriptions());
  }, [dispatch]);

  const handleRetry = () => {
    dispatch(fetchSubscriptions());
  };

  const handleAddSubscription = async (data: Omit<Subscription, "id" | "userId">) => {
    try {
      const resultAction = await dispatch(addSubscription(data));
      if (addSubscription.fulfilled.match(resultAction)) {
        dispatch(
          addActivityLog({
            action: "Subscription Added",
            category: "Subscriptions",
            description: `"${data.name}" isimli yeni abonelik takibi eklendi.`,
            user: "Aygen",
            icon: "CreditCard",
            status: "success",
          }),
        );
        dispatch(
          addNotification({
            title: "Subscription Added",
            message: `"${data.name}" abonelik takibiniz başarıyla başlatıldı.`,
            type: "success",
            icon: "CreditCard",
          }),
        );
        toast.success("Abonelik başarıyla kaydedildi.");
        return true;
      } else {
        toast.error((resultAction.payload as string) || "Abonelik kaydedilemedi.");
        return false;
      }
    } catch {
      toast.error("Bir hata oluştu.");
      return false;
    }
  };

  const handleUpdateSubscription = async (id: string, data: Partial<Subscription>) => {
    try {
      const resultAction = await dispatch(updateSubscription({ id, data }));
      if (updateSubscription.fulfilled.match(resultAction)) {
        let notifTitle = "Subscription Updated";
        let notifMsg = "Abonelik detayları başarıyla güncellendi.";
        let notifType: "info" | "warning" | "success" = "info";

        if (data.status === "cancelled") {
          notifTitle = "Subscription iptal edildi";
          notifMsg = "Abonelik takibiniz iptal edildi olarak işaretlendi.";
          notifType = "warning";
        } else if (data.status === "active") {
          notifTitle = "Subscription yenileniyor";
          notifMsg = "Abonelik takibiniz aktif olarak güncellendi ve yenileniyor.";
          notifType = "success";
        }

        dispatch(
          addActivityLog({
            action: notifTitle,
            category: "Subscriptions",
            description: notifMsg,
            user: "Aygen",
            icon: "CreditCard",
            status: notifType === "warning" ? "warning" : "success",
          }),
        );
        dispatch(
          addNotification({
            title: notifTitle,
            message: notifMsg,
            type: notifType,
            icon: "CreditCard",
          }),
        );
        toast.success("Abonelik başarıyla güncellendi.");
        return true;
      } else {
        toast.error((resultAction.payload as string) || "Abonelik güncellenemedi.");
        return false;
      }
    } catch {
      toast.error("Bir hata oluştu.");
      return false;
    }
  };

  const handleDeleteSubscription = async (id: string) => {
    try {
      const resultAction = await dispatch(deleteSubscription(id));
      if (deleteSubscription.fulfilled.match(resultAction)) {
        dispatch(
          addActivityLog({
            action: "Subscription Removed",
            category: "Subscriptions",
            description: `Abonelik takibi sonlandırıldı.`,
            user: "Aygen",
            icon: "Trash2",
            status: "warning",
          }),
        );
        dispatch(
          addNotification({
            title: "Subscription Removed",
            message: `Abonelik takibi sonlandırıldı.`,
            type: "warning",
            icon: "Trash2",
          }),
        );
        toast.success("Abonelik başarıyla silindi.");
        return true;
      } else {
        toast.error((resultAction.payload as string) || "Abonelik silinemedi.");
        return false;
      }
    } catch {
      toast.error("Bir hata oluştu.");
      return false;
    }
  };

  return {
    subscriptions,
    loading,
    error,
    handleRetry,
    handleAddSubscription,
    handleUpdateSubscription,
    handleDeleteSubscription,
  };
};

export default useSubscriptions;
