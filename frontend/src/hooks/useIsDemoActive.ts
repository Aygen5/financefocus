import { useMemo, useCallback } from "react";
import { useAppDispatch, useAppSelector } from "@/store";
import onboardingApi from "@/api/onboardingApi";
import { fetchDashboardData, resetDashboard } from "@/features/dashboard/dashboardSlice";
import { fetchTransactions, clearTransactions } from "@/features/transactions/transactionsSlice";
import { fetchBudgets, clearBudgets } from "@/features/budget/budgetSlice";
import { fetchPortfolio, clearPortfolio } from "@/features/portfolio/portfolioSlice";
import { fetchGoals, clearGoals } from "@/features/goals/goalsSlice";
import {
  fetchSubscriptions,
  clearSubscriptions,
} from "@/features/subscriptions/subscriptionsSlice";
import { fetchFinancialHealth, resetHealth } from "@/features/financialHealth/financialHealthSlice";
import { fetchForecastData, clearForecast } from "@/features/forecast/forecastSlice";
import { clearReports } from "@/features/reports/reportsSlice";
import { fetchActivities, clearActivities } from "@/features/activity/activitySlice";
import {
  fetchNotifications,
  clearNotifications,
} from "@/features/notifications/notificationsSlice";
import { clearChat } from "@/features/ai/aiSlice";
import toast from "react-hot-toast";

export const useIsDemoActive = () => {
  const dispatch = useAppDispatch();

  const { items: transactions = [] } = useAppSelector((state) => state.transactions || {});
  const { items: budgets = [] } = useAppSelector((state) => state.budget || {});
  const { assets = [] } = useAppSelector((state) => state.portfolio || {});
  const { items: goals = [] } = useAppSelector((state) => state.goals || {});
  const { items: subscriptions = [] } = useAppSelector((state) => state.subscriptions || {});
  const { logs: activities = [] } = useAppSelector((state) => state.activity || {});
  const { notifications = [] } = useAppSelector((state) => state.notifications || {});

  // Dynamic counts based on actual EF Core DB / API entity flags (IsDemo == true)
  const demoCounts = useMemo(() => {
    const isDemoItem = (item: Record<string, unknown>) => Boolean(item.isDemo || item.IsDemo);

    const demoTrans = transactions.filter(isDemoItem).length;
    const demoBudgets = budgets.filter(isDemoItem).length;
    const demoAssets = assets.filter(isDemoItem).length;
    const demoGoals = goals.filter(isDemoItem).length;
    const demoSubs = subscriptions.filter(isDemoItem).length;
    const demoActs = activities.filter(isDemoItem).length;
    const demoNotifs = notifications.filter(isDemoItem).length;

    return {
      transactions: demoTrans,
      budgets: demoBudgets,
      portfolio: demoAssets,
      goals: demoGoals,
      subscriptions: demoSubs,
      activities: demoActs,
      notifications: demoNotifs,
      total: demoTrans + demoBudgets + demoAssets + demoGoals + demoSubs + demoActs + demoNotifs,
    };
  }, [transactions, budgets, assets, goals, subscriptions, activities, notifications]);

  // Single Source of Truth: Is Demo Mode active?
  const isDemoActive = useMemo(() => {
    const isStoredDemo = localStorage.getItem("is_demo_mode") === "true";
    return isStoredDemo || demoCounts.total > 0;
  }, [demoCounts.total]);

  const exitDemoMode = useCallback(async () => {
    try {
      const res = await onboardingApi.clearDemoData();
      localStorage.removeItem("is_demo_mode");

      // 1. Instantly purge all Redux slice states to clean empty slate
      dispatch(resetDashboard());
      dispatch(clearTransactions());
      dispatch(clearBudgets());
      dispatch(clearPortfolio());
      dispatch(clearGoals());
      dispatch(clearSubscriptions());
      dispatch(resetHealth());
      dispatch(clearForecast());
      dispatch(clearReports());
      dispatch(clearActivities());
      dispatch(clearNotifications());
      dispatch(clearChat());

      // 2. Notify and re-fetch real user data from backend (which returns clean 0s + any real user items)
      if (res.success) {
        toast.success("Demo modundan çıkıldı. Demo verileri temizlendi.");
      } else {
        toast.error(res.message || "Demo verileri temizlenirken hata oluştu.");
      }

      await Promise.all([
        dispatch(fetchDashboardData()),
        dispatch(fetchTransactions()),
        dispatch(fetchBudgets()),
        dispatch(fetchPortfolio()),
        dispatch(fetchGoals()),
        dispatch(fetchSubscriptions()),
        dispatch(fetchFinancialHealth()),
        dispatch(fetchForecastData()),
        dispatch(fetchActivities()),
        dispatch(fetchNotifications()),
      ]);
    } catch {
      toast.error("Demo verileri temizlenirken hata oluştu.");
    }
  }, [dispatch]);

  return {
    isDemoActive,
    demoCounts,
    exitDemoMode,
  };
};

export default useIsDemoActive;
