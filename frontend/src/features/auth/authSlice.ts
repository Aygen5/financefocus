import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import authApi from "../../api/authApi";
import type { LoginRequestDto, RegisterRequestDto, UserDto } from "../../api/authApi";

export interface AuthState {
  user: UserDto | null;
  token: string | null;
  isAuthenticated: boolean;
  loading: boolean;
  error: string | null;
}

const savedToken = localStorage.getItem("token");
const savedUserStr = localStorage.getItem("user");
const initialUser: UserDto | null = savedUserStr ? JSON.parse(savedUserStr) : null;

const initialState: AuthState = {
  user: initialUser,
  token: savedToken,
  isAuthenticated: !!savedToken,
  loading: false,
  error: null,
};

export const loginUser = createAsyncThunk(
  "auth/loginUser",
  async (credentials: LoginRequestDto, { rejectWithValue }) => {
    try {
      const response = await authApi.login(credentials);
      if (response.success && response.data) {
        localStorage.setItem("token", response.data.token);
        localStorage.setItem("user", JSON.stringify(response.data.user));
        return response.data;
      }
      return rejectWithValue(response.message || "Giriş başarısız.");
    } catch (err: unknown) {
      const errorObj = err as {
        response?: { data?: { message?: string; errors?: string[] } };
        message?: string;
      };
      const errorMessage = errorObj.response?.data?.errors?.length
        ? errorObj.response.data.errors.join(" ")
        : errorObj.response?.data?.message || errorObj.message || "Giriş yapılamadı.";
      return rejectWithValue(errorMessage);
    }
  },
);

export const registerUser = createAsyncThunk(
  "auth/registerUser",
  async (userData: RegisterRequestDto, { rejectWithValue }) => {
    try {
      const response = await authApi.register(userData);
      if (response.success) {
        return response.message || "Kayıt başarıyla gerçekleşti.";
      }
      return rejectWithValue(response.message || "Kayıt başarısız.");
    } catch (err: unknown) {
      const errorObj = err as {
        response?: { data?: { message?: string; errors?: string[] } };
        message?: string;
      };
      const errorMessage = errorObj.response?.data?.errors?.length
        ? errorObj.response.data.errors.join(" ")
        : errorObj.response?.data?.message || errorObj.message || "Kayıt yapılamadı.";
      return rejectWithValue(errorMessage);
    }
  },
);

export const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    logout: (state) => {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      state.user = null;
      state.token = null;
      state.isAuthenticated = false;
      state.error = null;
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loginUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.loading = false;
        state.isAuthenticated = true;
        state.token = action.payload.token;
        state.user = action.payload.user;
        state.error = null;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.error = (action.payload as string) || "Giriş başarısız.";
      })
      .addCase(registerUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(registerUser.fulfilled, (state) => {
        state.loading = false;
        state.error = null;
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.loading = false;
        state.error = (action.payload as string) || "Kayıt başarısız.";
      });
  },
});

export const selectAuthUser = (state: { auth: AuthState }) => state.auth.user;
export const selectIsAuthenticated = (state: { auth: AuthState }) => state.auth.isAuthenticated;
export const selectAuthLoading = (state: { auth: AuthState }) => state.auth.loading;
export const selectAuthError = (state: { auth: AuthState }) => state.auth.error;

export const { logout, clearError } = authSlice.actions;
export default authSlice.reducer;
