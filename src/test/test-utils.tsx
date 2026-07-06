import React, { PropsWithChildren } from "react";
import { render } from "@testing-library/react";
import type { RenderOptions } from "@testing-library/react";
import { Provider } from "react-redux";
import { configureStore, EnhancedStore } from "@reduxjs/toolkit";
import { MemoryRouter } from "react-router-dom";

// Reducers
import authReducer from "@/features/auth/authSlice";
import themeReducer from "@/store/themeSlice";
import transactionsReducer from "@/features/transactions/transactionsSlice";
import budgetReducer from "@/features/budget/budgetSlice";
import notificationsReducer from "@/features/notifications/notificationsSlice";
import activityReducer from "@/features/activity/activitySlice";

export function renderWithProviders(
  ui: React.ReactElement,
  {
    preloadedState = {},
    store = configureStore({
      reducer: {
        auth: authReducer,
        theme: themeReducer,
        transactions: transactionsReducer,
        budget: budgetReducer,
        notifications: notificationsReducer,
        activity: activityReducer,
      },
      preloadedState,
    }),
    route = "/",
    ...renderOptions
  }: {
    preloadedState?: Record<string, unknown>;
    store?: EnhancedStore;
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
