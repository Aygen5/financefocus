import axiosClient from "./axiosClient";
import type { ApiResponse } from "./axiosClient";

export interface AIChatMessageDto {
  role: "user" | "assistant";
  content: string;
}

export interface AIChatResponseDto {
  answer: string;
  category: string;
  providerUsed: string;
  respondedAt: string;
}

export const aiAssistantApi = {
  chat: async (
    prompt: string,
    history?: AIChatMessageDto[],
  ): Promise<ApiResponse<AIChatResponseDto>> => {
    try {
      const res = await axiosClient.post<ApiResponse<AIChatResponseDto>>("/aiassistant/chat", {
        prompt,
        history,
      });
      return res.data;
    } catch (err: unknown) {
      const errorObj = err as {
        response?: { status?: number; data?: { message?: string } };
        message?: string;
      };
      if (errorObj.response?.status === 503) {
        throw new Error(
          errorObj.response.data?.message ||
            "Yerel AI servisine (Ollama) ulaşılamadı. Lütfen Ollama servisinin çalıştığından emin olun.",
        );
      }
      throw new Error(
        errorObj.response?.data?.message ||
          errorObj.message ||
          "Yapay zekâ yanıtı alınırken bir hata oluştu.",
      );
    }
  },

  streamChat: async (
    prompt: string,
    history: AIChatMessageDto[] | undefined,
    onChunk: (chunk: string) => void,
  ): Promise<void> => {
    const token = localStorage.getItem("token") || sessionStorage.getItem("token");
    const response = await fetch("http://localhost:5000/api/v1/aiassistant/chat-stream", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: token ? `Bearer ${token}` : "",
      },
      body: JSON.stringify({ prompt, history }),
    });

    if (response.status === 503) {
      throw new Error(
        "Yerel AI servisine (Ollama) ulaşılamadı. Lütfen http://localhost:11434 adresinde Ollama ve Qwen 2.5 modelinin çalıştığından emin olun.",
      );
    }

    if (!response.ok || !response.body) {
      throw new Error(`Yapay zekâ akış yanıtı alınamadı (HTTP ${response.status}).`);
    }

    const reader = response.body.getReader();
    const decoder = new TextDecoder();
    let buffer = "";

    while (true) {
      const { done, value } = await reader.read();
      if (done) {
        buffer += decoder.decode();
        break;
      }
      buffer += decoder.decode(value, { stream: true });
      const lines = buffer.split("\n");
      buffer = lines.pop() || "";
      for (const line of lines) {
        if (line.startsWith("data: ")) {
          const chunk = line.slice(6);
          if (chunk) onChunk(chunk);
        } else if (line.startsWith("event: error")) {
          const errLine = lines.find((l) => l.startsWith("data: "));
          if (errLine) throw new Error(errLine.slice(6));
        }
      }
    }
    if (buffer.startsWith("data: ")) {
      const chunk = buffer.slice(6);
      if (chunk) onChunk(chunk);
    }
  },
};

export default aiAssistantApi;
