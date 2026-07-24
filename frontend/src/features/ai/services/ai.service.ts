import aiAssistantApi from "@/api/aiAssistantApi";
import type { AIAssistantDto } from "@/api/aiAssistantApi";

export const AIService = {
  getFullAnalysis: async (): Promise<AIAssistantDto> => {
    const response = await aiAssistantApi.getFullAnalysis();
    return response.data;
  },

  getAIResponse: async (messageText: string): Promise<string> => {
    const response = await aiAssistantApi.chat(messageText);
    if (response.success && response.data?.answer) {
      return response.data.answer;
    }
    return "Yapay zekâ yanıtı işlenirken bir sorun oluştu. Lütfen tekrar deneyiniz.";
  },
};

export default AIService;
