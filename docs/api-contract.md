# FinanceFocus API Contract

## Amaç

Bu doküman, FinanceFocus Frontend ile Backend arasındaki veri alışverişi kurallarını tanımlar.

Amaç yalnızca endpoint listesini oluşturmak değildir.

Frontend ve Backend tamamen birbirinden bağımsız geliştirilebilmeli, ancak aynı sözleşmeye (Contract) bağlı kalmalıdır.

Backend geliştirilirken bu dosya referans alınacaktır.

---

# Genel Kurallar

API aşağıdaki prensiplere uyacaktır.

- RESTful mimari kullanılacaktır.
- JSON veri formatı kullanılacaktır.
- UTF-8 karakter kodlaması kullanılacaktır.
- HTTPS üzerinden haberleşilecektir.
- Tüm endpointler versionlanacaktır.

Örnek:

```
/api/v1/auth/login
/api/v1/transactions
/api/v1/budgets
```

---

# Response Standardı

Tüm başarılı cevaplar ortak bir ApiResponse yapısı kullanacaktır.

Örnek:

```json
{
  "success": true,
  "message": "Transaction created successfully.",
  "data": { }
}
```

---

# Error Response

Hatalar da aynı standartta dönecektir.

Örnek

```json
{
  "success": false,
  "message": "Validation failed.",
  "errors": [
    "Amount must be greater than zero."
  ]
}
```

Frontend hiçbir zaman farklı hata formatlarıyla uğraşmayacaktır.

---

# Authentication

Authentication JWT ile yapılacaktır.

Login başarılı olduğunda backend aşağıdaki bilgileri döndürecektir.

```json
{
  "token": "...",
  "user": { }
}
```

Frontend token'ı güvenli şekilde saklayacaktır.

Authorization gereken endpointlerde

```
Authorization: Bearer {token}
```

başlığı gönderilecektir.

---

# Endpoint Grupları

Backend aşağıdaki ana modülleri sağlayacaktır.

## Authentication

```
POST /auth/register

POST /auth/login

POST /auth/logout

GET /auth/me
```

---

## Transactions

```
GET /transactions

GET /transactions/{id}

POST /transactions

PUT /transactions/{id}

DELETE /transactions/{id}
```

---

## Budgets

```
GET /budgets

POST /budgets

PUT /budgets/{id}

DELETE /budgets/{id}
```

---

## Goals

```
GET /goals

POST /goals

PUT /goals/{id}

DELETE /goals/{id}
```

---

## Portfolio

```
GET /portfolio

POST /portfolio

PUT /portfolio/{id}

DELETE /portfolio/{id}
```

---

## Dashboard

```
GET /dashboard
```

Dashboard tek endpoint üzerinden özet verileri döndürecektir.

---

## Reports

```
GET /reports
```

---

## Forecast

```
GET /forecast
```

Forecast hesaplamaları backend tarafından yapılacaktır.

Frontend yalnızca sonucu gösterecektir.

---

## Financial Health

```
GET /financial-health
```

Finansal skor backend tarafından hesaplanacaktır.

---

## Notifications

```
GET /notifications

PUT /notifications/read/{id}

PUT /notifications/read-all
```

---

## Activity Logs

```
GET /activity-logs
```

---

## Subscriptions

```
GET /subscriptions

POST /subscriptions

PUT /subscriptions/{id}

DELETE /subscriptions/{id}
```

---

## AI Financial Assistant

```
POST /ai/chat

GET /ai/history

DELETE /ai/history/{id}
```

Bu modül OpenRouter üzerinden LLM ile haberleşecektir.

Frontend yalnızca kullanıcı mesajını backend'e gönderecektir.

API anahtarı hiçbir zaman frontend'e gönderilmeyecektir.

---

# Pagination

Liste dönen endpointlerde gerektiğinde sayfalama desteklenecektir.

Örnek

```
GET /transactions?page=1&pageSize=20
```

---

# Filtering

Liste endpointleri filtrelemeyi destekleyecektir.

Örnek

```
GET /transactions?category=Food

GET /transactions?type=Income

GET /transactions?startDate=...

GET /transactions?endDate=...
```

---

# Sorting

Liste endpointleri sıralamayı destekleyecektir.

Örnek

```
GET /transactions?sort=date

GET /transactions?sort=amount
```

---

# DTO Kullanımı

Frontend hiçbir zaman Entity sınıflarını görmeyecektir.

Tüm veri alışverişi DTO'lar üzerinden yapılacaktır.

---

# Validation

Backend bütün istekleri doğrulayacaktır.

Hatalı isteklerde uygun HTTP Status Code dönecektir.

Örneğin

- 400 Bad Request
- 401 Unauthorized
- 403 Forbidden
- 404 Not Found
- 409 Conflict
- 500 Internal Server Error

---

# Versionlama

İlerleyen sürümlerde

```
/api/v2/
```

şeklinde yeni sürümler eklenebilecektir.

Eski frontend uygulamalarının çalışması korunacaktır.

---

# Performans

API gereksiz veri döndürmeyecektir.

Her endpoint yalnızca frontend'in ihtiyaç duyduğu alanları döndürecektir.

---

# Amaç

Frontend ve Backend arasında uzun vadeli, kararlı ve sürdürülebilir bir iletişim sözleşmesi oluşturmak.

Bu doküman backend geliştirilirken referans alınacak ve frontend ile tam uyumluluk korunacaktır.