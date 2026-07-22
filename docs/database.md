# FinanceFocus Database Design

## Amaç

Bu doküman FinanceFocus Backend projesinin veritabanı tasarımını tanımlar.

Amaç yalnızca tablolar oluşturmak değildir.

Veritabanı;

- ölçeklenebilir,
- performanslı,
- normalizasyon kurallarına uygun,
- sürdürülebilir

bir yapıda tasarlanacaktır.

PostgreSQL kullanılacaktır.

Entity Framework Core Code First yaklaşımı tercih edilecektir.

Migration sistemi kullanılacaktır.

---

# Temel İlkeler

Veritabanı tasarlanırken aşağıdaki prensiplere uyulacaktır.

- Her tablo tek bir sorumluluğa sahip olacaktır.
- Gereksiz veri tekrarından kaçınılacaktır.
- Foreign Key ilişkileri açık ve anlaşılır olacaktır.
- Navigation Property yapıları Entity Framework standartlarına uygun olacaktır.
- Gereksiz nullable alanlardan kaçınılacaktır.
- Performans gerektiren alanlarda Index kullanılacaktır.

---

# Ana Tablolar

Projede aşağıdaki ana tablolar bulunacaktır.

## Users

Kimlik doğrulama işlemleri.

ASP.NET Core Identity kullanılacaktır.

Ek kullanıcı bilgileri gerektiğinde Identity modeli genişletilecektir.

---

## Transactions

Kullanıcının tüm gelir ve gider kayıtlarını tutacaktır.

Her işlem yalnızca bir kullanıcıya ait olacaktır.

Dashboard, Reports, Budget, Forecast ve Financial Health modülleri bu verileri kullanacaktır.

---

## Budgets

Kategori bazlı bütçe limitlerini tutacaktır.

Her bütçe yalnızca ilgili kullanıcıya ait olacaktır.

---

## Goals

Finansal hedefleri saklayacaktır.

Tamamlanma yüzdesi backend tarafından hesaplanacaktır.

---

## PortfolioAssets

Kullanıcının sahip olduğu yatırım varlıklarını tutacaktır.

Desteklenecek varlık türleri:

- Hisse Senedi
- Altın
- Kripto Para
- Döviz
- Nakit

---

## Reports

İleride rapor geçmişi veya oluşturulan PDF kayıtları için kullanılacaktır.

İlk sürümde dinamik hesaplama yapılması planlanmaktadır.

---

## ForecastHistory

Forecast Engine tarafından oluşturulan tahmin sonuçlarını saklayacaktır.

Geçmiş tahminlerin karşılaştırılabilmesi amaçlanmaktadır.

---

## FinancialHealthHistory

Belirli tarihlerde hesaplanan finansal sağlık skorlarını saklayacaktır.

Trend analizleri için kullanılacaktır.

---

## Notifications

Kullanıcı bildirimlerini tutacaktır.

Örnek:

- Bütçe limiti aşıldı
- Hedef tamamlandı
- Yeni analiz hazır

Bildirimlerin okundu bilgisi backend tarafından yönetilecektir.

---

## ActivityLogs

Kullanıcının yaptığı önemli işlemler kayıt altına alınacaktır.

Örnek:

- Login
- Transaction Added
- Budget Updated
- Goal Deleted

Bu kayıtlar sistem geçmişi olarak kullanılacaktır.

---

## Subscriptions

Abonelik bilgilerini tutacaktır.

Örnek:

- Netflix
- Spotify
- YouTube Premium

Yenileme tarihi ve ödeme tutarı backend tarafından takip edilecektir.

---

## AIConversations

AI Financial Assistant ile yapılan konuşmalar burada saklanacaktır.

Her konuşma ilgili kullanıcıya bağlı olacaktır.

Kaydedilecek örnek bilgiler:

- Soru
- AI cevabı
- Oluşturulma tarihi

LLM API anahtarı hiçbir zaman bu tabloda tutulmayacaktır.

---

# İlişkiler

Temel ilişkiler aşağıdaki şekilde olacaktır.

User

↓

Transactions

↓

Budgets

↓

Goals

↓

PortfolioAssets

↓

Subscriptions

↓

Notifications

↓

ActivityLogs

↓

AIConversations

Her veri yalnızca kendi kullanıcısına ait olacaktır.

---

# Silme Politikası

Kritik finansal veriler mümkün olduğunca fiziksel olarak silinmeyecektir.

İlerleyen aşamada Soft Delete uygulanması değerlendirilecektir.

Böylece geçmiş finansal kayıtlar korunabilecektir.

---

# Index Kullanımı

Aşağıdaki alanlarda performans amacıyla Index oluşturulacaktır.

- Email
- UserId
- TransactionDate
- Category
- Notification Status
- Subscription Renewal Date

---

# Seed Data

Geliştirme ortamı için başlangıç verileri oluşturulacaktır.

Örneğin;

- Roller
- Admin kullanıcısı
- Örnek finans kategorileri
- Varsayılan bütçe kategorileri

Production ortamında örnek kullanıcı verisi oluşturulmayacaktır.

---

# Migration Stratejisi

Entity Framework Core Migration sistemi kullanılacaktır.

Veritabanı şeması yalnızca Migration dosyaları üzerinden güncellenecektir.

Elle SQL scriptleri yazılmayacaktır.

---

# Gelecekte Eklenebilecek Modüller

İlerleyen sürümlerde aşağıdaki tablolar eklenebilir.

- ExchangeRates
- InvestmentPrices
- RecurringTransactions
- AIInsights
- FileAttachments

Bu genişletmeler mevcut veritabanı yapısını bozmayacak şekilde tasarlanacaktır.

---

# Hedef

Veritabanı;

- okunabilir,
- performanslı,
- genişletilebilir,
- güvenli,
- production ortamına uygun

şekilde tasarlanacaktır.

Frontend ile tam uyumlu çalışacak ve gelecekte yeni modüllerin eklenmesini kolaylaştıracaktır.