import React, { useState } from "react";
import Modal from "@/components/ui/Modal";
import { BookOpen, HelpCircle, Keyboard, Headphones, ExternalLink } from "lucide-react";

export interface HelpModalProps {
  isOpen: boolean;
  onClose: () => void;
}

type TabType = "guide" | "faq" | "shortcuts" | "support";

export const HelpModal: React.FC<HelpModalProps> = ({ isOpen, onClose }) => {
  const [activeTab, setActiveTab] = useState<TabType>("guide");

  const tabs = [
    { id: "guide" as TabType, label: "Kullanım Rehberi", icon: <BookOpen size={16} /> },
    { id: "faq" as TabType, label: "Sıkça Sorulan Sorular", icon: <HelpCircle size={16} /> },
    { id: "shortcuts" as TabType, label: "Klavye Kısayolları", icon: <Keyboard size={16} /> },
    { id: "support" as TabType, label: "Destek Bilgileri", icon: <Headphones size={16} /> },
  ];

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="FinanceFocus Yardım Merkezi" size="lg">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 min-h-[380px] text-left select-none">
        {/* Left tabs menu */}
        <div className="md:col-span-1 border-r border-slate-100 dark:border-slate-800 pr-4 space-y-2 flex flex-col">
          {tabs.map((tab) => {
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`w-full py-2.5 px-3 rounded-lg text-xs font-bold transition-all flex items-center gap-2.5 cursor-pointer ${
                  isActive
                    ? "bg-primary/10 text-primary dark:bg-brand-500/10 dark:text-brand-400 font-extrabold"
                    : "text-slate-500 hover:bg-slate-50 dark:hover:bg-slate-850 hover:text-slate-750 dark:hover:text-slate-300"
                }`}
              >
                {tab.icon}
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Right tab content pane */}
        <div className="md:col-span-3 overflow-y-auto max-h-[380px] pr-2">
          {activeTab === "guide" && (
            <div className="space-y-4">
              <h3 className="font-headline-sm text-base text-slate-800 dark:text-white font-bold leading-tight flex items-center gap-2">
                🚀 FinanceFocus Başlangıç Rehberi
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed font-semibold">
                FinanceFocus, 2026–2027 finansal hedeflerinizi yönetmek, bütçelerinizi planlamak ve
                portföy yatırımlarınızı takip etmek için geliştirilmiş bir kişisel finans yönetim
                uygulamasıdır.
              </p>
              <div className="space-y-3">
                <div className="border border-slate-100 dark:border-slate-800 p-3.5 rounded-lg">
                  <h4 className="text-xs font-bold text-slate-800 dark:text-white mb-1.5">
                    1. Hesap ve İşlem Kayıtları
                  </h4>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 font-medium">
                    Sağ üstteki "+" butonuna tıklayarak yeni harcama veya gelir ekleyebilirsiniz.
                    Tüm işlemler otomatik olarak raporlama ve tahmin grafikleriyle senkronize
                    edilir.
                  </p>
                </div>
                <div className="border border-slate-100 dark:border-slate-800 p-3.5 rounded-lg">
                  <h4 className="text-xs font-bold text-slate-800 dark:text-white mb-1.5">
                    2. Bütçe ve Hedef Limitleri
                  </h4>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 font-medium">
                    Kategorik harcama limitleri tanımlayarak bütçenizi aşmaktan korunun. Acil Durum
                    Fonu gibi birikim hedefleri ekleyerek aylık birikim oranlarınızı optimize edin.
                  </p>
                </div>
              </div>
            </div>
          )}

          {activeTab === "faq" && (
            <div className="space-y-4">
              <h3 className="font-headline-sm text-base text-slate-800 dark:text-white font-bold leading-tight">
                💬 Sıkça Sorulan Sorular (SSS)
              </h3>
              <div className="space-y-3 font-semibold text-xs">
                <div>
                  <h4 className="text-slate-800 dark:text-white font-bold mb-1">
                    S: Verilerim nerede saklanıyor?
                  </h4>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 font-medium">
                    C: Verileriniz, çevrimdışı kullanım uyumluluğu için tarayıcınızın yerel depolama
                    alanında (LocalStorage) şifresiz ve güvenli olarak tutulmaktadır.
                  </p>
                </div>
                <hr className="border-slate-100 dark:border-slate-800" />
                <div>
                  <h4 className="text-slate-800 dark:text-white font-bold mb-1">
                    S: PDF raporu nasıl alabilirim?
                  </h4>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 font-medium">
                    C: Dashboard sayfasında sağ üstteki "Dışa Aktar" butonuna basarak tarayıcınızın
                    PDF kaydetme özelliğini kullanabilirsiniz. Ekrandaki gereksiz butonlar otomatik
                    gizlenir.
                  </p>
                </div>
              </div>
            </div>
          )}

          {activeTab === "shortcuts" && (
            <div className="space-y-4">
              <h3 className="font-headline-sm text-base text-slate-800 dark:text-white font-bold leading-tight">
                ⌨️ Klavye Kısayolları
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed font-semibold">
                Uygulama içinde hızlıca gezinmek veya işlem yapmak için kısayolları
                kullanabilirsiniz.
              </p>
              <div className="space-y-2">
                <div className="flex justify-between items-center py-2 border-b border-slate-100 dark:border-slate-800">
                  <span className="text-xs text-slate-650 dark:text-slate-350 font-bold">
                    Yardım Panelini Aç
                  </span>
                  <kbd className="px-2 py-1 bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded text-[10px] font-bold text-slate-600 dark:text-slate-300">
                    Alt + H
                  </kbd>
                </div>
                <div className="flex justify-between items-center py-2 border-b border-slate-100 dark:border-slate-800">
                  <span className="text-xs text-slate-650 dark:text-slate-350 font-bold">
                    Hızlı İşlem Ekle
                  </span>
                  <kbd className="px-2 py-1 bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded text-[10px] font-bold text-slate-600 dark:text-slate-300">
                    Alt + N
                  </kbd>
                </div>
                <div className="flex justify-between items-center py-2 border-b border-slate-100 dark:border-slate-800">
                  <span className="text-xs text-slate-650 dark:text-slate-350 font-bold">
                    Paneli Kapat
                  </span>
                  <kbd className="px-2 py-1 bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded text-[10px] font-bold text-slate-600 dark:text-slate-300">
                    ESC
                  </kbd>
                </div>
              </div>
            </div>
          )}

          {activeTab === "support" && (
            <div className="space-y-4">
              <h3 className="font-headline-sm text-base text-slate-800 dark:text-white font-bold leading-tight">
                📞 Teknik Destek ve İletişim
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed font-semibold">
                Sistemle ilgili soru ve destek talepleriniz için ekibimizle iletişime
                geçebilirsiniz.
              </p>
              <div className="p-4 bg-slate-50 dark:bg-slate-850 rounded-lg border border-slate-100 dark:border-slate-800 space-y-2">
                <div className="flex justify-between text-xs font-semibold">
                  <span className="text-slate-400">Destek E-postası:</span>
                  <a
                    href="mailto:destek@financefocus.com"
                    className="text-primary hover:underline font-bold"
                  >
                    destek@financefocus.com
                  </a>
                </div>
                <div className="flex justify-between text-xs font-semibold">
                  <span className="text-slate-400">Web Sitesi:</span>
                  <a
                    href="https://financefocus.com"
                    target="_blank"
                    rel="noreferrer"
                    className="text-primary hover:underline font-bold flex items-center gap-1"
                  >
                    financefocus.com <ExternalLink size={12} />
                  </a>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </Modal>
  );
};
