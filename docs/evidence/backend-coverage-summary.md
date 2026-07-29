# 📊 Backend Code Coverage Summary

**Date:** 2026-07-29  
**Tool:** Coverlet (`XPlat Code Coverage`)  
**Evidence File:** `backend/FinanceFocus.Tests/TestResults/c6145ad4-feb1-4acb-ad61-8d6a348430f9/coverage.cobertura.xml`  
**Test Suite Status:** 56 / 56 xUnit Tests Passed (0 Failures)

## Overall Metrics

| Metric | Rate | Covered / Total |
| :--- | :---: | :---: |
| **Line Coverage** | **17.45%** | 1,311 / 7,510 lines |
| **Branch Coverage** | **20.67%** | 197 / 953 branches |

## Layer Breakdown

| Layer / Assembly | Line Rate (%) | Complexity |
| :--- | :---: | :---: |
| **FinanceFocus.API** | **33.46%** | 150 |
| **FinanceFocus.Domain** | **32.07%** | 98 |
| **FinanceFocus.Application** | **22.87%** | 1,337 |
| **FinanceFocus.Infrastructure** | **10.50%** | 132 |

## Evidence Verification

- Unit & Integration Test Assembly: `FinanceFocus.Tests.dll`
- Test Runner: xUnit 2.x + VSTest 18.0.1
- Verification Command: `dotnet test backend/FinanceFocus.slnx --collect:"XPlat Code Coverage"`
