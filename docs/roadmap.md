# FinanceFocus Backend Roadmap

Bu doküman, FinanceFocus Backend projesinin geliştirme sırasını belirtmektedir.

Amaç rastgele kod yazmak değildir.

Amaç;

- Clean Architecture prensiplerine uymak
- Katmanları doğru oluşturmak
- Frontend ile tam uyumlu çalışmak
- Her modülü tamamladıktan sonra test etmek
- Her önemli adımı commit'lemek
- Production kalitesinde bir backend geliştirmektir.

---

# Geliştirme Prensibi

Her modül tamamlandıktan sonra;

- Build alınacaktır.
- Kod incelenecektir.
- Commit atılacaktır.
- Daha sonra diğer modüle geçilecektir.

Büyük değişiklikler tek seferde yapılmayacaktır.

---

# Geliştirme Sırası

## 1. Proje Altyapısı

- Solution oluşturulması
- Domain
- Application
- Infrastructure
- API
- Test projeleri
- Dependency Injection
- Docker
- PostgreSQL bağlantısı
- README hazırlanması

---

## 2. Domain Katmanı

Oluşturulacaklar:

- Entities
- Enums
- Repository Interface'leri
- Unit Of Work Interface'i

Henüz hiçbir business logic yazılmayacaktır.

Sadece domain modeli oluşturulacaktır.

---

## 3. Database Tasarımı

Entity ilişkileri kurulacaktır.

Örneğin;

- User
- Transaction
- Budget
- Goal
- Portfolio
- Notification
- ActivityLog
- Subscription
- ForecastHistory
- FinancialHealthHistory

Fluent API kullanılacaktır.

Migration oluşturulacaktır.

---

## 4. Authentication

Bu modül bütün sistemin temelidir.

Yapılacaklar:

- ASP.NET Core Identity
- JWT
- Register
- Login
- Refresh Token
- Role yapısı
- Password Hash

Kullanıcı sistemi tamamen çalışır hale getirilecektir.

---

## 5. Transactions

İlk gerçek modül olacaktır.

Yapılacaklar;

- CRUD
- DTO
- Validation
- Repository
- Service
- Controller

Bu modül tamamlandıktan sonra Frontend bağlantısı test edilecektir.

---

## 6. Budget

Transaction verilerini kullanacaktır.

Yapılacaklar;

- CRUD
- Harcama limiti
- Kategori bazlı bütçe

---

## 7. Goals

Tasarruf hedefleri

- CRUD
- Tamamlanma yüzdesi
- Gerekli aylık tasarruf hesapları

---

## 8. Portfolio

Varlık yönetimi

- CRUD
- Toplam portföy değeri
- Döviz desteği

---

## 9. Dashboard

Dashboard kendi verisini tutmayacaktır.

Transaction

Budget

Portfolio

Goal

tablolarından gerekli verileri hesaplayacaktır.

---

## 10. Reports

Rapor endpointleri

Grafikler için gerekli veriler üretilecektir.

---

## 11. Forecast Engine

Bu modül mevcut frontend ile tamamen uyumlu olacaktır.

Kullanılacak algoritma;

Simple Moving Average (SMA)

Backend;

- geçmiş işlemleri okuyacak
- ortalama hesaplayacak
- gelecek tahminlerini üretecektir.

Bu modül herhangi bir LLM kullanmayacaktır.

---

## 12. Financial Health

Finansal sağlık puanı üretilecektir.

Örneğin;

- tasarruf oranı
- gelir gider dengesi
- bütçe başarısı
- hedef ilerlemesi

gibi kriterlerden skor hesaplanacaktır.

---

## 13. Activity Log

Sistemde yapılan işlemler kayıt altına alınacaktır.

Örneğin;

- işlem eklendi
- hedef oluşturuldu
- bütçe güncellendi

---

## 14. Notifications

Bildirim sistemi.

Örneğin;

- bütçe aşıldı
- hedef yaklaşıyor
- abonelik tarihi geldi

---

## 15. Subscription

Abonelik yönetimi

- CRUD
- ödeme tarihi
- hatırlatma

---

## 16. AI Financial Assistant

Bu modül mevcut Forecast Engine'in yerine geçmeyecektir.

Forecast Engine matematiksel tahmin üretmeye devam edecektir.

AI Assistant ise;

OpenRouter API üzerinden çalışacaktır.

Kullanıcı;

- finansal analiz
- harcama önerileri
- tasarruf tavsiyeleri
- bütçe önerileri

alabilecektir.

Bu iki sistem birbirinden tamamen bağımsız olacaktır.

---

## 17. Frontend Entegrasyonu

Mock API tamamen kaldırılacaktır.

JSON Server kaldırılacaktır.

Tüm endpointler gerçek ASP.NET Core API'sine bağlanacaktır.

Frontend tarafında minimum değişiklik yapılacaktır.

---

## 18. Test

Her modül için;

- Unit Test
- Integration Test

yazılacaktır.

---

## 19. Deployment

Backend

- Docker
- PostgreSQL
- Render

Frontend

- Vercel

yayına alınacaktır.

---

## 20. Son Kontroller

- Swagger
- README
- Postman Collection
- GitHub düzeni
- Commit geçmişi
- Kod temizliği
- Son testler

tamamlanacaktır.

---

# Projenin Nihai Hedefi

FinanceFocus;

gerçek hayatta kullanılabilecek,

modern,

ölçeklenebilir,

Clean Architecture kullanan,

React + ASP.NET Core + PostgreSQL tabanlı,

tam kapsamlı bir Full Stack kişisel finans yönetim sistemi olacaktır.