# FinanceFocus

> **Kurumsal Seviyede Bireysel Finans, Bütçe ve Servet Yönetimi Platformu**

FinanceFocus; bireysel gelir-gider dengesini kontrol altında tutmak, stratejik bütçe disiplini sağlamak, küresel varlık portföylerini anlık izlemek ve finansal geleceği yerel yapay zeka destekli asistan ve tahmin motorları ile simüle etmek amacıyla geliştirilmiş uçtan uca kurumsal bir finansal yönetim platformudur.

---

## 📌 Proje Tanıtımı

Modern dünyada bireylerin finansal varlıkları; banka hesapları, bütçeler, borçlar, abonelikler, hisse senetleri, kıymetli madenler ve kripto varlıklar gibi çok sayıda farklı platforma dağılmış durumdadır. Bu dağınıklık, kişilerin net servetlerini (Net Worth) ve gerçek tasarruf oranlarını (Savings Rate) doğru hesaplayamamalarına, gizli abonelik maliyetleriyle bütçe açığı vermelerine ve uzun vadeli hedeflerini planlayamamalarına yol açmaktadır.

**FinanceFocus**, bu karmaşıklığı ortadan kaldırmak için **Single Source of Truth (Tek Doğruluk Kaynağı)** prensibiyle inşa edilmiştir.

### Kimler İçin Uygundur?
- **Bireysel Yatırımcılar**: Küresel hisse senedi, döviz, altın ve kripto varlıklarını tek ekrandan anlık kâr/zarar performansıyla takip etmek isteyenler.
- **Bütçe ve Tasarruf Odaklı Kullanıcılar**: Kategori bazlı aylık bütçe limitleri koyup %90 üzeri harcama uyarıları almak isteyenler.
- **Finansal Özgürlük ve Yapay Zeka Desteği İsteyenler**: Birikim hedeflerini takip edip yerel LLM (Ollama + Qwen 2.5) yapay zeka asistanı ile gizlilik odaklı finansal analiz almak isteyenler.

---

## ✨ Öne Çıkan Özellikler

- 🤖 **Yapay Zeka Destekli Finans Asistanı (Local LLM - Ollama & Qwen 2.5)**: Kullanıcının finansal özet verilerini (gelir, gider, bütçe, sağlık skoru) gizlilik ilkesiyle analiz eden, önerilen sorular ve SSE (Server-Sent Events) canlı akışı ile anlık tavsiye üreten AI asistanı.
- 📊 **Merkezi Finansal Dashboard**: Gelir, gider, net nakit akışı, toplam servet ve yaklaşan ödemelerin tek bakışta izlendiği kontrol paneli.
- 🧮 **Finansal Sağlık Skoru Engine (100 Puanlık Algoritma)**: Tasarruf oranı, bütçe uyumu, borç/gelir dengesi ve portföy büyüklüğünü analiz ederek 0-100 arası anlık sağlık skoru ve risk seviyesi (Excellent, Good, Moderate, Risky, Critical) üreten motor.
- 🔮 **Gelecek Tahmin Motoru (Savings Trajectory & Forecast)**: Geçmiş harcama ve gelir trendlerine dayanarak 1, 3, 6 ve 12 aylık birikim projeksiyonları oluşturan algoritmik simülasyon.
- 💼 **Çoklu Varlık Portföy Yönetimi**: BIST/ABD Hisseleri, Altın, Gümüş, Kripto Paralar, Fonlar ve Nakit Döviz varlıklarının anlık değer ve kâr/zarar analizi.
- 🎯 **Finansal Hedef Takipleri**: Hedef tutar, mevcut birikim, son tarih (Deadline) ve aylık katkı payı bazlı dinamik ilerleme çubukları.
- 🔄 **Abonelik & Sabit Gider Takibi**: Aylık/Yıllık aboneliklerin eşdeğer maliyet hesaplaması ve 30 günlük otomatik yenileme anımsatıcıları.
- 🔔 **Uçtan Uca Senkronize Bildirim Sistemi**: Veritabanı kalıcılığı ile Bell ikonu, rozet sayısı ve Bildirim Merkezi arasında %100 eşzamanlı bildirim akışı.
- 📜 **Denetim Günlükleri (Activity Log)**: Kullanıcının finansal varlıkları üzerinde yaptığı tüm ekleme, güncelleme ve silme işlemlerinin zaman damgalı iz kaydı.
- 🛠️ **Gelişmiş Sistem Ayarları & Demo Modu**: 6 sekmeden oluşan sistem konfigürasyonu (Profil, Görünüm, Bildirimler, Bölgesel, Güvenlik, Veri Yönetimi) ve veri güvenliği sağlayan Demo Modu koruması.
- 🛡️ **Offline LocalStorage Fallback**: Ağ kesintilerinde veya sunucu erişilemez olduğunda istemci tarafında kesintisiz çalışmayı sağlayan otomatik yerel depolama modu.

---

## 🛠️ Kullanılan Teknolojiler

| Katman | Teknolojiler / Kütüphaneler | Açıklama |
| :--- | :--- | :--- |
| **Backend Framework** | ASP.NET Core (.NET 10 Web API) | Yüksek performanslı, tipli ve kurumsal Web API mimarisi. |
| **Local AI Engine** | Ollama (Model: Qwen 2.5:1.5b), SSE Streaming | Yerel LLM entegrasyonu ve canlı akış (Server-Sent Events) servisi. |
| **ORM & Database** | Entity Framework Core 10, PostgreSQL | PostgreSQL veri tabanı ile ilişkisel veri modellemesi ve migration yönetimi. |
| **Authentication** | ASP.NET Core Identity, JWT Bearer | Rol tabanlı yetkilendirme ve 7 günlük güvenli JWT Bearer token mimarisi. |
| **Background Jobs** | Hangfire | Abonelik ödemeleri ve hedef anımsatıcıları için arka plan cron görevleri. |
| **Logging & Telemetry** | Serilog | Konsol ve günlük dosya bazlı yapılandırılmış (structured) loglama. |
| **Mapping & Validation** | AutoMapper, FluentValidation | DTO nesne eşleme ve iş kuralı doğrulama katmanları. |
| **Frontend Framework** | React 19, TypeScript, Vite 8 | Modern, tip güvenli ve hızlı istemci arayüzü. |
| **State Management** | Redux Toolkit 2.6, React-Redux 9.2 | Merkezi durum yönetimi, async thunk'lar ve cross-slice senkronizasyonu. |
| **Styling & UI** | TailwindCSS 3.4, Lucide React, Recharts | Glassmorphism, dark mode ve dinamik grafik bileşenleri. |
| **Form Management** | React Hook Form 7.54, Zod 3.24 | İstemci tarafı performanslı form yönetimi ve şema doğrulaması. |
| **Testing** | xUnit, Moq, Vitest 4.1, Testing Library | Backend ve frontend birim testleri (101 Toplam Test). |

---

## 🏗️ Mimari Yapı (Clean Architecture)

Backend mimarisi, bağımlılıkların içeriye doğru aktığı 4 temel **Clean Architecture** katmanından oluşmaktadır:

```text
               +-----------------------------------+
               |        FinanceFocus.API           |
               | (Controllers, Middlewares, DTOs)  |
               +-----------------+-----------------+
                                 |
                                 v
               +-----------------+-----------------+
               |     FinanceFocus.Application      |
               | (Services, Interfaces, Validators)|
               +-----------------+-----------------+
                                 |
                                 v
               +-----------------+-----------------+
               |     FinanceFocus.Infrastructure   |
               | (EF Core, Identity, Jwt, Jobs)    |
               +-----------------+-----------------+
                                 |
                                 v
               +-----------------+-----------------+
               |       FinanceFocus.Domain         |
               | (Entities, Enums, UnitOfWork)     |
               +-----------------------------------+
```

### Katmanların Görevleri
1. **FinanceFocus.Domain**: Veritabanı bağımsız iş nesnelerini (`AppUser`, `Transaction`, `Budget`, `Goal`, `PortfolioAsset`, `Subscription`, `Notification`, `ActivityLog`) ve `UnitOfWork` arayüzlerini barındıran çekirdek katman.
2. **FinanceFocus.Application**: İş mantığı servislerini (`FinancialEngineService`, `AIAssistantService`, `BudgetService`, `GoalService` vb.), DTO eşlemelerini (`AutoMapper`), doğrulama kurallarını (`FluentValidation`) ve servis arayüzlerini kapsar.
3. **FinanceFocus.Infrastructure**: PostgreSQL veritabanı erişimi (`FinanceFocusDbContext`), EF Core konfigürasyonları, JWT Token Üreteci, `OllamaClient`, MemoryCache ve Hangfire arka plan işlerini barındırır.
4. **FinanceFocus.API**: HTTP isteklerini karşılayan Controller sınıfları (`AIAssistantController`, `NotificationsController` vb.), Global Exception Handler middleware, Serilog loglama ve Swagger dokümantasyon katmanı.
5. **Frontend Feature-Based Architecture**: React tarafı modüler (feature-based) yapıda kurgulanmıştır. Her modül (`ai`, `activity`, `auth`, `budget`, `dashboard`, `financialHealth`, `forecast`, `goals`, `notifications`, `portfolio`, `reports`, `settings`, `subscriptions`, `transactions`) kendi bileşenlerini, slice'larını ve servislerini barındırır.

---

## 📂 Proje Dizin Yapısı

```text
FinanceFocus/
├── backend/
│   ├── FinanceFocus.API/                # REST Controllers, Middlewares, Program.cs
│   │   ├── Controllers/                 # AIAssistant, Auth, Transactions, Budget, Goals, Portfolio vb.
│   │   ├── Extensions/                  # Service Collection & Middleware uzantıları
│   │   ├── Middlewares/                 # GlobalExceptionHandler, SecurityHeaders, CorrelationId
│   │   └── appsettings.json             # JWT, Database, AISettings (Ollama) ve Logging ayarları
│   ├── FinanceFocus.Application/        # İş Mantığı, DTOs, Validators, Services
│   │   ├── DTOs/                        # AIAssistant, Transactions, Budget vb. Request/Response nesneleri
│   │   ├── Interfaces/                  # IAIAssistantService, IUnitOfWork vb. kontratlar
│   │   ├── Services/                    # AIAssistantService, FinancialEngine, BudgetService vb.
│   │   └── Validators/                  # FluentValidation kuralları
│   ├── FinanceFocus.Domain/             # Entity, Enum ve Domain kontratları
│   │   ├── Entities/                    # Transaction, Budget, Goal, PortfolioAsset vb.
│   │   └── Enums/                       # TransactionType, NotificationType, PortfolioAssetType
│   ├── FinanceFocus.Infrastructure/     # EF Core DbContext, Identity, JWT, OllamaClient, Jobs
│   │   ├── Persistence/                 # DbContext, Migrations ve DbInitializer
│   │   └── Services/                    # OllamaClient, JwtTokenGenerator, CacheService, JobScheduler
│   └── FinanceFocus.Tests/              # xUnit ile yazılmış Backend Birim Testleri
├── frontend/
│   ├── src/
│   │   ├── api/                         # aiAssistantApi, axiosClient ve API endpoint tanımları
│   │   ├── components/                  # Ortak UI bileşenleri (Button, Input, Modal, Select vb.)
│   │   ├── config/                      # Navigasyon ve rota yapılandırmaları
│   │   ├── features/                    # Modül bazlı Feature klasörleri (ai, dashboard, budget vb.)
│   │   ├── hooks/                       # Custom React Hook'ları (useIdleTimeout, useIsDemoActive)
│   │   ├── layouts/                     # MainLayout, Topbar, Sidebar
│   │   ├── pages/                       # Sayfa bileşenleri (AiAssistant, Dashboard, Budget vb.)
│   │   ├── services/                    # API modül servisleri
│   │   ├── store/                       # Redux Store yapılandırması ve Root Reducer
│   │   ├── test/                        # Vitest ile yazılmış Frontend Birim Testleri
│   │   └── utils/                       # Finansal hesaplama ve stil yardımcıları (financialMath.ts)
│   ├── package.json                     # Bağımlılıklar ve npm betikleri
│   └── vite.config.ts                   # Vite ve Vitest yapılandırması
├── docs/                                # Mimari dokümantasyon ve kontratlar
└── README.md                            # Proje Dokümantasyonu
```

---

## 🧩 Modüller ve Çalışma Prensipleri

### 1. Yapay Zeka Destekli Finans Asistanı (AI Assistant Modülü)
Kullanıcının finansal durumu veritabanından çekilerek gizlilik prensiplerine uygun biçimde sistem istemine (prompt context) dönüştürülür. Yerel **Ollama (Qwen 2.5)** modeli üzerinden çalışır. `POST /api/v1/aiassistant/chat-stream` endpoint'i aracılığıyla **Server-Sent Events (SSE)** yöntemiyle yanıtları harf harf canlı akar. Tasarruf önerisi, harcama analizi ve bütçe stratejileri için hazır soru şablonları sunar.

### 2. Dashboard (Kontrol Paneli)
Tüm finansal verilerin özetlendiği ana ekrandır. Toplam servet, aylık gelir/gider, net tasarruf, nakit akışı grafiği, son işlemler, aktif hedefler ve yaklaşan abonelik ödemeleri anlık olarak sunulur.

### 3. İşlem Yönetimi (Transactions)
Gelir (`Income`), Gider (`Expense`) ve Transfer (`Transfer`) türündeki finansal hareketlerin kategorize edilerek kaydedildiği, filtrelendiği ve veritabanında saklandığı modüldür.

### 4. Bütçe Planlayıcı (Budget Planner)
Kullanıcının kategori bazlı (Gıda, Konut, Ulaşım vb.) aylık bütçe limitleri belirlemesini sağlar. Harcamalar bütçenin %90'ına ulaştığında sistem otomatik uyarı bildirimi üretir.

### 5. Finansal Hedefler (Goals)
Birikim hedeflerinin yönetildiği modüldür. Hedeflenen tutar ile mevcut birikim karşılaştırılarak tamamlanma yüzdesi ve son tarihe kalan süre hesaplanır.

### 6. Abonelikler (Subscriptions)
Aylık veya yıllık tekrarlayan sabit ödemelerin (Netflix, Spotify vb.) takibini yapar. Yıllık aboneliklerin aylık eşdeğer maliyetini hesaplayarak bütçeye etkisini gösterir.

### 7. Portföy Analizi (Portfolio)
Hisse senedi, altın, kripto para, döviz ve fon gibi yatırım varlıklarının miktar, alış fiyatı ve güncel fiyat üzerinden anlık kâr/zarar performansını ve varlık dağılım pastasını sunar.

### 8. Gelecek Tahmin Motoru (Forecast Engine)
Geçmiş aylık ortalama nakit akışına dayanarak kullanıcının 1, 3, 6 ve 12 ay sonraki muhtemel birikimini simüle eder.

### 9. Finansal Sağlık Skoru (Financial Health Engine)
Gelir/Gider oranı, tasarruf yüzdesi, bütçe disiplini, hedef başarısı ve abonelik yükü kriterlerini puanlayarak 100 üzerinden finansal sağlık skoru üretir.

### 10. Bildirim Merkezi (Notifications)
Sistem tarafından üretilen bütçe uyarıları, hedef başarıları ve ödeme anımsatıcılarının veritabanı kalıcılığı ile Bell ikonu ve Bildirim Sayfasında senkronize sunulduğu modüldür.

### 11. Aktivite Günlüğü (Activity Log)
Kullanıcının finansal verileri üzerinde gerçekleştirdiği tüm ekleme, düzenleme ve silme eylemlerinin kronolojik zaman damgasıyla kayıt altına alındığı denetim izidir.

### 12. Sistem Ayarları (Settings Modülü)
Altı sekmeden oluşur: Profil Yönetimi (`ProfileTab`), Görünüm/Tema Seçimi (`AppearanceTab`), Bildirim Tercihleri (`NotificationsTab`), Bölgesel Formatlar (`RegionalTab`), Güvenlik/Parola Değiştirme (`SecurityTab`) ve Veri Sıfırlama (`DataManagementTab`).

### Modüller Arası İletişim
Bir modülde veri değiştiğinde (örneğin yeni bir Gider eklendiğinde); Redux çapraz refetch dispatche'leri (`fetchDashboardData`, `fetchFinancialHealth`, `fetchForecastData`, `fetchActivities`) çalıştırılarak tüm modüllerin anında tek bir hakikat üzerinden güncellenmesi sağlanır.

---

## 🧮 Finansal Hesaplama Motoru (Financial Engine)

Tüm finansal hesaplamalar **Single Source of Truth** ilkesine bağlı kalınarak backend `FinancialEngineService.cs` ve frontend `financialMath.ts` üzerinde tek merkezde toplanmıştır.

> [!IMPORTANT]
> **Temel Formüller ve Algoritmalar**
> - **Net Nakit Akışı (Net Cash Flow)** = `Toplam Gelir - Toplam Gider`
> - **Tasarruf Tutarı (Savings)** = `Toplam Gelir - Toplam Gider`
> - **Tasarruf Oranı (Savings Rate)** = `(Net Nakit Akışı / Toplam Gelir) * 100` *(Gelir = 0 ise %0)*
> - **Bütçe Kullanım Oranı** = `(Kategori Harcaması / Bütçe Limiti) * 100`
> - **Hedef İlerlemesi** = `(Mevcut Birikim / Hedef Tutar) * 100`
> - **12 Aylık Gelecek Tahmini** = `Mevcut Varlık + (Aylık Ortalama Tasarruf * 12)`

### Finansal Sağlık Skoru Dağılımı (100 Puan Üzerinden)
- **Gelir/Gider Oranı (25 Puan)**: Gelirin giderden büyük olma durumu.
- **Tasarruf Oranı (20 Puan)**: Tasarruf oranının %30 ve üzeri olması.
- **Bütçe Uyum Oranı (15 Puan)**: Harcamaların bütçe limitleri içinde kalması.
- **Hedef İlerleme Başarısı (15 Puan)**: Hedeflerin ortalama tamamlanma yüzdesi.
- **Abonelik Yükü (10 Puan)**: Abonelik maliyetinin gelire oranının %10'un altında olması.
- **Portföy Büyüklüğü & Kârlılığı (17 Puan)**: Portföy büyüklüğü ve pozitif kârlılık oranı.

---

## 🔐 Kimlik Doğrulama ve Güvenlik (Authentication & Security)

FinanceFocus, güvenli kimlik doğrulama için **ASP.NET Core Identity** ve **JWT Bearer Token** mimarisini kullanır.

- **Token Süresi**: Oluşturulan JWT token'ları **7 Gün (168 Saat)** geçerliliğe sahiptir.
- **Oturum Yönetimi**: İstemci tarafında token ve kullanıcı bilgisi `localStorage` üzerinde saklanır ve her isteğe HTTP `Authorization: Bearer <token>` header'ı ile eklenir.
- **Korumalı Rotalar (Protected Routes)**: Frontend tarafında `ProtectedRoute.tsx` bileşeni ile yetkisiz kullanıcıların korumalı sayfalara erişimi engellenir.
- **Güvenli Çıkış (Logout)**: Çıkış yapıldığında `localStorage` üzerindeki tüm token ve ayarlar silinir, Redux hafızasındaki tüm dilimler 0ms'de temizlenir.

---

## 🔍 Validasyon Süreçleri

Validasyon işlemleri hem sunucu hem de istemci tarafında çift katmanlı olarak yürütülür:

### Backend Validasyonu (FluentValidation)
Her DTO için özel validator sınıfları yazılmıştır. Örneğin `AIChatRequestValidator`, `CreateTransactionValidator` veya `CreateBudgetValidator` ile istek nesnelerinin geçerliliği sunucu seviyesinde kontrol edilir.

### Frontend Validasyonu (React Hook Form + Zod)
Form inputlarında anlık doğrulama Zod şemaları (`zodResolver`) üzerinden yapılır. Kullanıcı hatalı veri girdiğinde form sunucuya gönderilmeden önce kullanıcıya açıklayıcı mesajlar gösterilir.

---

## 🧪 Test Stratejisi ve Doğrulama

Projede **101 Adet Otomatik Test** bulunmakta olup %100 başarı oranıyla çalışmaktadır.

```text
+-----------------------------------------------------------------------+
| TEST KATMANI    | ÇERÇEVE                 | TEST SAYISI | DURUM       |
+-----------------+-------------------------+-------------+-------------+
| Backend Unit    | xUnit, Moq, EF InMemory | 57 Test     | ✅ PASSED   |
| Frontend Unit   | Vitest, Testing Library | 44 Test     | ✅ PASSED   |
+-----------------+-------------------------+-------------+-------------+
| TOPLAM          |                         | 101 Test    | ✅ %100 PASS|
+-----------------------------------------------------------------------+
```

### Neler Test Ediliyor?
- **Backend**: Servislerin doğru DTO döndürmesi, AI Asistanı validasyonu ve yanıt mekanizması, hesaplama motoru çıktıları, yetkisiz erişim durumları, CRUD operasyonları.
- **Frontend**: Redux slice durum geçişleri, finansal hesaplama fonksiyonları (`financialMath.test.ts`), UI bileşenlerinin doğru render olması.

---

## ⚡ Performans ve Optimizasyon

1. **Backend MemoryCache**: `FinancialEngineService` çıktısı `ICacheService` ile bellekte önbelleğe alınır. Veri değiştiğinde önbellek otomatik temizlenir.
2. **Offline Fallback Mode**: Sunucu erişilemez olduğunda Axios interceptor'ı devreye girerek istekleri yerel depolamaya yönlendirir ve kesintisiz deneyim sunar.
3. **Cross-Slice Refetching**: Veri güncellendiğinde yalnızca etkilenen Redux dilimleri yeniden çekilerek gereksiz ağ istekleri önlenir.

---

## 🚀 Kurulum ve Çalıştırma Rehberi

### Ön Gereksinimler
- **Node.js**: v20.0.0 veya üzeri
- **.NET SDK**: v10.0 veya üzeri
- **PostgreSQL**: v15.0 veya üzeri
- **Ollama (Opsiyonel / AI için)**: Local Ollama servisi (`ollama run qwen2.5:1.5b`)

### 1. Veritabanı ve Backend Kurulumu
```bash
# Projeyi klonlayın
git clone https://github.com/aygen5/financefocus.git
cd FinanceFocus/backend

# PostgreSQL Veritabanı Bağlantı Cümlesini Ayarlayın (appsettings.json veya user-secrets)
cd FinanceFocus.API
dotnet user-secrets set "ConnectionStrings:DefaultConnection" "Host=localhost;Port=5432;Database=financefocus_db;Username=postgres;Password=SIZIN_PAROLANIZ"

# Projeyi Derleyin ve Veritabanı Migration'larını Uygulayın
dotnet build
dotnet ef database update --project ../FinanceFocus.Infrastructure

# Backend Uygulamasını Çalıştırın
dotnet run
```
> API `http://localhost:5000/swagger` adresinde yayına girecektir.

### 2. Frontend Kurulumu
```bash
cd FinanceFocus/frontend

# Bağımlılıkları Yükleyin
npm install

# Testleri Çalıştırın (İsteğe Bağlı)
npm test

# Uygulamayı Geliştirici Modunda Başlatın
npm run dev
```
> Uygulama `http://localhost:3000` veya Vite varsayılan portunda açılacaktır.

---

## 🌐 API Tasarımı ve Mimari Sözleşmeler

API endpoints **RESTful** standartlara ve sürüm kontrolüne (`ApiVersion("1.0")`) uygundur. Tüm API yanıtları standart bir `Result<T>` veya `ApiResponse<T>` sarmalayıcısı ile döndürülür:

```json
{
  "success": true,
  "message": "İşlem başarıyla gerçekleştirildi.",
  "data": {
    "id": "tx-123",
    "amount": 130000.00,
    "transactionType": 0,
    "category": "Maaş"
  },
  "errors": null
}
```

- **AI Chat Standardı**: `POST /api/v1/aiassistant/chat` normal JSON cevabı dönerken, `POST /api/v1/aiassistant/chat-stream` canlı **Server-Sent Events (text/event-stream)** akışı sağlar.

---

## 🔒 Güvenlik Yaklaşımı

- **SQL Injection Koruması**: EF Core LINQ sorguları parametrik olarak çalışır, ham SQL string birleştirmesi yapılmaz.
- **XSS Koruması**: React'in otomatik HTML kaçırma (escaping) mekanizması ve `SecurityHeadersMiddleware` ile XSS engellenir.
- **Parola Güvenliği**: ASP.NET Core Identity `PasswordHasher` ile PBKDF2 / SHA-256 algoritması kullanılarak şifrelenir.
- **Input Sanitization**: FluentValidation ve Zod şemaları ile zararlı veri girişleri sunucu ve istemci kapısında engellenir.

---

## 🗺️ Gelecekte Planlanan Geliştirmeler (Roadmap)

- [x] **Local LLM Yapay Zeka Finans Asistanı & Canlı SSE Akışı** (Tamamlandı)
- [ ] **Open Banking / Otomatik Banka Entegrasyonu**: Banka hesap hareketlerinin PSD2 API'leri ile otomatik çekilmesi.
- [ ] **Çoklu Para Birimi Otomatik Dönüştürücü**: Anlık döviz kurları ile farklı para birimlerindeki hesapların otomatik dönüştürülmesi.
- [ ] **Mobil Uygulama (React Native)**: İstemci arayüzünün cross-platform mobil sürümünün yayınlanması.

---

## 🏛️ Geliştirici Notları ve Yazılım Prensipleri

FinanceFocus projesi geliştirilirken aşağıdaki yazılım mühendisliği ilkeleri titizlikle uygulanmıştır:

- **SOLID Prensipleri**: Sorumlulukların ayrıştırılması (Single Responsibility), arayüz ayırımı (Interface Segregation) ve bağımlılıkların dışarıdan enjekte edilmesi (Dependency Injection).
- **Clean Architecture**: İş mantığı ve veri erişim katmanlarının birbirinden bağımsız ve test edilebilir kılınması.
- **Single Source of Truth (SSOT)**: Tüm hesaplama ve metriklerin tek bir merkezden türetilmesi.
- **DRY (Don't Repeat Yourself)**: Kod tekrarlarından kaçınılarak ortak yardımcı fonksiyonlar ve bileşenler oluşturulması.

---

## 📄 Lisans (License)

Bu proje [MIT Lisansı](file:///C:/Projects/FinanceFocus/LICENSE) altında lisanslanmıştır. Detaylar için [LICENSE](file:///C:/Projects/FinanceFocus/LICENSE) dosyasını inceleyebilirsiniz.

---

## 🎯 Sonuç

FinanceFocus; modern web teknolojileri, sağlam backend mimarisi, yerel yapay zeka entegrasyonu ve yüksek matematiksel hassasiyete sahip hesaplama motoru ile bireysel finans yönetiminde yüksek kaliteli bir standart sunmaktadır. Temiz kod prensipleri, uçtan uca test kapsayıcılığı ve kurumsal mimari yaklaşımı sayesinde ölçeklenebilir ve sürdürülebilir bir açık kaynak projesidir.
