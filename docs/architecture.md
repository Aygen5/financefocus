# FinanceFocus Backend Architecture

## Mimari Yaklaşım

FinanceFocus Backend, uzun vadede sürdürülebilir, genişletilebilir ve production ortamına uygun olacak şekilde tasarlanacaktır.

Proje yalnızca çalışan endpointler üretmeyi hedeflemez.

Her katmanın tek bir sorumluluğu olacak ve katmanlar birbirinden mümkün olduğunca bağımsız tutulacaktır.

Temel hedef; değişikliklerin diğer katmanları etkilemeden yapılabilmesi ve yeni özelliklerin mevcut mimariyi bozmadan eklenebilmesidir.

---

# Kullanılacak Mimari

Backend aşağıdaki mimariyi kullanacaktır.

```
Presentation (API)

↓

Application

↓

Domain

↓

Infrastructure
```

Bağımlılık yönü her zaman yukarıdan aşağıya olacaktır.

Domain katmanı hiçbir dış teknolojiye bağımlı olmayacaktır.

Infrastructure katmanı ise yalnızca Domain ve Application katmanlarını kullanacaktır.

---

# Katmanlar

## API

API katmanı uygulamanın dış dünyaya açılan kapısıdır.

Görevleri;

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

Görevleri;

- DTO'lar
- Service Interface'leri
- Business Service'leri
- AutoMapper Profilleri
- Validation işlemleri
- Result yapısı
- ApiResponse yapısı

Business kuralları burada uygulanacaktır.

Database işlemleri doğrudan yapılmayacaktır.

Repository Interface'leri kullanılacaktır.

---

## Domain

Domain projenin kalbidir.

Bu katman hiçbir framework'e bağımlı olmayacaktır.

Görevleri;

- Entity sınıfları
- Enum'lar
- Repository Interface'leri
- UnitOfWork Interface'i
- Domain kuralları

Domain içerisinde;

- Entity Framework
- PostgreSQL
- JWT
- ASP.NET Core

bulunmayacaktır.

---

## Infrastructure

Infrastructure dış teknolojilerle iletişim kuran katmandır.

Görevleri;

- Entity Framework Core
- DbContext
- Repository implementasyonları
- Unit Of Work
- Identity
- JWT üretimi
- PostgreSQL bağlantısı
- Docker
- Seed Data
- Migration'lar

Bu katman Domain'deki interface'leri implemente edecektir.

---

# Kullanılacak Tasarım Desenleri

Projede aşağıdaki tasarım desenleri kullanılacaktır.

- Clean Architecture
- Repository Pattern
- Unit of Work Pattern
- Dependency Injection
- DTO Pattern
- Result Pattern

CQRS ve MediatR bu projede kullanılmayacaktır.

Amaç; okunabilirliği yüksek ve öğrenmesi kolay bir mimari oluşturmaktır.

---

# Veri Akışı

Bir isteğin sistem içerisindeki akışı aşağıdaki şekilde olacaktır.

Frontend

↓

Controller

↓

Application Service

↓

Repository Interface

↓

Repository

↓

Entity Framework Core

↓

PostgreSQL

↓

Repository

↓

Application Service

↓

Controller

↓

Frontend

Business kararları yalnızca Application katmanında verilecektir.

---

# Kimlik Doğrulama

Authentication için;

- ASP.NET Core Identity
- JWT Authentication

kullanılacaktır.

JWT içerisine;

- UserId
- Email
- Role

claim olarak eklenecektir.

Gerekli durumlarda;

- FirstName
- LastName

claim'leri de eklenecektir.

Refresh Token yapısı proje sonunda değerlendirilecektir.

---

# Yetkilendirme

API endpointleri gerektiğinde Authorize attribute'u ile korunacaktır.

Roller;

- Admin
- User

olarak başlayacaktır.

Yeni roller gerektiğinde genişletilebilir olacaktır.

---

# DTO Kullanımı

Entity nesneleri doğrudan API'den döndürülmeyecektir.

Tüm veri alışverişi DTO'lar üzerinden yapılacaktır.

Entity ↔ DTO dönüşümleri AutoMapper ile gerçekleştirilecektir.

---

# Repository Yapısı

Her Entity için ayrı repository oluşturulacaktır.

Ortak CRUD işlemleri Generic Repository üzerinden sağlanacaktır.

Entity'ye özel sorgular ilgili repository içerisinde tanımlanacaktır.

Örnek;

- GetUserPortfolioAsync()
- GetMonthlyTransactionsAsync()
- GetUnreadNotificationsAsync()

---

# Unit Of Work

Repository'ler tek başına SaveChanges çağırmayacaktır.

Database'e kayıt işlemi yalnızca UnitOfWork üzerinden gerçekleştirilecektir.

Bu sayede aynı işlem içerisinde birden fazla repository güvenli şekilde kullanılabilecektir.

---

# Validation

İstek doğrulamaları FluentValidation ile yapılacaktır.

Controller içerisinde manuel validation yazılmayacaktır.

---

# Exception Yönetimi

Try-Catch blokları mümkün olduğunca azaltılacaktır.

Global Exception Handler kullanılacaktır.

Kullanıcıya standart ApiResponse formatında hata döndürülecektir.

---

# Kod Standartları

Kod yazılırken aşağıdaki prensiplere uyulacaktır.

- SOLID
- Clean Code
- Async/Await
- Dependency Injection
- Nullable Reference Types
- Constructor Injection
- Küçük ve okunabilir metotlar
- Tek sorumluluk prensibi

---

# Hedef

Bu mimarinin amacı;

- okunabilir,
- test edilebilir,
- genişletilebilir,
- sürdürülebilir,
- production ortamına uygun

bir backend oluşturmaktır.

Yeni modüller eklenirken mevcut mimari bozulmamalıdır.