# 📊 FinanceFocus

[![React Version](https://img.shields.io/badge/react-19.2.7-blue.svg?style=flat-red)](https://react.dev)
[![TypeScript Version](https://img.shields.io/badge/typescript-6.0.2-blue.svg)](https://www.typescriptlang.org)
[![Vite Version](https://img.shields.io/badge/vite-8.1.1-green.svg)](https://vite.dev)
[![TailwindCSS](https://img.shields.io/badge/tailwindcss-3.4.17-orange.svg)](https://tailwindcss.com)
[![Vitest](https://img.shields.io/badge/testing-vitest-brightgreen.svg)](https://vitest.dev)
[![License](https://img.shields.io/badge/license-MIT-green.svg)](LICENSE)

FinanceFocus, modern web teknolojileri ile geliştirilmiş, kullanıcıların gelir-gider takibi yapmasını, portföylerini yönetmesini, bütçe limitleri koymasını ve finansal hedeflerini izlemesini sağlayan kapsamlı ve kullanıcı dostu bir kişisel finans yönetim uygulamasıdır.

---

## 🚀 Özellikler

*   **Detaylı Kontrol Paneli (Dashboard):** Net varlık, aylık gelir, aylık gider ve tasarruf miktarlarının anlık gösterimi, PDF olarak dışa aktarım desteği.
*   **İşlem Geçmişi (Transactions):** Gelir ve gider kalemlerini ekleme, güncelleme, silme ve gelişmiş filtreleme/arama motoru.
*   **Bütçe Yönetimi (Budget):** Kategorilere özel bütçe limitleri tanımlama, harcamaların bütçe oranına göre aşım uyarıları.
*   **Varlık & Portföy Takibi (Portfolio):** Hisse senedi, altın, kripto para ve nakit varlıkların TRY/USD kuru üzerinden anlık güncel değer hesaplaması.
*   **Finansal Hedefler (Goals):** Birikim hedefleri oluşturma, tamamlanma yüzdeleri ve hedefe ulaşmak için gereken aylık tasarruf tahminleri.
*   **Raporlar & Analiz (Reports):** Nakit akışı ve kategori bazlı gider dağılımlarını görselleştiren grafikler.
*   **Yapay Zeka Destekli Tahmin Motoru (Forecast Engine):** SMA (Simple Moving Average) algoritması kullanarak son 3 ayın gelir-gider trendlerine göre gelecek dönem tahmini.
*   **Aktivite Günlüğü & Bildirimler:** Gerçekleştirilen tüm işlemlerin loglanması ve limit aşımlarında bildirim popover paneli.
*   **Dil & Tema Uyumluluğu:** 100% Türkçe arayüz desteği, Açık/Koyu (Dark Mode) ve Sistem temalarını dinamik takip eden tema entegrasyonu.
*   **Duyarlı Tasarım (Responsive):** Mobil (hamburger çekmece menü), tablet ve desktop çözünürlüklerine 100% uyumlu arayüz.

---

## 🛠️ Teknolojiler

FinanceFocus aşağıdaki modern teknoloji yığını ile inşa edilmiştir:

*   **Core:** React 19, TypeScript, Vite
*   **State Management:** Redux Toolkit (Slices & Async Thunks)
*   **Form & Validation:** React Hook Form + Zod
*   **Styling:** Tailwind CSS (Fluid Grid, Dark Mode class, Custom Micro-animations)
*   **Graphics & Visualization:** Recharts
*   **Date Formatting:** date-fns (Türkçe Yerelleştirilmiş)
*   **Testing Framework:** Vitest, React Testing Library, jsdom
*   **Utility & Alerts:** Axios, React Hot Toast, uuid, Lucide React

---

## 📁 Klasör Yapısı

Proje dosyaları bileşen bazlı ve özellik bazlı (feature-based) bir mimari ile organize edilmiştir:

```text
src/
├── assets/             # Görseller, logolar ve statik varlıklar
├── components/         # Ortak UI, veri gösterim ve geribildirim bileşenleri
│   ├── data-display/   # DataTable, CurrencyDisplay, StatCard
│   ├── feedback/       # ConfirmDialog, EmptyState, Spinner
│   └── ui/             # Button, Input, Modal, Badge, Skeleton
├── constants/          # Rota ve global ayar sabitleri
├── features/           # Özellik bazlı modüller
│   ├── activity/       # Aktivite Günlüğü
│   ├── auth/           # Giriş ve Kayıt İşlemleri
│   ├── budget/         # Bütçe Yönetimi
│   ├── dashboard/      # Kontrol Paneli
│   ├── notifications/  # Bildirimler
│   ├── portfolio/      # Varlık Yönetimi
│   └── transactions/   # İşlem Geçmişi
├── layouts/            # Ana şablonlar (Sidebar, Topbar, MainLayout)
├── pages/              # Rota sayfaları (FinancialHealth, Settings, vb.)
├── routes/             # React Router yapılandırmaları
├── services/           # Axios API istemcisi ve endpoints tanımları
├── store/              # Redux Store konfigürasyonu ve global slice'lar
├── test/               # Vitest test ayarları, mock'lar ve test dosyaları
├── utils/              # Finansal formüller ve local storage yöneticileri
└── App.tsx             # Ana uygulama giriş bileşeni
```

---

## ⚙️ Kurulum ve Çalıştırma

### Gereksinimler

*   [Node.js](https://nodejs.org/) (v18.0.0 veya üzeri önerilir)
*   [npm](https://www.npmjs.com/) veya [yarn](https://yarnpkg.com/)

### Adımlar

1.  **Projeyi Klonlayın veya İndirin:**
    ```bash
    git clone https://github.com/aygen/financefocus.git
    cd financefocus
    ```

2.  **Bağımlılıkları Yükleyin:**
    ```bash
    npm install
    ```

3.  **Mock Sunucuyu (JSON Server) Çalıştırın:**
    Uygulama mock API verilerini kullanmaktadır. Arka plan servislerinin çalışması için json-server veya db.json verilerini kullanan lokal mock sunucunuzu ayağa kaldırın:
    ```bash
    npx json-server --watch db.json --port 3001
    ```

4.  **Uygulamayı Geliştirme Ortamında Çalıştırın:**
    ```bash
    npm run dev
    ```
    Tarayıcınızda `http://localhost:3000` adresine giderek uygulamayı görüntüleyebilirsiniz.

---

## 🧪 Test ve Derleme

### Testleri Çalıştırma

Yazılan 31 adet unit ve entegrasyon testini Vitest ile koşturmak için:
```bash
npm run test
```

### Kod Kapsama (Coverage) Raporu Üretme

```bash
npm run test:coverage
```

### Projeyi Yayına Hazırlama (Build)

```bash
npm run build
```
Derlenmiş statik dosyalar `dist/` klasörüne çıkacaktır.

---

## 🖼️ Ekran Görüntüleri

| Kontrol Paneli (Gündüz Modu) | Kontrol Paneli (Gece Modu) |
| :---: | :---: |
| ![Dashboard Light Mode Placeholder](https://via.placeholder.com/600x350/ffffff/000000?text=Dashboard+Light+Mode) | ![Dashboard Dark Mode Placeholder](https://via.placeholder.com/600x350/0f172a/ffffff?text=Dashboard+Dark+Mode) |

---

## 🌐 Canlı Demo

Uygulamanın çalışan en güncel sürümüne aşağıdaki bağlantı üzerinden erişebilirsiniz:
👉 [FinanceFocus Canlı Demo Bağlantısı](https://financefocus-demo.example.com) *(Demo adresi temsilidir)*

---

## 🔮 Gelecek Geliştirmeler

*   **Gerçek Zamanlı Piyasa Entegrasyonu:** Hisse senetleri ve kripto varlıklar için canlı API veri entegrasyonu.
*   **Fatura Hatırlatıcıları:** Yaklaşan abonelik faturaları için takvim görünümü ve e-posta/SMS entegrasyonları.
*   **Gelişmiş Rapor Dışa Aktarımları:** CSV, Excel formatlarında detaylı işlem dökümleri.

---

## 📄 Lisans

Bu proje **MIT Lisansı** altında lisanslanmıştır. Detaylar için [LICENSE](LICENSE) dosyasını inceleyebilirsiniz.

---

## 🤝 Katkıda Bulunma

1. Projeyi forklayın.
2. Yeni bir özellik dalı (feature branch) oluşturun: `git checkout -b feature/yeni-ozellik`
3. Değişikliklerinizi commitleyin: `git commit -m 'Yeni özellik eklendi'`
4. Dalınızı pushlayın: `git push origin feature/yeni-ozellik`
5. Pull Request açın.
