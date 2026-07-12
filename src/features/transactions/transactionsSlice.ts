import { createSlice, createSelector, createAsyncThunk } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import TransactionsService from "./services/transactions.service";
import type { Transaction, TransactionFilters } from "./types/transactions.types";
import {
  parseISO,
  isAfter,
  isBefore,
  isSameDay,
  subDays,
  startOfDay,
  endOfDay,
  startOfMonth,
  startOfYear,
} from "date-fns";

export interface TransactionsState {
  items: Transaction[];
  filters: TransactionFilters;
  loading: boolean;
  error: string | null;
}

const defaultFilters: TransactionFilters = {
  search: "",
  transactionType: "all",
  category: "all",
  dateRange: "all",
  customMinDate: "",
  customMaxDate: "",
  minAmount: undefined,
  maxAmount: undefined,
  status: "all",
};

const initialState: TransactionsState = {
  items: [],
  filters: defaultFilters,
  loading: false,
  error: null,
};

export const fetchTransactions = createAsyncThunk(
  "transactions/fetchTransactions",
  async (_, { rejectWithValue }) => {
    try {
      return await TransactionsService.getAll();
    } catch (error: unknown) {
      if (error instanceof Error) {
        return rejectWithValue(error.message);
      }
      return rejectWithValue("İşlemler yüklenemedi.");
    }
  },
);

export const addTransaction = createAsyncThunk(
  "transactions/addTransaction",
  async (data: Omit<Transaction, "id" | "userId">, { rejectWithValue }) => {
    try {
      return await TransactionsService.create(data);
    } catch (error: unknown) {
      if (error instanceof Error) {
        return rejectWithValue(error.message);
      }
      return rejectWithValue("İşlem eklenemedi.");
    }
  },
);

export const updateTransaction = createAsyncThunk(
  "transactions/updateTransaction",
  async ({ id, data }: { id: string; data: Partial<Transaction> }, { rejectWithValue }) => {
    try {
      return await TransactionsService.update(id, data);
    } catch (error: unknown) {
      if (error instanceof Error) {
        return rejectWithValue(error.message);
      }
      return rejectWithValue("İşlem güncellenemedi.");
    }
  },
);

export const deleteTransaction = createAsyncThunk(
  "transactions/deleteTransaction",
  async (id: string, { rejectWithValue }) => {
    try {
      await TransactionsService.delete(id);
      return id;
    } catch (error: unknown) {
      if (error instanceof Error) {
        return rejectWithValue(error.message);
      }
      return rejectWithValue("İşlem silinemedi.");
    }
  },
);

export const transactionsSlice = createSlice({
  name: "transactions",
  initialState,
  reducers: {
    clearTransactions: (state) => {
      state.items = [];
    },
    setFilters: (state, action: PayloadAction<Partial<TransactionFilters>>) => {
      state.filters = { ...state.filters, ...action.payload };
    },
    setSearch: (state, action: PayloadAction<string>) => {
      state.filters.search = action.payload;
    },
    resetFilters: (state) => {
      state.filters = { ...defaultFilters, search: state.filters.search };
    },
  },
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
        state.error = (action.payload as string) || action.error.message || "İşlemler yüklenemedi";
      })
      .addCase(addTransaction.fulfilled, (state, action: PayloadAction<Transaction>) => {
        state.items.unshift(action.payload);
      })
      .addCase(updateTransaction.fulfilled, (state, action: PayloadAction<Transaction>) => {
        const index = state.items.findIndex((item) => item.id === action.payload.id);
        if (index !== -1) {
          state.items[index] = action.payload;
        }
      })
      .addCase(deleteTransaction.fulfilled, (state, action: PayloadAction<string>) => {
        state.items = state.items.filter((item) => item.id !== action.payload);
      });
  },
});

export const selectTransactions = (state: { transactions: TransactionsState }) =>
  state.transactions.items;
export const selectFilters = (state: { transactions: TransactionsState }) =>
  state.transactions.filters;
export const selectTransactionsLoading = (state: { transactions: TransactionsState }) =>
  state.transactions.loading;
export const selectTransactionsError = (state: { transactions: TransactionsState }) =>
  state.transactions.error;

export const selectFilteredTransactions = createSelector(
  [selectTransactions, selectFilters],
  (items, filters) => {
    return items.filter((item) => {
      if (filters.search.trim()) {
        const query = filters.search.toLowerCase();
        const descMatch = item.description?.toLowerCase().includes(query);
        const catMatch = item.category?.toLowerCase().includes(query);
        const accMatch = item.account?.toLowerCase().includes(query);
        if (!descMatch && !catMatch && !accMatch) return false;
      }

      if (filters.transactionType !== "all" && item.transactionType !== filters.transactionType) {
        return false;
      }

      if (
        filters.category !== "all" &&
        item.category.toLowerCase() !== filters.category.toLowerCase()
      ) {
        return false;
      }

      if (filters.status !== "all" && item.status !== filters.status) {
        return false;
      }

      if (filters.minAmount !== undefined && item.amount < filters.minAmount) {
        return false;
      }
      if (filters.maxAmount !== undefined && item.amount > filters.maxAmount) {
        return false;
      }

      if (filters.dateRange !== "all") {
        const itemDate = parseISO(item.date);
        const today = new Date();

        switch (filters.dateRange) {
          case "today":
            if (!isSameDay(itemDate, today)) return false;
            break;
          case "last7days": {
            const startOf7Days = startOfDay(subDays(today, 7));
            if (isBefore(itemDate, startOf7Days)) return false;
            break;
          }
          case "thismonth": {
            const startOfCurrentMonth = startOfMonth(today);
            if (isBefore(itemDate, startOfCurrentMonth)) return false;
            break;
          }
          case "last3months": {
            const startOf3Months = startOfMonth(subDays(today, 90));
            if (isBefore(itemDate, startOf3Months)) return false;
            break;
          }
          case "thisyear": {
            const startOfCurrentYear = startOfYear(today);
            if (isBefore(itemDate, startOfCurrentYear)) return false;
            break;
          }
          case "custom": {
            if (filters.customMinDate) {
              const minDate = startOfDay(parseISO(filters.customMinDate));
              if (isBefore(itemDate, minDate)) return false;
            }
            if (filters.customMaxDate) {
              const maxDate = endOfDay(parseISO(filters.customMaxDate));
              if (isAfter(itemDate, maxDate)) return false;
            }
            break;
          }
        }
      }

      return true;
    });
  },
);

export const selectActiveFiltersCount = createSelector([selectFilters], (filters) => {
  let count = 0;
  if (filters.transactionType !== "all") count++;
  if (filters.category !== "all") count++;
  if (filters.status !== "all") count++;
  if (filters.dateRange !== "all") count++;
  if (filters.minAmount !== undefined) count++;
  if (filters.maxAmount !== undefined) count++;
  return count;
});

export const { clearTransactions, setFilters, setSearch, resetFilters } = transactionsSlice.actions;
export default transactionsSlice.reducer;
export type { Transaction };
