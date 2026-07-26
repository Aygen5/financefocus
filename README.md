# 📊 FinanceFocus

<p align="center">
  <strong>AI-Powered Personal Finance & Wealth Management Platform (Full Stack Repository)</strong>
</p>

FinanceFocus, bireysel gelir-gider dengesini kontrol altında tutmak, bütçe disiplini sağlamak ve varlıkların TRY/USD değerlerini tek bir merkezden izlemek için geliştirilmiş profesyonel bir servet yönetimi platformudur.

Bu depo (repository), hem istemci (React 19) hem de sunucu (ASP.NET Core .NET 10) katmanlarını barındıracak şekilde yapılandırılmış modüler bir Full Stack proje düzenine sahiptir.

---

## 📁 Repository Structure

```text
FinanceFocus/
├── frontend/           # React 19 + TypeScript + Vite İstemci Uygulaması (Vitest & Playwright)
├── backend/            # ASP.NET Core API (.NET 10) + Clean Architecture (xUnit & WebApplicationFactory)
├── docs/               # Mimari Kararlar (ADR), Test Mimarisi ve API Dokümantasyonları
├── .github/workflows/  # Enterprise CI/CD Pipeline (Format Check, Lint, Coverage Artifacts, Security Scans)
├── docker-compose.yml  # Multi-Container Docker Orkestrasyon Yapılandırması
└── README.md           # Kök Dokümantasyon
```

---

## 🧪 Test & Kalite Komutları (Test & Quality Gates)

### Backend Testleri (.NET 10 & xUnit)
```bash
# Birim ve Entegrasyon Testlerini Çalıştırma (54 Test - %100 Passed)
dotnet test backend/FinanceFocus.slnx

# C# Kod Formatı Doğrulaması
dotnet format backend/FinanceFocus.slnx --verify-no-changes

# Güvenlik Açığı Taraması
dotnet list backend/FinanceFocus.slnx package --vulnerable
```

### Frontend Testleri (Vitest & Playwright)
```bash
cd frontend

# Birim ve Bileşen Testleri (33 Vitest Testi - %100 Passed)
npm run test

# Kod Kapsama Raporu Üretimi (Coverage)
npm run test:coverage

# ESLint Kod Kalite Kontrolü
npm run lint

# End-to-End Uçtan Uca Testler (Playwright E2E)
npm run test:e2e

# Production Derleme Doğrulaması
npm run build
```

---

## ⚙️ Quick Start (Yerel Çalıştırma)

### Gereksinimler
* **.NET SDK:** v10.0 veya üzeri
* **Node.js:** v20.0.0 veya üzeri
* **Docker & Docker Compose** (Opsiyonel)

### Docker ile Çalıştırma
```bash
docker-compose up --build
```
- API: `http://localhost:5000/swagger`
- Frontend: `http://localhost:3000`

---

## 🗺️ Roadmap & Architecture Status

* **Frontend [Completed]:** React 19, Redux Toolkit, Tailwind CSS, Zod form doğrulamaları, Vitest test süiti, Playwright E2E testleri ve Dark Mode desteği tam entegre durumdadır.
* **Backend [Completed]:** ASP.NET Core .NET 10 Clean Architecture mimarisi, EF Core PostgreSQL veritabanı, JWT Authentication, Financial Engine, Forecast Service, Health Score Motoru, xUnit Birim ve API Entegrasyon testleri hazır durumdadır.
* **CI/CD Pipeline [Completed]:** GitHub Actions üzerinde otomatik Format Check, ESLint, Coverage Artifacts ve Security Scans adımları aktiftir.
