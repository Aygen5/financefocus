import { configureStore } from "@reduxjs/toolkit";
import { useDispatch, useSelector } from "react-redux";
import type { TypedUseSelectorHook } from "react-redux";
import authReducer from "@/features/auth/authSlice";
import dashboardReducer from "@/features/dashboard/dashboardSlice";
import transactionsReducer from "@/features/transactions/transactionsSlice";
import budgetReducer from "@/features/budget/budgetSlice";
import goalsReducer from "@/features/goals/goalsSlice";
import portfolioReducer from "@/features/portfolio/portfolioSlice";
import subscriptionsReducer from "@/features/subscriptions/subscriptionsSlice";
import reportsReducer from "@/features/reports/reportsSlice";
import forecastReducer from "@/features/forecast/forecastSlice";
import notificationsReducer from "@/features/notifications/notificationsSlice";
import activityReducer from "@/features/activity/activitySlice";
import financialHealthReducer from "@/features/financialHealth/financialHealthSlice";
import settingsReducer from "@/features/settings/settingsSlice";
import aiReducer from "@/features/ai/aiSlice";
import themeReducer from "./themeSlice";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    dashboard: dashboardReducer,
    transactions: transactionsReducer,
    budget: budgetReducer,
    goals: goalsReducer,
    portfolio: portfolioReducer,
    subscriptions: subscriptionsReducer,
    reports: reportsReducer,
    forecast: forecastReducer,
    notifications: notificationsReducer,
    activity: activityReducer,
    financialHealth: financialHealthReducer,
    settings: settingsReducer,
    ai: aiReducer,
    theme: themeReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export const useAppDispatch = () => useDispatch<AppDispatch>();
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
export default store;
