import { describe, it, expect } from "vitest";
import authReducer, { logout, AuthState } from "@/features/auth/authSlice";

describe("authSlice reducer", () => {
  const initialState: AuthState = {
    user: {
      id: "1",
      firstName: "Test",
      lastName: "User",
      email: "test@financefocus.com",
      role: "User",
    },
    token: "valid-jwt-token",
    isAuthenticated: true,
    loading: false,
    error: null,
  };

  it("should handle logout and clear session state", () => {
    const nextState = authReducer(initialState, logout());
    expect(nextState.isAuthenticated).toBe(false);
    expect(nextState.token).toBeNull();
    expect(nextState.user).toBeNull();
    expect(nextState.error).toBeNull();
  });
});
