/* eslint-disable @typescript-eslint/no-explicit-any */
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import api from "@/services/api";
import type { LoginFormData, RegisterFormData } from "./auth.types";

interface User {
  id: string;
  email: string;
  name: string;
}

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  loading: boolean;
  error: string | null;
}

const initialState: AuthState = {
  user:
    typeof window !== "undefined" && localStorage.getItem("user")
      ? JSON.parse(localStorage.getItem("user")!)
      : null,
  isAuthenticated: typeof window !== "undefined" && !!localStorage.getItem("token"),
  loading: false,
  error: null,
};

// Async Thunks
export const loginUser = createAsyncThunk(
  "auth/loginUser",
  async (credentials: LoginFormData, { rejectWithValue }) => {
    try {
      // Mock API'deki tüm kullanıcıları çek
      const response = await api.get("/users");
      const users = response.data as any[];

      // E-posta adresi eşleşen kullanıcıyı bul
      const user = users.find((u) => u.email === credentials.email);

      if (!user) {
        return rejectWithValue("Kullanıcı bulunamadı veya şifre hatalı");
      }

      // Mock Token ve Kullanıcı bilgilerini kaydet
      const mockToken = `mock-jwt-token-${user.id}`;
      localStorage.setItem("token", mockToken);
      localStorage.setItem("user", JSON.stringify(user));

      return user as User;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || "Giriş işlemi başarısız");
    }
  },
);

export const registerUser = createAsyncThunk(
  "auth/registerUser",
  async (userData: Omit<RegisterFormData, "confirmPassword" | "terms">, { rejectWithValue }) => {
    try {
      // Mock API'ye yeni kullanıcı ekleme (POST /users)
      const response = await api.post("/users", {
        name: userData.fullName,
        email: userData.email,
        // Mock DB olduğu için şifreyi de saklıyoruz
        password: userData.password,
      });

      const newUser = response.data;
      return newUser;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || "Kayıt işlemi başarısız");
    }
  },
);

export const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    logout: (state) => {
      state.user = null;
      state.isAuthenticated = false;
      localStorage.removeItem("token");
      localStorage.removeItem("user");
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Login Actions
      .addCase(loginUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action: PayloadAction<User>) => {
        state.loading = false;
        state.isAuthenticated = true;
        state.user = action.payload;
        state.error = null;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // Register Actions
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
        state.error = action.payload as string;
      });
  },
});

export const { logout, clearError } = authSlice.actions;
export default authSlice.reducer;
