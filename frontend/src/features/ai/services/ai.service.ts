import aiAssistantApi from "@/api/aiAssistantApi";
import type { AIChatMessageDto } from "@/api/aiAssistantApi";

export const AIService = {
  getAIResponse: async (messageText: string, history?: AIChatMessageDto[]): Promise<string> => {
    const response = await aiAssistantApi.chat(messageText, history);
    if (response.success && response.data?.answer) {
      return response.data.answer;
    }
    return "Yapay zekâ yanıtı işlenirken bir sorun oluştu. Lütfen tekrar deneyiniz.";
  },
};

export default AIService;
