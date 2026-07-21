import React, { useState, useRef, useEffect } from "react";
import { useAppDispatch, useAppSelector } from "@/store";
import {
  addUserMessage,
  getAIResponseThunk,
  clearChat,
  selectAIMessages,
  selectAILoading,
  selectAIStatus,
  selectAnalyzedTransactionsCount,
  selectSavingsPotential,
  selectFinancialScore,
  selectAIInsights,
} from "../aiSlice";
import {
  Bot,
  Send,
  Trash2,
  Sparkles,
  Lightbulb,
  CheckCircle2,
  BrainCircuit,
  MessageSquare,
  HelpCircle,
} from "lucide-react";
import StatCard from "@/components/ui/StatCard";
import Button from "@/components/ui/Button";
import Card from "@/components/ui/Card";
import { formatCurrency } from "@/utils/financial";
import toast from "react-hot-toast";

const SUGGESTION_CARDS = [
  { text: "Bu ay nerede fazla harcadım?", label: "Harcama Analizi" },
  { text: "Bütçemi nasıl iyileştirebilirim?", label: "Bütçe İyileştirme" },
  { text: "Tasarruf önerisi oluştur.", label: "Tasarruf Önerisi" },
  { text: "Önümüzdeki ay ne bekleniyor?", label: "Gelecek Tahmini" },
  { text: "Finansal sağlığımı analiz et.", label: "Finansal Sağlık" },
];

export const AIAssistantContainer: React.FC = () => {
  const dispatch = useAppDispatch();
  const messages = useAppSelector(selectAIMessages);
  const loading = useAppSelector(selectAILoading);
  const aiStatus = useAppSelector(selectAIStatus);
  const analyzedCount = useAppSelector(selectAnalyzedTransactionsCount);
  const savingsPotential = useAppSelector(selectSavingsPotential);
  const financialScore = useAppSelector(selectFinancialScore);
  const insights = useAppSelector(selectAIInsights);

  const statusColorClass =
    loading || aiStatus === "analyzing"
      ? "text-blue-650 dark:text-blue-400"
      : "text-emerald-600 dark:text-emerald-450";
  const dotColorClass =
    loading || aiStatus === "analyzing"
      ? "bg-blue-500 animate-pulse"
      : "bg-emerald-500 animate-pulse";
  const statusText = loading ? "Analiz Ediliyor" : "Hazır";

  const [inputValue, setInputValue] = useState("");
  const chatEndRef = useRef<HTMLDivElement>(null);

  // Otomatik aşağı kaydırma (Auto Scroll)
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  const handleSendMessage = async (text: string) => {
    if (!text.trim() || loading) return;

    // 1. Kullanıcı mesajını yerel state'e ekle
    dispatch(addUserMessage(text));
    setInputValue("");

    try {
      // 2. AI yanıtı için thunk çağır
      await dispatch(getAIResponseThunk(text)).unwrap();
    } catch (err: unknown) {
      const errorMsg = err instanceof Error ? err.message : "Yapay zekâ yanıtı alınamadı.";
      toast.error(errorMsg);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage(inputValue);
    }
  };

  const handleClearChat = () => {
    dispatch(clearChat());
    toast.success("Sohbet geçmişi temizlendi.");
  };

  return (
    <div className="space-y-stack-lg max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      {/* Üst Başlık Alanı */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 border-b border-slate-100 dark:border-slate-800 pb-5">
        <div>
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-primary-container text-white shrink-0">
              <Bot size={24} />
            </div>
            <h1 className="text-2xl font-bold text-slate-800 dark:text-white tracking-tight">
              AI Finansal Asistan
            </h1>
          </div>
          <p className="mt-1.5 text-sm text-slate-500 dark:text-slate-400">
            Kişisel finans verilerinizi analiz ederek öneriler sunan yapay zekâ destekli finans
            asistanı.
          </p>
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={handleClearChat}
          className="flex items-center gap-2 text-red-550 border-red-200 hover:bg-red-50 dark:hover:bg-red-950/20 self-start md:self-auto"
        >
          <Trash2 size={16} />
          Sohbeti Temizle
        </Button>
      </div>

      {/* Özet Bilgi Kartları */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-gutter">
        <StatCard
          title="AI Durumu"
          value={
            <div className={`flex items-center gap-2 text-lg font-bold ${statusColorClass} mt-1`}>
              <span className={`h-2.5 w-2.5 rounded-full ${dotColorClass}`} />
              <span>{statusText}</span>
            </div>
          }
          icon={<CheckCircle2 size={18} className="text-emerald-500" />}
        />

        <StatCard
          title="Analiz Edilen İşlem"
          value={analyzedCount.toLocaleString("tr-TR")}
          icon={<BrainCircuit size={18} className="text-blue-500" />}
        />

        <StatCard
          title="Bu Ay Tasarruf Potansiyeli"
          value={formatCurrency(savingsPotential, "TRY", "tr-TR")}
          icon={<Sparkles size={18} className="text-brand-500" />}
        />

        <StatCard
          title="Finansal Skor"
          value={`${financialScore} / 100`}
          icon={<HelpCircle size={18} className="text-amber-500" />}
        />
      </div>

      {/* AI Insights Alanı */}
      <Card className="border-l-4 border-l-primary dark:border-l-brand-500 bg-slate-50/50 dark:bg-slate-900/50">
        <div className="p-5">
          <div className="flex items-center gap-2 mb-3">
            <Lightbulb className="text-primary dark:text-brand-400 shrink-0" size={20} />
            <h3 className="text-sm font-bold text-slate-800 dark:text-white uppercase tracking-wider">
              Yapay Zekâ İçgörüleri (AI Insights)
            </h3>
          </div>
          <ul className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-2.5">
            {insights.map((insight, idx) => (
              <li
                key={idx}
                className="flex items-start gap-2 text-sm text-slate-650 dark:text-slate-350"
              >
                <span className="text-primary dark:text-brand-400 font-bold select-none mt-0.5">
                  •
                </span>
                <span>{insight}</span>
              </li>
            ))}
          </ul>
        </div>
      </Card>

      {/* Chat Sohbet Alanı */}
      <Card className="flex flex-col h-[500px] border border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900/40">
        {/* Mesaj Listesi */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4">
          {messages.map((msg) => {
            const isUser = msg.sender === "user";
            return (
              <div
                key={msg.id}
                className={`flex gap-3 max-w-[85%] sm:max-w-[75%] ${
                  isUser ? "ml-auto flex-row-reverse text-right" : "mr-auto text-left"
                }`}
              >
                {/* Profil İkonu */}
                <div
                  className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 shadow-sm ${
                    isUser
                      ? "bg-primary text-white"
                      : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-350"
                  }`}
                >
                  {isUser ? <MessageSquare size={16} /> : <Bot size={16} />}
                </div>

                {/* Mesaj Metni */}
                <div className="space-y-1">
                  <div
                    className={`p-3 rounded-2xl text-sm leading-relaxed ${
                      isUser
                        ? "bg-primary text-white rounded-tr-none text-left"
                        : "bg-slate-50 dark:bg-slate-800/80 text-slate-800 dark:text-slate-100 rounded-tl-none border border-slate-100/50 dark:border-slate-700/50"
                    }`}
                  >
                    {msg.text}
                  </div>
                  <span className="text-[10px] text-slate-400 dark:text-slate-500 px-1 block select-none">
                    {new Date(msg.timestamp).toLocaleTimeString("tr-TR", {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </span>
                </div>
              </div>
            );
          })}

          {/* Yapay Zekâ Yazıyor Göstergesi (Typing Indicator) */}
          {loading && (
            <div className="flex gap-3 max-w-[75%] mr-auto text-left">
              <div className="w-8 h-8 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-350 flex items-center justify-center shrink-0">
                <Bot size={16} />
              </div>
              <div className="space-y-1">
                <div className="bg-slate-50 dark:bg-slate-800/85 text-slate-800 dark:text-slate-100 p-3 rounded-2xl rounded-tl-none border border-slate-100/50 dark:border-slate-700/50 flex items-center gap-1.5 h-10 px-4">
                  <span
                    className="h-2 w-2 bg-slate-400 dark:bg-slate-500 rounded-full animate-bounce"
                    style={{ animationDelay: "0ms" }}
                  />
                  <span
                    className="h-2 w-2 bg-slate-400 dark:bg-slate-500 rounded-full animate-bounce"
                    style={{ animationDelay: "150ms" }}
                  />
                  <span
                    className="h-2 w-2 bg-slate-400 dark:bg-slate-500 rounded-full animate-bounce"
                    style={{ animationDelay: "300ms" }}
                  />
                </div>
              </div>
            </div>
          )}
          <div ref={chatEndRef} />
        </div>

        {/* Mesaj Gönderme Kutusu */}
        <div className="border-t border-slate-100 dark:border-slate-800 p-4 bg-slate-50/50 dark:bg-slate-900/20">
          <div className="flex gap-2 items-end">
            <textarea
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={handleKeyPress}
              placeholder="Yapay zekâ asistanına bir soru yazın... (Örn: Tasarruf önerisi oluştur)"
              className="flex-1 min-h-[44px] max-h-[120px] p-2.5 text-sm bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-850 rounded-xl focus:outline-none focus:ring-1 focus:ring-primary dark:focus:ring-brand-500 focus:border-primary dark:focus:border-brand-500 resize-none dark:text-white"
              rows={1}
            />
            <Button
              onClick={() => handleSendMessage(inputValue)}
              disabled={loading || !inputValue.trim()}
              className="h-11 px-4 flex items-center justify-center gap-2 rounded-xl bg-primary hover:bg-primary-hover text-white transition-all disabled:opacity-50"
            >
              <Send size={16} />
              <span className="hidden sm:inline">Gönder</span>
            </Button>
          </div>
        </div>
      </Card>

      {/* Hazır Öneri Kartları */}
      <div className="space-y-2">
        <h4 className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider pl-1 select-none">
          Önerilen Sorular
        </h4>
        <div className="flex flex-wrap gap-2">
          {SUGGESTION_CARDS.map((card, idx) => (
            <button
              key={idx}
              onClick={() => handleSendMessage(card.text)}
              disabled={loading}
              className="text-xs font-semibold px-3 py-2 bg-slate-50 hover:bg-slate-100 dark:bg-slate-800/60 dark:hover:bg-slate-850 text-slate-600 dark:text-slate-300 rounded-lg border border-slate-200/40 dark:border-slate-750 transition-all select-none hover:scale-[1.01] active:scale-[0.99] disabled:opacity-50 disabled:pointer-events-none"
            >
              {card.text}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AIAssistantContainer;
