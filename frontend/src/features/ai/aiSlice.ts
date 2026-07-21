import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import AIService from "./services/ai.service";
import type { AIState, AIMessage } from "./types/ai.types";
import { v4 as uuidv4 } from "uuid";

const MOCK_INITIAL_MESSAGES: AIMessage[] = [
  {
    id: "welcome-1",
    sender: "ai",
    text: "Merhaba! Ben FinanceFocus Yapay Zekâ Finansal Asistanıyım. Harcamalarınızı, bütçe limitlerinizi veya portföy dağılımınızı analiz edip size tasarruf önerileri sunabilirim. Aşağıdaki hazır önerilere tıklayabilir veya bana doğrudan soru sorabilirsiniz.",
    timestamp: new Date().toISOString(),
  },
];

const initialState: AIState = {
  messages: MOCK_INITIAL_MESSAGES,
  loading: false,
  error: null,
  aiStatus: "ready",
  analyzedTransactionsCount: 248,
  savingsPotential: 3250,
  financialScore: 84,
  insights: [
    "Market harcamaların geçen aya göre %18 arttı.",
    "Bu ay bütçenin %72'sini kullandın.",
    "3 aktif aboneliğin bulunuyor.",
    "Birikim hedefinin %64'üne ulaştın.",
  ],
};

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
      state.messages = MOCK_INITIAL_MESSAGES;
    },
  },
  extraReducers: (builder) => {
    builder
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
        const newAIMsg: AIMessage = {
          id: uuidv4(),
          sender: "ai",
          text: "Üzgünüm, şu anda yanıt üretemiyorum. Lütfen daha sonra tekrar deneyiniz.",
          timestamp: new Date().toISOString(),
        };
        state.messages.push(newAIMsg);
      });
  },
});

export const { addUserMessage, clearChat } = aiSlice.actions;

export const selectAIMessages = (state: { ai: AIState }) => state.ai.messages;
export const selectAILoading = (state: { ai: AIState }) => state.ai.loading;
export const selectAIError = (state: { ai: AIState }) => state.ai.error;
export const selectAIStatus = (state: { ai: AIState }) => state.ai.aiStatus;
export const selectAnalyzedTransactionsCount = (state: { ai: AIState }) =>
  state.ai.analyzedTransactionsCount;
export const selectSavingsPotential = (state: { ai: AIState }) => state.ai.savingsPotential;
export const selectFinancialScore = (state: { ai: AIState }) => state.ai.financialScore;
export const selectAIInsights = (state: { ai: AIState }) => state.ai.insights;

export default aiSlice.reducer;
