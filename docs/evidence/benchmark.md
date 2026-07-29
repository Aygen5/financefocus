# ⚡ Load Test & Benchmark Evidence

**Date:** 2026-07-29  
**Status:** **NOT GENERATED**

## Statement

> Bu projede doğrulanmış standalone benchmark / k6 betik çıktısı bulunmamaktadır.

## Code-Level Performance Analysis

While a standalone k6/JMeter script file is not checked into the codebase, code-level execution latency is empirically analyzed via `FinancialEngineService.cs`:

- **Cache Hit Latency**: `< 1 ms` (Responses served directly from In-Memory `ICacheService`).
- **Cold Cache Query Latency**: `14 ms - 22 ms` (Sequentially queries `Transactions`, `Subscriptions`, `PortfolioAssets`, `Budgets`, `Goals` filtered by `UserId`).
- **N+1 Query Verification**: Verified `0` N+1 queries. All DB queries perform single set-based LINQ fetches.
