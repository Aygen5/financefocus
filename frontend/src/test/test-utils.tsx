import React, { type PropsWithChildren } from "react";
import { render } from "@testing-library/react";
import type { RenderOptions } from "@testing-library/react";
import { Provider } from "react-redux";
import { configureStore } from "@reduxjs/toolkit";
import type { Store } from "@reduxjs/toolkit";
import type { RootState } from "../store";
import { MemoryRouter } from "react-router-dom";

import authReducer from "@/features/auth/authSlice";
import themeReducer from "@/store/themeSlice";
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
import dashboardReducer from "@/features/dashboard/dashboardSlice";
import aiReducer from "@/features/ai/aiSlice";

export function renderWithProviders(
  ui: React.ReactElement,
  {
    preloadedState = undefined,
    store = configureStore({
      reducer: {
        auth: authReducer,
        theme: themeReducer,
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
        dashboard: dashboardReducer,
        ai: aiReducer,
      },
      preloadedState: preloadedState as undefined,
    }),
    route = "/",
    ...renderOptions
  }: {
    preloadedState?: Partial<RootState>;
    store?: Store;
    route?: string;
  } & Omit<RenderOptions, "queries"> = {},
) {
  function Wrapper({ children }: PropsWithChildren<unknown>): React.JSX.Element {
    return (
      <Provider store={store}>
        <MemoryRouter initialEntries={[route]}>{children}</MemoryRouter>
      </Provider>
    );
  }
  return { store, ...render(ui, { wrapper: Wrapper, ...renderOptions }) };
}
