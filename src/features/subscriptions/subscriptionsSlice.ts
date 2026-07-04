/* eslint-disable @typescript-eslint/no-explicit-any */
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import api from "@/services/api";

export interface Subscription {
  id: string;
  userId: string;
  name: string;
  cost: number;
  billingCycle: string;
  nextBillingDate: string;
  category: string;
  billingType?: string;
}

interface SubscriptionsState {
  items: Subscription[];
  loading: boolean;
  error: string | null;
}

const initialState: SubscriptionsState = {
  items: [],
  loading: false,
  error: null,
};

// Async Thunks
export const fetchSubscriptions = createAsyncThunk(
  "subscriptions/fetchSubscriptions",
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get("/subscriptions");
      return response.data as Subscription[];
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || "Abonelikler yüklenemedi");
    }
  },
);

export const addSubscription = createAsyncThunk(
  "subscriptions/addSubscription",
  async (data: Omit<Subscription, "id" | "userId">, { rejectWithValue }) => {
    try {
      const response = await api.post("/subscriptions", {
        ...data,
        userId: "1",
      });
      return response.data as Subscription;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || "Abonelik eklenemedi");
    }
  },
);

export const subscriptionsSlice = createSlice({
  name: "subscriptions",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchSubscriptions.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchSubscriptions.fulfilled, (state, action: PayloadAction<Subscription[]>) => {
        state.loading = false;
        state.items = action.payload;
        state.error = null;
      })
      .addCase(fetchSubscriptions.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(addSubscription.fulfilled, (state, action: PayloadAction<Subscription>) => {
        state.items.push(action.payload);
      });
  },
});

export default subscriptionsSlice.reducer;
