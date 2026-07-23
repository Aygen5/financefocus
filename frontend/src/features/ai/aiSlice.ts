import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import AIService from "./services/ai.service";
import type { AIMessage } from "./types/ai.types";
import type { AIAssistantDto } from "@/api/aiAssistantApi";
import { v4 as uuidv4 } from "uuid";

export interface AIState {
  analysisData: AIAssistantDto | null;
  messages: AIMessage[];
  loading: boolean;
  error: string | null;
  aiStatus: string;
}

const INITIAL_MESSAGES: AIMessage[] = [
  {
    id: "welcome-1",
    sender: "ai",
    text: "Merhaba! Ben FinanceFocus Yapay Zekâ Finansal Asistanıyım. Gelir, gider, bütçe, hedef ve portföy verilerinizi analiz ederek kişiselleştirilmiş tavsiyeler üretebilirim.",
    timestamp: new Date().toISOString(),
  },
];

const initialState: AIState = {
  analysisData: null,
  messages: INITIAL_MESSAGES,
  loading: false,
  error: null,
  aiStatus: "ready",
};

export const fetchAIAnalysis = createAsyncThunk(
  "ai/fetchAIAnalysis",
  async (_, { rejectWithValue }) => {
    try {
      return await AIService.getFullAnalysis();
    } catch (err: unknown) {
      const errorObj = err as { message?: string };
      return rejectWithValue(errorObj.message || "AI Analiz verisi alınamadı.");
    }
  },
);

export const getAIResponseThunk = createAsyncThunk(
  "ai/getAIResponse",
  async (messageText: string, { rejectWithValue }) => {
    try {
      return await AIService.getAIResponse(messageText);
    } catch (error: unknown) {
      if (error instanceof Error) {
        return rejectWithValue(error.message);
      }
      return rejectWithValue("Yapay zekâ yanıtı alınamadı.");
    }
  },
);

export const aiSlice = createSlice({
  name: "ai",
  initialState,
  reducers: {
    addUserMessage: (state, action: PayloadAction<string>) => {
      const newUserMsg: AIMessage = {
        id: uuidv4(),
        sender: "user",
        text: action.payload,
        timestamp: new Date().toISOString(),
      };
      state.messages.push(newUserMsg);
    },
    clearChat: (state) => {
      state.messages = INITIAL_MESSAGES;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchAIAnalysis.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAIAnalysis.fulfilled, (state, action: PayloadAction<AIAssistantDto>) => {
        state.loading = false;
        state.analysisData = action.payload;
        state.error = null;
      })
      .addCase(fetchAIAnalysis.rejected, (state, action) => {
        state.loading = false;
        state.error = (action.payload as string) || "Analiz alınamadı.";
      })
      .addCase(getAIResponseThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getAIResponseThunk.fulfilled, (state, action: PayloadAction<string>) => {
        state.loading = false;
        const newAIMsg: AIMessage = {
          id: uuidv4(),
          sender: "ai",
          text: action.payload,
          timestamp: new Date().toISOString(),
        };
        state.messages.push(newAIMsg);
      })
      .addCase(getAIResponseThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = (action.payload as string) || "Yapay zekâ yanıtı alınamadı.";
      });
  },
});

export const { addUserMessage, clearChat } = aiSlice.actions;

export const selectAIAnalysisData = (state: { ai: AIState }) => state.ai.analysisData;
export const selectAIMessages = (state: { ai: AIState }) => state.ai.messages;
export const selectAILoading = (state: { ai: AIState }) => state.ai.loading;
export const selectAIError = (state: { ai: AIState }) => state.ai.error;
export const selectAIStatus = (state: { ai: AIState }) => state.ai.aiStatus;
export const selectAnalyzedTransactionsCount = (state: { ai: AIState }) =>
  state.ai.analysisData?.advices?.length || 5;
export const selectSavingsPotential = (state: { ai: AIState }) =>
  state.ai.analysisData?.summary?.financialHealthScore || 85;
export const selectFinancialScore = (state: { ai: AIState }) =>
  state.ai.analysisData?.summary?.financialHealthScore || 85;
export const selectAIInsights = (state: { ai: AIState }) =>
  state.ai.analysisData?.advices?.map((a) => a.message) || [];

export default aiSlice.reducer;
