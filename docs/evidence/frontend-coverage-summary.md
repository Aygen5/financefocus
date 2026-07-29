# 📊 Frontend Code Coverage Summary

**Date:** 2026-07-29  
**Tool:** Vitest v8 Coverage Provider  
**Test Suite Status:** 37 / 37 Unit Tests Passed across 10 Test Files (0 Failures)

## Overall Metrics

| Metric | Rate (%) |
| :--- | :---: |
| **Statements** | **26.26%** |
| **Branches** | **15.79%** |
| **Functions** | **14.04%** |
| **Lines** | **28.31%** |

## Module Breakdown

| Directory / Module | Line Coverage (%) | Notes |
| :--- | :---: | :--- |
| `components/ui/Button` | **100.00%** | Full button variants & states |
| `components/ui/Card` | **100.00%** | Structural card wrapper |
| `components/ui/Input` | **100.00%** | Form input component |
| `components/ui/Modal` | **88.23%** | Modal overlay & escape key handler |
| `components/display/StatCard` | **100.00%** | Summary metric display card |
| `components/display/DataTable` | **87.50%** | Paginated table component |
| `hooks` (`useIdleTimeout`, `useIsDemoActive`) | **94.11%** | Single source of truth demo & idle timer |
| `store` | **85.71%** | Redux root store & theme slice |
| `features` (Redux Slices) | **17.24% - 47.05%** | Transaction, Budget, Goals, Portfolio, Auth slices |

## Evidence Verification

- Verification Command: `npx vitest run --coverage` (in `frontend/` directory)
