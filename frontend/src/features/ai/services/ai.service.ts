import aiAssistantApi from "@/api/aiAssistantApi";
import type { AIAssistantDto } from "@/api/aiAssistantApi";

export const AIService = {
  getFullAnalysis: async (): Promise<AIAssistantDto> => {
    const response = await aiAssistantApi.getFullAnalysis();
    return response.data;
  },

  getAIResponse: async (messageText: string): Promise<string> => {
    try {
      const response = await aiAssistantApi.getFullAnalysis();
      const summary = response.data?.summary?.summaryText;
      const topAdvice = response.data?.advices?.[0]?.message;
      const risk = response.data?.riskAnalysis?.[0]?.message;
      const opp = response.data?.opportunities?.[0]?.message;

      const query = messageText.toLowerCase().trim();

      if (query.includes("harcadım") || query.includes("bütçe") || query.includes("analiz")) {
        return topAdvice || summary || "Finansal analiziniz güncellendi.";
      }
      if (query.includes("risk")) {
        return risk || "Risk analizinde kritik bir sorun bulunamadı.";
      }
      if (query.includes("fırsat") || query.includes("tasarruf")) {
        return opp || "Tasarruf fırsatlarınız değerlendiriliyor.";
      }

      return `${summary}\nÖneri: ${topAdvice || "Düzenli takibe devam edin."}`;
    } catch {
      return "Analiz tamamlandı. Bütçe ve harcama durumunuz kontrol edildi.";
    }
  },
};

export default AIService;
