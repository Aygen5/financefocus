import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import AIService from "./services/ai.service";
import type { AIMessage } from "./types/ai.types";
import type { AIChatMessageDto } from "@/api/aiAssistantApi";
import { v4 as uuidv4 } from "uuid";

export interface AIState {
  messages: AIMessage[];
  loading: boolean;
  error: string | null;
  aiStatus: string;
}

const INITIAL_MESSAGES: AIMessage[] = [
  {
    id: "welcome-1",
    sender: "ai",
    text: "Merhaba! Ben FinanceFocus Yerel Yapay Zekâ Finansal Asistanıyım (Qwen 2.5). Gelir, gider, bütçe, hedef ve portföy verilerinizi doğrudan cihazınızda analiz ederek kişiselleştirilmiş tavsiyeler üretebilirim.",
    timestamp: new Date().toISOString(),
  },
];

const initialState: AIState = {
  messages: INITIAL_MESSAGES,
  loading: false,
  error: null,
  aiStatus: "ready",
};

export const getAIResponseThunk = createAsyncThunk(
  "ai/getAIResponse",
  async (
    { messageText, history }: { messageText: string; history?: AIChatMessageDto[] },
    { rejectWithValue },
  ) => {
    try {
      return await AIService.getAIResponse(messageText, history);
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
    addEmptyAIMessage: (state, action: PayloadAction<string>) => {
      const newAIMsg: AIMessage = {
        id: action.payload,
        sender: "ai",
        text: "",
        timestamp: new Date().toISOString(),
      };
      state.messages.push(newAIMsg);
    },
    appendAIChunk: (state, action: PayloadAction<{ id: string; chunk: string }>) => {
      const msg = state.messages.find((m) => m.id === action.payload.id);
      if (msg) {
        msg.text += action.payload.chunk;
      }
    },
    setAILoadingState: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
    clearChat: (state) => {
      state.messages = INITIAL_MESSAGES;
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
      });
  },
});

export const { addUserMessage, addEmptyAIMessage, appendAIChunk, setAILoadingState, clearChat } =
  aiSlice.actions;

export const selectAIMessages = (state: { ai: AIState }) => state.ai.messages;
export const selectAILoading = (state: { ai: AIState }) => state.ai.loading;
export const selectAIError = (state: { ai: AIState }) => state.ai.error;
export const selectAIStatus = (state: { ai: AIState }) => state.ai.aiStatus;

export default aiSlice.reducer;
