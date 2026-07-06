import { describe, it, expect } from "vitest";
import transactionsReducer, {
  setFilters,
  resetFilters,
  fetchTransactions,
  TransactionsState,
} from "../features/transactions/transactionsSlice";

describe("transactionsSlice Redux AsyncThunk Tests", () => {
  const initialState: TransactionsState = {
    items: [],
    filters: {
      search: "",
      transactionType: "all",
      category: "all",
      dateRange: "all",
      customMinDate: "",
      customMaxDate: "",
      minAmount: undefined,
      maxAmount: undefined,
      status: "all",
    },
    loading: false,
    error: null,
  };

  it("should handle setFilters", () => {
    const nextState = transactionsReducer(initialState, setFilters({ search: "Deneme" }));
    expect(nextState.filters.search).toBe("Deneme");
  });

  it("should handle resetFilters", () => {
    const modifiedState = {
      ...initialState,
      filters: { ...initialState.filters, search: "Deneme", category: "Gıda" },
    };
    const nextState = transactionsReducer(modifiedState, resetFilters());
    expect(nextState.filters.search).toBe("Deneme");
    expect(nextState.filters.category).toBe("all");
  });

  it("should update loading state during fetchTransactions.pending", () => {
    const nextState = transactionsReducer(initialState, fetchTransactions.pending("", undefined));
    expect(nextState.loading).toBe(true);
    expect(nextState.error).toBeNull();
  });

  it("should update items and loading state during fetchTransactions.fulfilled", () => {
    const mockPayload = [
      {
        id: "1",
        userId: "1",
        title: "Deneme Gelir",
        amount: 5000,
        transactionType: "income" as const,
        date: "2026-07-06",
        category: "Maaş",
        account: "Mevduat",
        status: "completed" as const,
        createdAt: "2026-07-06T10:00:00Z",
        updatedAt: "2026-07-06T10:00:00Z",
      },
    ];
    const nextState = transactionsReducer(
      initialState,
      fetchTransactions.fulfilled(mockPayload, "", undefined),
    );
    expect(nextState.loading).toBe(false);
    expect(nextState.items).toEqual(mockPayload);
  });

  it("should set error state during fetchTransactions.rejected", () => {
    const nextState = transactionsReducer(
      initialState,
      fetchTransactions.rejected(new Error("Yükleme Hatası"), "", undefined, "Yükleme Hatası"),
    );
    expect(nextState.loading).toBe(false);
    expect(nextState.error).toBe("Yükleme Hatası");
  });
});
