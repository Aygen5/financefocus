/* eslint-disable @typescript-eslint/no-explicit-any */
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import api from "@/services/api";

export interface Transaction {
  id: string;
  userId: string;
  amount: number;
  type: "income" | "expense";
  category: string;
  date: string;
  description: string;
}

interface TransactionsState {
  items: Transaction[];
  loading: boolean;
  error: string | null;
}

const initialState: TransactionsState = {
  items: [],
  loading: false,
  error: null,
};

// Async Thunks
export const fetchTransactions = createAsyncThunk(
  "transactions/fetchTransactions",
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get("/transactions");
      return response.data as Transaction[];
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || "İşlemler yüklenemedi");
    }
  },
);

export const addTransaction = createAsyncThunk(
  "transactions/addTransaction",
  async (data: Omit<Transaction, "id" | "userId">, { rejectWithValue }) => {
    try {
      const response = await api.post("/transactions", {
        ...data,
        userId: "1",
      });
      return response.data as Transaction;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || "İşlem eklenemedi");
    }
  },
);

export const transactionsSlice = createSlice({
  name: "transactions",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchTransactions.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchTransactions.fulfilled, (state, action: PayloadAction<Transaction[]>) => {
        state.loading = false;
        state.items = action.payload;
        state.error = null;
      })
      .addCase(fetchTransactions.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(addTransaction.fulfilled, (state, action: PayloadAction<Transaction>) => {
        state.items.unshift(action.payload);
      });
  },
});

export default transactionsSlice.reducer;
