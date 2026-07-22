# Frontend Referans Dokümanı

## Amaç

Bu doküman, FinanceFocus Frontend uygulamasının mimarisini ve Backend ile olan entegrasyon kurallarını açıklamak amacıyla hazırlanmıştır.

Backend geliştirilirken frontend mevcut haliyle korunacaktır. API tasarımı frontend'e göre şekillendirilecek, frontend ise minimum değişiklikle gerçek API'ye bağlanacaktır.

---

# Kullanılan Teknolojiler

- React 19
- TypeScript
- Vite
- Redux Toolkit
- React Router
- Axios
- Tailwind CSS
- React Hook Form
- Zod
- Recharts
- Vitest

---

# Genel Mimari

Frontend Feature-Based Architecture kullanılarak geliştirilmiştir.

Her özellik (Feature) kendi içerisinde bağımsızdır.

Örneğin;

- Auth
- Transactions
- Budget
- Goals
- Dashboard
- Forecast
- Financial Health
- Reports
- Portfolio
- Notifications
- Activity
- AI Assistant

Her feature kendi state yönetimine, bileşenlerine ve servislerine sahiptir.

---

# State Yönetimi

Global state yönetimi için Redux Toolkit kullanılmaktadır.

Her feature kendi Slice dosyasına sahiptir.

Örnek:

- authSlice
- transactionsSlice
- dashboardSlice
- forecastSlice

Asenkron işlemler createAsyncThunk ile yönetilmektedir.

---

# API Katmanı

HTTP istekleri Axios üzerinden gerçekleştirilmektedir.

Servis yapısı şu şekildedir:

services/
    api/
        client.ts
        endpoints.ts
        interceptors.ts

Feature bazlı servisler ise ilgili feature altında bulunmaktadır.

Örneğin:

features/
    transactions/
        services/

---

# Endpoint Yapısı

Frontend tüm endpoint adreslerini tek bir merkezden kullanmaktadır.

Örneğin:

```ts
ENDPOINTS.TRANSACTIONS.BASE

ENDPOINTS.AUTH.LOGIN

ENDPOINTS.GOALS.BASE
