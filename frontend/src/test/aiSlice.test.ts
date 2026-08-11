import { describe, it, expect } from "vitest";
import aiReducer, {
  addUserMessage,
  addEmptyAIMessage,
  appendAIChunk,
  clearChat,
} from "../features/ai/aiSlice";

describe("aiSlice", () => {
  const initialState = aiReducer(undefined, { type: "UNKNOWN" });

  it("should initialize with default welcome message", () => {
    expect(initialState.messages.length).toBe(1);
    expect(initialState.messages[0].id).toBe("welcome-1");
  });

  it("should add a user message", () => {
    const state = aiReducer(initialState, addUserMessage("Bütçemi nasıl iyileştirebilirim?"));
    expect(state.messages.length).toBe(2);
    expect(state.messages[1].sender).toBe("user");
    expect(state.messages[1].text).toBe("Bütçemi nasıl iyileştirebilirim?");
  });

  it("should add an empty AI message and append stream chunks", () => {
    const state1 = aiReducer(initialState, addEmptyAIMessage("ai-msg-1"));
    expect(state1.messages.length).toBe(2);
    expect(state1.messages[1].id).toBe("ai-msg-1");
    expect(state1.messages[1].text).toBe("");

    const state2 = aiReducer(
      state1,
      appendAIChunk({ id: "ai-msg-1", chunk: "Tasarruf oranınız " }),
    );
    const state3 = aiReducer(
      state2,
      appendAIChunk({ id: "ai-msg-1", chunk: "%20 seviyesindedir." }),
    );

    expect(state3.messages[1].text).toBe("Tasarruf oranınız %20 seviyesindedir.");
  });

  it("should clear chat on clearChat action (used during Demo Mode exit & logout)", () => {
    const stateWithMessages = aiReducer(
      initialState,
      addUserMessage("Demo modunda yazılan geçici mesaj"),
    );
    expect(stateWithMessages.messages.length).toBe(2);

    const clearedState = aiReducer(stateWithMessages, clearChat());
    expect(clearedState.messages.length).toBe(1);
    expect(clearedState.messages[0].id).toBe("welcome-1");
  });
});
