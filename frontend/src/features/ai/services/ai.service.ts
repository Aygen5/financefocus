// import api from "@/services/api";

export const AIService = {
  /**
   * AI asistanından yanıt alır.
   * Bu metot ileride api.post("/ai/chat") çağrısına kolayca dönüştürülebilir.
   */
  getAIResponse: async (messageText: string): Promise<string> => {
    // Gerçek backend API entegrasyonu için gelecekte aşağıdaki satırlar aktif edilebilir:
    // const response = await api.post<{ response: string }>("/ai/chat", { message: messageText });
    // return response.data.response;

    // Şimdilik 1-2 saniye gecikmeli mock yanıt döner (gerçek AI hissi için):
    await new Promise((resolve) => setTimeout(resolve, 1500));

    const query = messageText.toLowerCase().trim();

    if (query.includes("harcadım") || query.includes("analiz et")) {
      return "Bu ay en yüksek harcamanız market alışverişlerinde gerçekleşti. Market harcamalarınız geçen aya göre %18 artarak ₺4.820 seviyesine ulaştı. Dışarıda yemek yeme harcamalarınız da bütçenizi zorluyor.";
    }

    if (query.includes("bütçe") || query.includes("iyileştir")) {
      return "Bu ay toplam bütçenizin %72'sini kullandınız. Fatura ve Eğlence kategorilerindeki harcamaları azaltarak bütçe disiplininizi %15 oranında iyileştirebilirsiniz. Özellikle abonelikleri gözden geçirmelisiniz.";
    }

    if (query.includes("tasarruf") || query.includes("öner")) {
      return "Kullanmadığınız 2 adet aktif SaaS aboneliğini iptal ederek doğrudan ayda ₺450 tasarruf edebilirsiniz. Ayrıca, market harcamalarınızda haftalık planlama yaparak aylık ₺1.200 ek tasarruf potansiyeli oluşturabilirsiniz.";
    }

    if (
      query.includes("gelecek") ||
      query.includes("bekleniyor") ||
      query.includes("önümüzdeki ay")
    ) {
      return "Geçmiş harcama eğilimlerinize göre, önümüzdeki ay fatura ödemelerinizde mevsimsel artış bekleniyor. Düzenli ödemeleriniz düşüldükten sonra tahmini tasarruf oranınızın %20 civarında kalacağını tahmin ediyorum.";
    }

    if (query.includes("sağlık") || query.includes("sağlığımı analiz et")) {
      return "Finansal sağlık skorunuz 84/100 ile 'İyi' seviyesinde. Tasarruf oranınız (Gelirinizin %23'ü) mükemmel düzeyde ancak bütçe disiplini kategorisinde market harcamalarındaki aşım nedeniyle puan kaybediyorsunuz.";
    }

    // Varsayılan mock yanıtlar:
    const randomResponses = [
      "Elektrik faturanızda son üç ayda düzenli bir yükseliş trendi görülüyor. Cihazların bekleme modlarını kontrol etmenizi öneririm.",
      "Gelirinizin %23'ünü tasarrufa ayırmış görünüyorsunuz, bu oran kişisel finans standartlarına göre oldukça sağlıklı.",
      "Aktif 3 adet aboneliğiniz bulunuyor. Kullanım sıklığınıza göre bunları konsolide etmek tasarruf potansiyelinizi artırabilir.",
      "Bütçe limitlerinizi aşmamak için harcamalarınızı günlük ₺200 sınırında tutmanız faydalı olacaktır.",
      "Varlık portföyünüzün %42'si hisse senetlerinde, %30'u dövizde bulunuyor. Dengeli bir dağılım sergiliyorsunuz.",
    ];

    const randomIndex = Math.floor(Math.random() * randomResponses.length);
    return randomResponses[randomIndex];
  },
};

export default AIService;
