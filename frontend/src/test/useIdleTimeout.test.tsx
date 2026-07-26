import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { renderHook, act } from "@testing-library/react";
import { useIdleTimeout } from "../hooks/useIdleTimeout";
import React from "react";
import { Provider } from "react-redux";
import { configureStore } from "@reduxjs/toolkit";
import authReducer from "../features/auth/authSlice";
import themeReducer from "../store/themeSlice";
import { mockUser } from "./fixtures";

describe("useIdleTimeout Hook Tests", () => {
  beforeEach(() => {
    vi.useFakeTimers();
    localStorage.clear();
  });

  afterEach(() => {
    vi.restoreAllMocks();
    vi.useRealTimers();
  });

  const createMockStore = (isAuthenticated = true) =>
    configureStore({
      reducer: {
        auth: authReducer,
        theme: themeReducer,
      },
      preloadedState: {
        auth: {
          user: isAuthenticated ? mockUser : null,
          token: isAuthenticated ? "mock-jwt-token" : null,
          isAuthenticated,
          loading: false,
          error: null,
        },
      },
    });

  it("should logout user after 20 minutes of inactivity when authenticated", () => {
    const store = createMockStore(true);
    const wrapper = ({ children }: { children: React.ReactNode }) => (
      <Provider store={store}>{children}</Provider>
    );

    renderHook(() => useIdleTimeout(), { wrapper });

    expect(store.getState().auth.isAuthenticated).toBe(true);

    act(() => {
      vi.advanceTimersByTime(20 * 60 * 1000);
    });

    expect(store.getState().auth.isAuthenticated).toBe(false);
    expect(localStorage.getItem("token")).toBeNull();
  });

  it("should reset timer on user activity like mousemove or click", () => {
    const store = createMockStore(true);
    const wrapper = ({ children }: { children: React.ReactNode }) => (
      <Provider store={store}>{children}</Provider>
    );

    renderHook(() => useIdleTimeout(), { wrapper });

    act(() => {
      vi.advanceTimersByTime(15 * 60 * 1000);
    });
    expect(store.getState().auth.isAuthenticated).toBe(true);

    act(() => {
      window.dispatchEvent(new Event("mousemove"));
    });

    act(() => {
      vi.advanceTimersByTime(15 * 60 * 1000);
    });

    expect(store.getState().auth.isAuthenticated).toBe(true);

    act(() => {
      vi.advanceTimersByTime(5 * 60 * 1000);
    });

    expect(store.getState().auth.isAuthenticated).toBe(false);
  });
});
