# FinanceFocus Architecture & Engineering Standards

## Mimari Yaklaşım

FinanceFocus, uzun vadede sürdürülebilir, genişletilebilir ve production ortamına uygun olacak şekilde tasarlanmıştır.

Proje yalnızca çalışan endpointler üretmeyi hedeflemez.

Her katmanın tek bir sorumluluğu vardır ve katmanlar birbirinden bağımsız tutulmuştur.

Temel hedef; değişikliklerin diğer katmanları etkilemeden yapılabilmesi ve yeni özelliklerin mevcut mimariyi bozmadan eklenebilmesidir.

---

# Kullanılacak Mimari

Backend Clean Architecture prensiplerini kullanmaktadır:

```
Presentation (API)
      ↓
 Application
      ↓
   Domain
      ↓
Infrastructure
```

Bağımlılık yönü her zaman yukarıdan aşağıya doğrudur.

Domain katmanı hiçbir dış teknolojiye bağımlı değildir.

Infrastructure katmanı ise yalnızca Domain ve Application katmanlarını kullanır.

---

# Katmanlar

## API

API katmanı uygulamanın dış dünyaya açılan kapısıdır.

Görevleri:
- Controller'ları barındırmak
- HTTP Request almak
- HTTP Response döndürmek
- Authentication yapılandırmasını yapmak
- Authorization kurallarını uygulamak
- Dependency Injection yapılandırmalarını başlatmak
- Swagger yapılandırmasını yapmak
- Global Exception Handler çalıştırmak

API katmanında business logic yazılmaz.

---

## Application

Application katmanı sistemin iş akışlarını yönetir.

Görevleri:
- DTO'lar
- Service Interface'leri
- Business Service'leri (FinancialEngine, FinancialHealth, Subscription, Portfolio vb.)
- AutoMapper Profilleri
- Validation işlemleri
- Result yapısı
- ApiResponse yapısı

Business kuralları burada uygulanır. Database işlemleri doğrudan yapılmaz; Repository Interface'leri kullanılır.

---

## Domain

Domain projenin kalbidir. Bu katman hiçbir framework'e bağımlı değildir.

Görevleri:
- Entity sınıfları
- Enum'lar
- Repository Interface'leri
- UnitOfWork Interface'i
- Domain kuralları

---

## Infrastructure

Infrastructure dış teknolojilerle iletişim kuran katmandır.

Görevleri:
- Entity Framework Core (FinanceFocusDbContext)
- DbContext & Migrations
- Repository implementasyonları
- Unit Of Work
- Identity & JWT üretimi
- PostgreSQL bağlantısı
- Docker konfigürasyonu
- Cache Service (MemoryCache)

---

# Kullanılacak Tasarım Desenleri

- Clean Architecture
- Repository Pattern
- Unit of Work Pattern
- Dependency Injection
- DTO Pattern
- Result Pattern
- Test Fixture Factory Pattern

---

# Kimlik Doğrulama & Yetkilendirme

- ASP.NET Core Identity & JWT Authentication.
- Claims: UserId, Email, Role, FirstName, LastName.
- Roller: Admin, User.

---

# 🧪 Test Mimarisi ve Stratejisi

FinanceFocus, piramit test yaklaşımına (Testing Pyramid) uygun olarak 4 farklı test katmanıyla korunmaktadır:

```
      / \
     /E2E\       <- Playwright (Frontend Uçtan Uca)
    /-----\
   /API/Int\     <- WebApplicationFactory & EF Core InMemory
  /---------\
 /Unit Tests \   <- Backend xUnit + Moq / Frontend Vitest
/-------------\
```

### 1. Backend Birim Testleri (Backend Unit Tests)
- **Konum:** `backend/FinanceFocus.Tests/`
- **Teknolojiler:** xUnit, Moq, FluentAssertions.
- **Kapsam:** Finansal hesaplama motoru (`FinancialEngineService`), Sağlık skoru ve risk seviyesi eşlemesi (`FinancialHealthScore`), Bütçe aşım analizi (`BudgetAnalysis`), Abonelik aylık eşdeğer fiyatlandırması (`SubscriptionService`), Portföy ağırlıklı ortalama alım maliyeti (`PortfolioService`) ve Hedef ilerleme yüzdesi (`GoalProgress`).
- **Prensip:** Sıfır veritabanı bağımlılığı ile sadece saf iş mantığı doğrulanır.

### 2. Backend Entegrasyon ve API Testleri (Backend Integration & API Tests)
- **Konum:** `backend/FinanceFocus.Tests/IntegrationTests/` & `TestHelpers/FinanceFocusTestFactory.cs`
- **Teknolojiler:** ASP.NET Core `Microsoft.AspNetCore.Mvc.Testing` (`WebApplicationFactory<Program>`), EF Core In-Memory Database.
- **Kapsam:** Auth, Transactions, Budgets, Goals, Portfolio, Financial Health HTTP endpoint'lerinin HTTP 200 OK, 201 Created, 400 Bad Request, 401 Unauthorized davranışlarının uçtan uca doğrulanması.

### 3. Frontend Birim ve Bileşen Testleri (Frontend Unit Tests)
- **Konum:** `frontend/src/test/`
- **Teknolojiler:** Vitest, React Testing Library, jsdom, Redux Toolkit.
- **Kapsam:** Redux slice'ları (`themeSlice`, `transactionsSlice`), Temel UI bileşenleri (`Button`, `Card`, `Input`, `Modal`, `DataTable`), Dashboard özet kartları, 20 dakikalık pasiflik oturum kapatma hook'u (`useIdleTimeout`).

### 4. Strongly Typed Test Fixtures & Partial<T> Factory Pattern
- **Konum:** `frontend/src/test/fixtures.ts`
- **Yaklaşım:** Test nesnelerinde `any` veya tip bastırma kullanılmaz. `createMockUser()`, `createMockBudget()`, `createMockTransaction()` gibi factory fonksiyonları `Partial<T>` override desteği sunarak esnek ve tip güvenli test verisi üretir.

### 5. End-to-End (E2E) Testleri
- **Konum:** `frontend/e2e/` & `frontend/playwright.config.ts`
- **Teknoloji:** Playwright Test.
- **Kapsam:** Kullanıcı giriş/kayıt akışları, korumalı sayfa yönlendirmeleri, Dark Mode varsayılan tema ve şifre göster/gizle ikonu gibi kritiği yüksek kullanıcı senaryoları.

---

# 🛡️ Kalite Kapıları ve Enterprise CI/CD Pipeline

Projede yapılan her commit ve Pull Request, GitHub Actions (`.github/workflows/ci-cd.yml`) üzerinde aşağıdaki kalite kapılarından (Quality Gates) geçer:

1. **Backend Code Style Format Check:** `dotnet format --verify-no-changes` ile kod stili doğrulanır.
2. **Frontend Lint Verification:** `npm run lint` ile ESLint kuralları denetlenir.
3. **Backend Automated Tests & Code Coverage:** `dotnet test --collect:"XPlat Code Coverage"` çalıştırılır; Cobertura XML raporu GitHub Artifacts olarak saklanır.
4. **Frontend Automated Tests & Code Coverage:** Vitest V8 motoru ile kapsama raporları üretilip `frontend-code-coverage` artifact'ı olarak yüklenir.
5. **Security Vulnerability Scans:** `dotnet list package --vulnerable` ve `npm audit --audit-level=high` ile bağımlılık güvenlik taraması yapılır.
6. **Docker Multi-Stage Build Verification:** Backend Docker imajının sorunsuz derlendiği doğrulanır.

---

# Hedef

Bu mimarinin amacı; okunabilir, test edilebilir, genişletilebilir, sürdürülebilir ve üretim (production) ortamına tam hazır bir finans platformu sunmaktır.