# FinanceFocus Backend - Geliştirme Kuralları (Skills)

Bu doküman, FinanceFocus Backend projesi geliştirilirken uyulması gereken teknik standartları, kod yazım kurallarını ve mimari prensipleri içerir.

Bu proje yalnızca çalışan bir API üretmeyi değil, aynı zamanda production seviyesine yakın, okunabilir, sürdürülebilir ve profesyonel bir backend geliştirmeyi amaçlamaktadır.

---

# Projenin Temel Amacı

Amaç yalnızca CRUD endpointleri yazmak değildir.

Amaç;

- Clean Architecture mantığını doğru uygulamak
- SOLID prensiplerine uygun kod yazmak
- Katmanlar arası bağımlılığı minimum seviyede tutmak
- Gerçek hayatta kullanılabilecek ölçeklenebilir bir mimari oluşturmak
- Frontend ile tamamen uyumlu çalışan REST API geliştirmektir.

---

# Genel Kod Standartları

Her sınıfın tek bir sorumluluğu olmalıdır.

Her metot mümkün olduğunca kısa tutulmalıdır.

Magic Number kullanılmamalıdır.

Magic String kullanılmamalıdır.

Kod tekrarından kaçınılmalıdır.

Anlaşılır değişken isimleri kullanılmalıdır.

Kod okunabilirliği her zaman önceliklidir.

Performans, okunabilirliğin önüne geçirilmemelidir.

---

# Clean Architecture Kuralları

Katman bağımlılıkları aşağıdaki şekilde olmalıdır.

API
↓

Application
↓

Domain

Infrastructure yalnızca Domain ve Application'ı kullanabilir.

Domain hiçbir katmanı referans alamaz.

Application Infrastructure'ı referans alamaz.

Bağımlılık yönü her zaman merkeze doğrudur.

---

# Entity Kuralları

Entity'ler yalnızca iş kurallarını içerir.

Entity içerisinde;

- DTO bulunmaz
- API modeli bulunmaz
- Database kodu bulunmaz
- Http kodu bulunmaz

Entity'ler sade tutulmalıdır.

---

# DTO Kuralları

API hiçbir zaman Entity döndürmez.

Her endpoint DTO döndürmelidir.

Create

Update

Response

Detail

List

DTO'ları birbirinden ayrılmalıdır.

---

# Service Kuralları

Business Logic yalnızca Service katmanında bulunmalıdır.

Controller içerisinde iş kuralı yazılmamalıdır.

Repository içerisinde iş kuralı yazılmamalıdır.

---

# Repository Kuralları

Repository yalnızca veriye erişir.

Business kararları vermez.

Validation yapmaz.

DTO üretmez.

---

# Validation

Tüm giriş doğrulamaları FluentValidation ile yapılacaktır.

Controller içerisinde manuel validation yapılmayacaktır.

---

# Authentication

ASP.NET Core Identity kullanılacaktır.

JWT Authentication kullanılacaktır.

Refresh Token desteği ilerleyen aşamada eklenecektir.

Şifreler hiçbir zaman düz metin olarak saklanmayacaktır.

---

# Veritabanı

PostgreSQL kullanılacaktır.

Entity Framework Core kullanılacaktır.

Fluent API tercih edilecektir.

Data Annotation minimum seviyede kullanılacaktır.

Migration sistemi düzenli kullanılacaktır.

---

# API Tasarımı

REST standartlarına uyulacaktır.

Endpoint isimleri tutarlı olacaktır.

HTTP Methodları doğru kullanılacaktır.

GET

POST

PUT

DELETE

PATCH

Doğru senaryolarda tercih edilecektir.

---

# Hata Yönetimi

Global Exception Middleware kullanılacaktır.

Controller içerisinde try-catch kullanılmayacaktır.

Tüm hatalar standart ApiResponse formatında dönecektir.

---

# Loglama

ILogger kullanılacaktır.

Kritik işlemler loglanacaktır.

İlerleyen aşamada Serilog entegrasyonu planlanmaktadır.

---

# Mapping

Entity ↔ DTO dönüşümleri AutoMapper ile yapılacaktır.

Controller içerisinde manuel mapping yapılmayacaktır.

---

# Dependency Injection

Tüm servisler Dependency Injection ile yönetilecektir.

new anahtar kelimesi mümkün olduğunca kullanılmayacaktır.

---

# Unit of Work

Bir işlem birden fazla repository kullanıyorsa Unit Of Work kullanılacaktır.

Transaction yönetimi burada yapılacaktır.

---

# Frontend Uyumluluğu

Backend tamamen mevcut React frontend ile uyumlu geliştirilecektir.

Endpoint isimleri frontendde kullanılan endpoint yapısına uygun olacaktır.

DTO yapıları frontend TypeScript tipleriyle uyumlu tasarlanacaktır.

Mock API kaldırıldığında frontend tarafında minimum değişiklik yapılması hedeflenmektedir.

---

# Kod Kalitesi

Nullable Reference Types aktif olacaktır.

Async/Await kullanılacaktır.

Senkron database erişimi yapılmayacaktır.

Warnings mümkün olduğunca sıfır tutulacaktır.

---

# Commit Düzeni

Küçük ve anlamlı commitler atılacaktır.

Örnekler

feat(auth): add jwt authentication

feat(transaction): implement create transaction endpoint

refactor(repository): simplify generic repository

fix(validation): correct budget validation

docs(readme): update architecture documentation

---

# Nihai Hedef

Ortaya çıkacak backend;

- okunabilir
- sürdürülebilir
- test edilebilir
- ölçeklenebilir
- gerçek projeye yakın
- modern ASP.NET Core standartlarına uygun

bir Full Stack FinanceFocus uygulamasının sunucu tarafını oluşturacaktır.