import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import SubscriptionsService from "@/services/modules/subscriptions.service";

export interface Subscription {
  id: string;
  userId?: string;
  name: string;
  cost: number;
  billingCycle: "monthly" | "yearly";
  nextBillingDate: string;
  category: string;
  billingType?: string;
  autoRenew?: boolean;
  startDate?: string;
  color?: string;
  icon?: string;
  notes?: string;
  status?: "active" | "paused" | "cancelled";
}

export interface SubscriptionsState {
  items: Subscription[];
  loading: boolean;
  error: string | null;
}

const initialState: SubscriptionsState = {
  items: [],
  loading: false,
  error: null,
};

export const fetchSubscriptions = createAsyncThunk(
  "subscriptions/fetchSubscriptions",
  async (_, { rejectWithValue }) => {
    try {
      return (await SubscriptionsService.getAll()) as Subscription[];
    } catch (error: unknown) {
      if (error instanceof Error) {
        return rejectWithValue(error.message);
      }
      return rejectWithValue("Abonelikler yüklenemedi.");
    }
  },
);

export const addSubscription = createAsyncThunk(
  "subscriptions/addSubscription",
  async (data: Omit<Subscription, "id" | "userId">, { rejectWithValue }) => {
    try {
      return (await SubscriptionsService.create(data)) as Subscription;
    } catch (error: unknown) {
      if (error instanceof Error) {
        return rejectWithValue(error.message);
      }
      return rejectWithValue("Abonelik eklenemedi.");
    }
  },
);

export const updateSubscription = createAsyncThunk(
  "subscriptions/updateSubscription",
  async ({ id, data }: { id: string; data: Partial<Subscription> }, { rejectWithValue }) => {
    try {
      return (await SubscriptionsService.update(id, data)) as Subscription;
    } catch (error: unknown) {
      if (error instanceof Error) {
        return rejectWithValue(error.message);
      }
      return rejectWithValue("Abonelik güncellenemedi.");
    }
  },
);

export const deleteSubscription = createAsyncThunk(
  "subscriptions/deleteSubscription",
  async (id: string, { rejectWithValue }) => {
    try {
      await SubscriptionsService.delete(id);
      return id;
    } catch (error: unknown) {
      if (error instanceof Error) {
        return rejectWithValue(error.message);
      }
      return rejectWithValue("Abonelik silinemedi.");
    }
  },
);

export const subscriptionsSlice = createSlice({
  name: "subscriptions",
  initialState,
  reducers: {
    clearSubscriptions: (state) => {
      state.items = [];
    },
  },
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
        state.error =
          (action.payload as string) || action.error.message || "Abonelikler yüklenemedi";
      })
      .addCase(addSubscription.fulfilled, (state, action: PayloadAction<Subscription>) => {
        state.items.unshift(action.payload);
      })
      .addCase(updateSubscription.fulfilled, (state, action: PayloadAction<Subscription>) => {
        const index = state.items.findIndex((item) => item.id === action.payload.id);
        if (index !== -1) {
          state.items[index] = action.payload;
        }
      })
      .addCase(deleteSubscription.fulfilled, (state, action: PayloadAction<string>) => {
        state.items = state.items.filter((item) => item.id !== action.payload);
      });
  },
});

export const selectSubscriptions = (state: { subscriptions: SubscriptionsState }) =>
  state.subscriptions.items;
export const selectSubscriptionsLoading = (state: { subscriptions: SubscriptionsState }) =>
  state.subscriptions.loading;
export const selectSubscriptionsError = (state: { subscriptions: SubscriptionsState }) =>
  state.subscriptions.error;

export const { clearSubscriptions } = subscriptionsSlice.actions;
export default subscriptionsSlice.reducer;
