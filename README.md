# 📊 FinanceFocus

<p align="center">
  <strong>AI-Powered Personal Finance & Wealth Management Platform</strong>
</p>

FinanceFocus, bireysel gelir-gider dengesini kontrol altında tutmak, bütçe disiplini sağlamak ve varlıkları tek bir merkezden izlemek için geliştirilmiş modern bir kişisel finans ve servet yönetimi platformudur.

Bu depo (repository), hem istemci (React 19) hem de sunucu (ASP.NET Core .NET 10) katmanlarını barındıran tam kapsamlı (Full Stack) bir yazılım projesidir.

---

## 🛠️ Teknolojiler (Tech Stack)

### Backend
- **Framework:** ASP.NET Core (.NET 10 Web API)
- **Mimari:** Clean Architecture, Repository & Unit of Work Pattern
- **Veritabanı:** PostgreSQL & Entity Framework Core
- **Güvenlik:** ASP.NET Core Identity & JWT Authentication

### Frontend
- **Framework:** React 19 + TypeScript + Vite
- **State Management:** Redux Toolkit
- **Styling:** Tailwind CSS (Dark Mode Varsayılan)
- **Form & Validation:** React Hook Form + Zod

---

## 📁 Proje Yapısı (Repository Structure)

```text
FinanceFocus/
├── frontend/           # React 19 + TypeScript + Vite İstemci Uygulaması
├── backend/            # ASP.NET Core API (.NET 10) Sunucu Uygulaması
├── docs/               # Mimari Kararlar (ADR), Test ve Proje Dokümantasyonu
└── docker-compose.yml  # Multi-Container Docker Orkestrasyonu
```

---

## 🚀 Hızlı Başlatma (Quick Start)

### Gereksinimler
* **Node.js:** v20.0.0 veya üzeri
* **.NET SDK:** v10.0 veya üzeri
* **Docker & Docker Compose** (Opsiyonel)

### Docker ile Çalıştırma
```bash
docker-compose up --build
```
* **API Swagger:** `http://localhost:5000/swagger`
* **Frontend UI:** `http://localhost:3000`

### Local Development & Secrets Configuration
Yerel geliştirme ortamında gizli bilgileri (`ConnectionStrings`, `JwtSettings`) yönetmek için `dotnet user-secrets` kullanabilirsiniz:

```bash
cd backend/FinanceFocus.API

# PostgreSQL Bağlantı Cümlesi
dotnet user-secrets set "ConnectionStrings:DefaultConnection" "Host=localhost;Port=5432;Database=financefocus_db;Username=postgres;Password=YOUR_LOCAL_PASSWORD"

# JWT Imzalama Anahtarı
dotnet user-secrets set "JwtSettings:SecretKey" "YOUR_STRONG_DEVELOPMENT_JWT_SECRET_KEY_2026!"
```

---

## 📚 Dokümantasyon

Detaylı teknik mimari ve proje dokümanları için `docs/` klasörünü inceleyebilirsiniz:
- [Mimari Standartlar ve Test Katmanları](docs/architecture.md)
- [Geliştirme Yol Haritası](docs/roadmap.md)
- [API Kontratı](docs/api-contract.md)
