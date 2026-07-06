import { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "@/store";
import {
  fetchTransactions,
  addTransaction,
  updateTransaction,
  deleteTransaction,
  setFilters,
  setSearch,
  resetFilters,
  selectFilters,
  selectActiveFiltersCount,
  selectTransactions,
  selectFilteredTransactions,
  selectTransactionsLoading,
  selectTransactionsError,
} from "../transactionsSlice";
import type { Transaction, TransactionFilters } from "../types/transactions.types";
import { addActivityLog } from "@/features/activity/activitySlice";
import { addNotification } from "@/features/notifications/notificationsSlice";
import { selectBudgets, fetchBudgets } from "@/features/budget/budgetSlice";
import toast from "react-hot-toast";

export const useTransactions = () => {
  const dispatch = useAppDispatch();
  const transactions = useAppSelector(selectFilteredTransactions);
  const allTransactions = useAppSelector(selectTransactions);
  const filters = useAppSelector(selectFilters);
  const activeFiltersCount = useAppSelector(selectActiveFiltersCount);
  const loading = useAppSelector(selectTransactionsLoading);
  const error = useAppSelector(selectTransactionsError);
  const budgets = useAppSelector(selectBudgets);

  useEffect(() => {
    dispatch(fetchTransactions());
    dispatch(fetchBudgets());
  }, [dispatch]);

  const handleRetry = () => {
    dispatch(fetchTransactions());
  };

  const handleSetFilters = (newFilters: Partial<TransactionFilters>) => {
    dispatch(setFilters(newFilters));
  };

  const handleSetSearch = (query: string) => {
    dispatch(setSearch(query));
  };

  const handleResetFilters = () => {
    dispatch(resetFilters());
  };

  const handleAddTransaction = async (
    data: Omit<Transaction, "id" | "userId" | "createdAt" | "updatedAt">,
  ) => {
    try {
      const resultAction = await dispatch(
        addTransaction({
          ...data,
          userId: "1",
        }),
      );
      if (addTransaction.fulfilled.match(resultAction)) {
        dispatch(
          addActivityLog({
            action: "Transaction Added",
            category: "Transactions",
            description: `"${data.title}" isimli yeni işlem başarıyla eklendi.`,
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

        // Budget Limit Exceeded Check
        if (data.transactionType === "expense") {
          const matchingBudget = budgets.find(
            (b) => b.category.toLowerCase() === data.category.toLowerCase(),
          );
          if (matchingBudget) {
            const newSpent = matchingBudget.spentAmount + data.amount;
            if (newSpent > matchingBudget.limitAmount) {
              dispatch(
                addNotification({
                  title: "Budget Limit Exceeded",
                  message: `"${matchingBudget.category}" bütçe limiti aşılmıştır! Bütçe: ${matchingBudget.limitAmount} TRY, Harcanan: ${newSpent} TRY.`,
                  type: "error",
                  icon: "Sliders",
                }),
              );
              toast.error(`Bütçe Limiti Aşıldı: ${matchingBudget.category}!`, {
                duration: 5000,
              });
            }
          }
        }

        toast.success("İşlem başarıyla kaydedildi.");
        return true;
      } else {
        toast.error((resultAction.payload as string) || "İşlem kaydedilemedi.");
        return false;
      }
    } catch {
      toast.error("Bir hata oluştu.");
      return false;
    }
  };

  const handleUpdateTransaction = async (id: string, data: Partial<Transaction>) => {
    try {
      const resultAction = await dispatch(updateTransaction({ id, data }));
      if (updateTransaction.fulfilled.match(resultAction)) {
        dispatch(
          addActivityLog({
            action: "Transaction Updated",
            category: "Transactions",
            description: `İşlem kaydı güncellendi.`,
            user: "Aygen",
            icon: "Edit2",
            status: "success",
          }),
        );
        dispatch(
          addNotification({
            title: "Transaction Updated",
            message: `İşlem kaydınız güncellendi.`,
            type: "success",
            icon: "Edit2",
          }),
        );
        toast.success("İşlem başarıyla güncellendi.");
        return true;
      } else {
        toast.error((resultAction.payload as string) || "İşlem güncellenemedi.");
        return false;
      }
    } catch {
      toast.error("Bir hata oluştu.");
      return false;
    }
  };

  const handleDeleteTransaction = async (id: string) => {
    try {
      const resultAction = await dispatch(deleteTransaction(id));
      if (deleteTransaction.fulfilled.match(resultAction)) {
        dispatch(
          addActivityLog({
            action: "Transaction Deleted",
            category: "Transactions",
            description: `İşlem kaydı başarıyla silindi.`,
            user: "Aygen",
            icon: "Trash2",
            status: "warning",
          }),
        );
        dispatch(
          addNotification({
            title: "Transaction Deleted",
            message: `İşlem kaydı başarıyla hesabınızdan kaldırıldı.`,
            type: "warning",
            icon: "Trash2",
          }),
        );
        toast.success("İşlem başarıyla silindi.");
        return true;
      } else {
        toast.error((resultAction.payload as string) || "İşlem silinemedi.");
        return false;
      }
    } catch {
      toast.error("Bir hata oluştu.");
      return false;
    }
  };

  return {
    transactions,
    allTransactions,
    filters,
    activeFiltersCount,
    loading,
    error,
    handleRetry,
    handleSetFilters,
    handleSetSearch,
    handleResetFilters,
    handleAddTransaction,
    handleUpdateTransaction,
    handleDeleteTransaction,
  };
};

export default useTransactions;
