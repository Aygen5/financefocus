# 📊 FinanceFocus

<p align="center">
  <strong>AI-Powered Personal Finance & Wealth Management Platform</strong>
</p>

<p align="center">
  FinanceFocus, bireysel gelir-gider dengesini kontrol altında tutmak, bütçe disiplini sağlamak ve varlıkların TRY/USD değerlerini tek bir merkezden izlemek için geliştirilmiş kurumsal kalitede bir servet yönetimi platformudur.
</p>

<p align="center">
  <img src="https://img.shields.io/badge/React-19.2.7-61DAFB?style=flat-square&logo=react&logoColor=black" alt="React" />
  <img src="https://img.shields.io/badge/TypeScript-6.0.2-3178C6?style=flat-square&logo=typescript&logoColor=white" alt="TypeScript" />
  <img src="https://img.shields.io/badge/Redux_Toolkit-2.2.1-764ABC?style=flat-square&logo=redux&logoColor=white" alt="Redux Toolkit" />
  <img src="https://img.shields.io/badge/Tailwind_CSS-3.4.17-06B6D4?style=flat-square&logo=tailwind-css&logoColor=white" alt="Tailwind CSS" />
  <img src="https://img.shields.io/badge/Vite-8.1.1-646CFF?style=flat-square&logo=vite&logoColor=white" alt="Vite" />
  <img src="https://img.shields.io/badge/Vitest-3.0.0-7E9B2F?style=flat-square&logo=vitest&logoColor=white" alt="Vitest" />
  <img src="https://img.shields.io/badge/React_Router-6.22-CA4245?style=flat-square&logo=react-router&logoColor=white" alt="React Router" />
  <img src="https://img.shields.io/badge/Axios-1.6-5A29E4?style=flat-square&logo=axios&logoColor=white" alt="Axios" />
  <img src="https://img.shields.io/badge/React_Hook_Form-7.50-EC5990?style=flat-square&logo=react-hook-form&logoColor=white" alt="React Hook Form" />
  <img src="https://img.shields.io/badge/Zod-3.22-3E67B1?style=flat-square&logo=zod&logoColor=white" alt="Zod" />
</p>

---

## 🎯 Features

*   **Dashboard & Analytics:** Net varlık durumu, aylık nakit akışı ve özet kartların reaktif takibi, tek tıkla PDF formatında rapor alma desteği.
*   **Transaction Management:** Gelir ve gider işlemlerinin kategoriler, ödeme yöntemleri ve hesaplar bazında tam CRUD yönetimi ve gelişmiş filtreleme motoru.
*   **Budget Planning:** Kategori bazlı aylık bütçe limitleri tanımlama, harcama aşım kontrolleri ve otomatik bildirim paneli.
*   **Portfolio Tracking:** Hisse senedi, altın, kripto para ve nakit varlıkların TRY/USD pariteleri üzerinden anlık değerleme ve ağırlıklı maliyet takibi.
*   **Goal Management:** Birikim hedefleri oluşturma, tamamlanma oranları ve hedefe ulaşmak için gereken aylık tasarruf projeksiyonları.
*   **Financial Reports:** Recharts entegrasyonu ile aylık ve yıllık nakit akışı ve gider dağılımı görselleştirmeleri.
*   **Forecast Engine:** SMA (Simple Moving Average) algoritmasıyla geçmiş trendlere dayalı reaktif nakit akış ve bütçe tahminlemesi.
*   **Notifications & Activity Logs:** Bütçe aşımlarında devreye giren sistem bildirimleri ve kullanıcı eylemlerini izleyen detaylı aktivite günlüğü.
*   **Responsive Design & Dark/Light Theme:** Mobil, tablet ve masaüstü çözünürlüklere tam uyumluluk ve sistem tercihine duyarlı dinamik karanlık mod desteği.

---

## 🛠️ Tech Stack

| Katman | Teknoloji | Kullanım Amacı |
| :--- | :--- | :--- |
| **Frontend** | React 19 | Bileşen tabanlı kullanıcı arayüzü |
| **State Management** | Redux Toolkit | Merkezi global durum yönetimi ve Async Thunks |
| **Styling** | Tailwind CSS | Executive Precision tasarım sistemi ve modern animasyonlar |
| **Forms & Validation** | React Hook Form + Zod | Şema doğrulama tabanlı güvenli form yönetimi |
| **Charts** | Recharts | Performanslı ve responsive finansal grafikler |
| **Testing** | Vitest + RTL + JSDOM | Unit ve entegrasyon testlerinin yürütülmesi |
| **Utilities** | Axios / date-fns / uuid | HTTP istekleri, yerelleştirilmiş tarih formatlama ve ID üretimi |

---

## 🏗️ Project Architecture

Uygulama, ölçeklenebilirliği yüksek ve takımlar arası bağımsız geliştirmeye uygun olan **Feature-Based (Özellik Tabanlı) Mimari** ile organize edilmiştir:

```text
src/
├── components/         # Ortak paylaşılan UI ve Feedback bileşenleri
├── features/           # Özellik bazlı izole modüller (auth, budget, portfolio, transactions...)
│   ├── components/     # Özelliğe özel alt bileşenler
│   ├── services/       # Özelliğe özel HTTP istekleri
│   └── slice/          # Özelliğe özel Redux Slice durumları
├── layouts/            # Ana şablonlar (Sidebar, Topbar, MainLayout)
├── pages/              # Rota sayfaları (FinancialHealth, Settings, vb.)
├── store/              # Merkezi Redux Store konfigürasyonu
└── utils/              # Finansal formüller ve local storage yöneticileri
```

---

## 📸 Screenshots

Project screenshots will be added after backend integration and production deployment.

---

## 🌐 Live Demo

Coming Soon

---

## ⚙️ Installation

### Gereksinimler
*   **Node.js:** v18.0.0 veya üzeri
*   **npm:** v9.0.0 veya üzeri

### Adımlar

1.  **Projeyi klonlayın:**
    ```bash
    git clone https://github.com/aygen/financefocus.git
    cd financefocus
    ```

2.  **Bağımlılıkları yükleyin:**
    ```bash
    npm install
    ```

3.  **Mock REST API Sunucusunu (JSON Server) çalıştırın:**
    Finansal verilerin dinamik işlenmesi için mock API sunucusunu başlatın:
    ```bash
    npx json-server --watch db.json --port 3001
    ```

4.  **Uygulamayı geliştirme modunda çalıştırın:**
    ```bash
    npm run dev
    ```
    Uygulama tarayıcıda otomatik olarak `http://localhost:3000` adresinde açılacaktır.

---

## 💻 Available Scripts

Proje dizininde aşağıdaki komutları çalıştırabilirsiniz:

*   `npm run dev`: Uygulamayı yerel geliştirme sunucusunda başlatır.
*   `npm run build`: Production ortamı için optimize edilmiş statik dosyaları derler (`dist/`).
*   `npm run test`: Vitest ile yazılmış olan 31 adet unit ve entegrasyon testini çalıştırır.
*   `npm run test:coverage`: Kod kapsama (coverage) raporunu oluşturur.

---

## 🚦 Current Project Status

*   **Frontend:** Tamamlandı. Zengin arayüz özellikleri, Redux global durum yönetimi, mock servis bağlantıları ve test kapsama süreçleri hazır durumdadır.
*   **Backend:** Geliştirme aşamasında (In Progress). Yakın zamanda **ASP.NET Core + PostgreSQL** entegrasyonu ile gerçek veritabanı ve API katmanına geçiş yapılacaktır.

---

## 🗺️ Roadmap

- [x] React 19 Frontend Mimari Kurulumu
- [x] Redux Toolkit Merkezi Store Konfigürasyonu
- [x] Feature-Based Klasör Mimarisi ve Clean Code
- [x] Zod ile Form Doğrulamaları ve Hata Yönetimi
- [x] Responsive Tasarım & Dark/Light Tema Desteği
- [x] Vitest & React Testing Library Entegrasyonu
- [ ] ASP.NET Core API Backend Katmanı
- [ ] PostgreSQL İlişkisel Veri Modeli
- [ ] JWT & Refresh Token Tabanlı Authentication Flow
- [ ] Docker Konteynerizasyonu
- [ ] AWS / Azure Deployment Pipeline (CI/CD)
- [ ] Real-time Stock & Crypto Market API Entegrasyonu
- [ ] AI Financial Recommendation Engine

---

## ✍️ Author

*   **Aygen** - *Lead Frontend / Full Stack Engineer*
*   GitHub: [@aygen5](https://github.com/aygen5)
*   LinkedIn: [aygen-profil]
