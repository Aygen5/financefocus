# 📊 FinanceFocus

<p align="center">
  <strong>AI-Powered Personal Finance & Wealth Management Platform (Full Stack Repository)</strong>
</p>

FinanceFocus, bireysel gelir-gider dengesini kontrol altında tutmak, bütçe disiplini sağlamak ve varlıkların TRY/USD değerlerini tek bir merkezden izlemek için geliştirilmiş profesyonel bir servet yönetimi platformudur.

Bu depo (repository), hem istemci (React) hem de sunucu (ASP.NET Core) katmanlarını barındıracak şekilde yapılandırılmış modüler bir Full Stack proje düzenine sahiptir.

---

## 📁 Repository Structure

```text
FinanceFocus/
├── frontend/           # React 19 + TypeScript + Vite İstemci Uygulaması
├── backend/            # ASP.NET Core API Sunucu Uygulaması (Geliştirme Aşamasında)
├── docs/               # Mimari Kararlar (ADR) ve API Dökümantasyonları
├── README.md           # Kök Dökümantasyon
└── LICENSE             # Proje Lisansı
```

Detaylı frontend kurulumu ve teknik özellikleri için [frontend/README.md](file:///c:/Users/aygen/OneDrive/Masaüstü/financefocus/frontend/README.md) dosyasına göz atabilirsiniz.

---

## ⚙️ Quick Start (Frontend)

Uygulamanın frontend katmanını yerel ortamda çalıştırmak için aşağıdaki adımları takip edin:

### Gereksinimler
*   **Node.js:** v18.0.0 veya üzeri
*   **npm:** v9.0.0 veya üzeri

### Adımlar

1.  **Bağımlılıkları yükleyin:**
    ```bash
    cd frontend
    npm install
    ```

2.  **Mock REST API Sunucusunu (JSON Server) çalıştırın:**
    Finansal verilerin dinamik işlenmesi ve local fallback mekanizmaları için mock sunucuyu başlatın:
    ```bash
    npx json-server --watch db.json --port 3001
    ```

3.  **Uygulamayı geliştirme modunda çalıştırın:**
    Yeni bir terminal penceresi açıp `frontend` klasörü altında geliştirme sunucusunu tetikleyin:
    ```bash
    npm run dev
    ```
    Uygulama tarayıcıda otomatik olarak `http://localhost:3000` adresinde açılacaktır.

---

## 🗺️ Roadmap & Current Status

*   **Frontend [Completed]:** React 19, Redux Toolkit, Zod form doğrulamaları, responsive arayüz ve yapay zeka asistanı (AI Financial Assistant) modülü hazır durumdadır.
*   **Backend [In Progress]:** `backend/` klasörü altında geliştirilecek olan **ASP.NET Core Web API + PostgreSQL** entegrasyonu ile gerçek veritabanı geçişi yakında yapılacaktır.
