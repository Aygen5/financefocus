import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import GoalsService from "@/services/modules/goals.service";

export interface FinancialGoal {
  id: string;
  userId: string;
  name: string;
  category: string;
  targetAmount: number;
  currentAmount: number;
  deadline: string;
  monthlyContribution: number;
  startDate?: string;
  priority?: "low" | "medium" | "high";
  status?: "active" | "completed" | "paused";
  notes?: string;
  color?: string;
  icon?: string;
}

export interface GoalsState {
  items: FinancialGoal[];
  loading: boolean;
  error: string | null;
}

const initialState: GoalsState = {
  items: [],
  loading: false,
  error: null,
};

export const fetchGoals = createAsyncThunk("goals/fetchGoals", async (_, { rejectWithValue }) => {
  try {
    return (await GoalsService.getAll()) as FinancialGoal[];
  } catch (error: unknown) {
    if (error instanceof Error) {
      return rejectWithValue(error.message);
    }
    return rejectWithValue("Hedefler yüklenemedi.");
  }
});

export const addGoal = createAsyncThunk(
  "goals/addGoal",
  async (data: Omit<FinancialGoal, "id" | "userId">, { rejectWithValue }) => {
    try {
      return (await GoalsService.create(data)) as FinancialGoal;
    } catch (error: unknown) {
      if (error instanceof Error) {
        return rejectWithValue(error.message);
      }
      return rejectWithValue("Hedef eklenemedi.");
    }
  },
);

export const updateGoal = createAsyncThunk(
  "goals/updateGoal",
  async ({ id, data }: { id: string; data: Partial<FinancialGoal> }, { rejectWithValue }) => {
    try {
      return (await GoalsService.update(id, data)) as FinancialGoal;
    } catch (error: unknown) {
      if (error instanceof Error) {
        return rejectWithValue(error.message);
      }
      return rejectWithValue("Hedef güncellenemedi.");
    }
  },
);

export const deleteGoal = createAsyncThunk(
  "goals/deleteGoal",
  async (id: string, { rejectWithValue }) => {
    try {
      await GoalsService.delete(id);
      return id;
    } catch (error: unknown) {
      if (error instanceof Error) {
        return rejectWithValue(error.message);
      }
      return rejectWithValue("Hedef silinemedi.");
    }
  },
);

export const goalsSlice = createSlice({
  name: "goals",
  initialState,
  reducers: {
    clearGoals: (state) => {
      state.items = [];
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchGoals.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchGoals.fulfilled, (state, action: PayloadAction<FinancialGoal[]>) => {
        state.loading = false;
        state.items = action.payload;
        state.error = null;
      })
      .addCase(fetchGoals.rejected, (state, action) => {
        state.loading = false;
        state.error = (action.payload as string) || action.error.message || "Hedefler yüklenemedi";
      })
      .addCase(addGoal.fulfilled, (state, action: PayloadAction<FinancialGoal>) => {
        state.items.unshift(action.payload);
      })
      .addCase(updateGoal.fulfilled, (state, action: PayloadAction<FinancialGoal>) => {
        const index = state.items.findIndex((item) => item.id === action.payload.id);
        if (index !== -1) {
          state.items[index] = action.payload;
        }
      })
      .addCase(deleteGoal.fulfilled, (state, action: PayloadAction<string>) => {
        state.items = state.items.filter((item) => item.id !== action.payload);
      });
  },
});

export const selectGoals = (state: { goals: GoalsState }) => state.goals.items;
export const selectGoalsLoading = (state: { goals: GoalsState }) => state.goals.loading;
export const selectGoalsError = (state: { goals: GoalsState }) => state.goals.error;

export const { clearGoals } = goalsSlice.actions;
export default goalsSlice.reducer;
