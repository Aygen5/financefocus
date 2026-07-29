# 🤖 GitHub Actions Workflow Evidence

**Date:** 2026-07-29  
**Workflow Name:** `Enterprise CI/CD Pipeline`  
**Config File:** `.github/workflows/ci-cd.yml`

## Workflow Architecture

```yaml
on:
  push:
    branches: [ main, develop ]
  pull_request:
    branches: [ main ]
```

## Jobs & Quality Gates Breakdown

### 1. `backend-ci` (Backend CI & Quality Gates)
- **Runner:** `ubuntu-latest`
- **Environment:** .NET 10.0.x SDK
- **Steps Executed:**
  - `dotnet restore backend/FinanceFocus.slnx`
  - `dotnet format backend/FinanceFocus.slnx --verify-no-changes`
  - `dotnet build backend/FinanceFocus.slnx --configuration Release`
  - `dotnet test backend/FinanceFocus.slnx --collect:"XPlat Code Coverage"`
  - `dotnet list package --vulnerable` (Vulnerability Scan)
  - `actions/upload-artifact@v4` (Uploads `coverage.cobertura.xml`)

### 2. `frontend-ci` (Frontend CI & Build Verification)
- **Runner:** `ubuntu-latest`
- **Environment:** Node.js 20
- **Steps Executed:**
  - `npm ci`
  - `npm run lint`
  - `npm run test -- --run`
  - `npm run test:coverage`
  - `npm audit --audit-level=high`
  - `npm run build`
  - `actions/upload-artifact@v4` (Uploads `coverage/` directory)

### 3. `docker-ci` (Docker Build & Multi-Stage Image Verification)
- **Runner:** `ubuntu-latest` (Needs `backend-ci` & `frontend-ci`)
- **Action:** `docker/build-push-action@v5` targeting `./backend/Dockerfile`
