from pathlib import Path
import pypandoc

md = r"""# FinanceFocus - project.md

## Project

FinanceFocus is a modern fintech dashboard built as a portfolio-quality SaaS application. Build it with production-ready architecture, reusable components and clean code. Use Mock API first, then keep the architecture backend-ready.

---

## Tech Stack

- Vite
- React
- TypeScript
- Tailwind CSS
- Redux Toolkit
- React Router
- Axios
- React Hook Form
- Zod
- Recharts
- React Hot Toast
- date-fns
- uuid
- ESLint
- Prettier
- Husky
- lint-staged

---

## Project Goals

- Professional UI
- Enterprise architecture
- Reusable components
- Responsive
- Dark mode
- Clean TypeScript
- Feature-based structure
- Backend ready

---

## Design System

Use the provided Executive Precision Design System.

Rules

- Inter font
- Premium corporate look
- Blue / Slate palette
- Rounded-xl cards
- Soft shadows
- No inline CSS
- Tailwind only
- No hardcoded colors outside theme
- Responsive on every page

---

## Folder Structure

src/
- app
- assets
- components
- features
- hooks
- layouts
- pages
- routes
- services
- store
- styles
- types
- utils
- constants
- mocks

Each feature contains:
- components
- pages
- services
- slice
- hooks
- types
- utils

---

## Pages

Authentication
- Login
- Register

Application
- Dashboard
- Transactions
- Budget Planner
- Goals
- Forecast Engine
- Portfolio
- Subscription Tracker
- Reports
- Financial Health
- Notifications
- Activity Log
- Settings

Utility
- 404
- Unauthorized

---

## Dashboard

Show

- Total Balance
- Income
- Expense
- Savings
- Net Worth
- Budget Progress
- Goal Progress
- Portfolio Summary
- Financial Health Score
- Forecast Summary
- Recent Transactions
- Recent Activity
- Quick Actions

---

## Features

Transactions
- Full CRUD
- Search
- Filter
- Sort
- Pagination

Budget
- Monthly budgets
- Category budgets
- Remaining amount
- Progress

Goals
- CRUD
- Progress bar
- Deadline
- Monthly contribution
- Completion prediction

Forecast
- Cash flow prediction
- Expense prediction
- Savings prediction
- Goal prediction
- No LLM
- Calculation based only

Portfolio
- Cash
- Gold
- USD
- EUR
- Stocks
- Net Worth

Subscriptions
- CRUD
- Renewal reminder
- Monthly cost

Reports
- Monthly
- Yearly
- PDF Export
- Excel Export

Financial Health
Calculate score from:
- Income
- Expense
- Savings
- Budget usage
- Subscriptions
- Net Worth

Notifications
Automatic system notifications.

Activity Log
Automatically generated from Redux actions.

Settings
- Profile
- Theme
- Currency
- Notification preferences
- Logout

---

## Shared Components

Button
Input
Textarea
Select
Card
Modal
Dialog
Badge
Avatar
Table
Tabs
Dropdown
Pagination
SearchBar
FilterBar
StatCard
ChartCard
GoalCard
PortfolioCard
ForecastCard
SubscriptionCard
ActivityCard
LoadingSkeleton
EmptyState
ErrorState

Never duplicate components.

---

## Redux

Create slices

- auth
- transactions
- budget
- goals
- portfolio
- subscriptions
- reports
- forecast
- notifications
- activity
- financialHealth
- settings
- theme

Use createAsyncThunk for async operations.

---

## Mock API

Collections

- users
- transactions
- budgets
- goals
- portfolio
- subscriptions
- notifications
- activities
- reports

Never call API directly inside components.

---

## Forms

Always use

- React Hook Form
- Zod

Every form must have

- validation
- loading
- error
- success toast

---

## Utilities

Create reusable financial utilities.

- calculateNetWorth()
- calculateSavings()
- calculateBudgetUsage()
- calculateHealthScore()
- calculateForecast()
- calculateGoalProgress()

Business logic must stay outside UI.

---

## Routing

/
login
register
dashboard
transactions
budget
goals
forecast
portfolio
subscriptions
reports
financial-health
notifications
activity
settings

Protected routes after login.

---

## HTML Conversion Rules

Existing Stitch HTML files are reference only.

Convert every page into:

- React
- TypeScript
- Tailwind CSS

Requirements

- JSX components
- Reusable UI
- No duplicated HTML
- Strong typing
- Follow Design System

---

## Development Order

1. Install packages
2. Configure project
3. Configure Tailwind
4. Configure ESLint & Prettier
5. Create folder structure
6. Create routing
7. Create layouts
8. Create shared UI
9. Configure Redux
10. Configure Mock API
11. Authentication
12. Dashboard
13. Transactions
14. Budget
15. Goals
16. Forecast
17. Portfolio
18. Subscriptions
19. Reports
20. Financial Health
21. Notifications
22. Activity
23. Settings
24. Testing
25. Optimization
26. Documentation

---

## Future Backend

Architecture must support

- Node.js
- Express
- PostgreSQL
- JWT
- Refresh Token

Frontend should require minimal changes during backend integration.

---

## Acceptance Criteria

- Production-quality code
- Responsive
- Accessible
- Reusable components
- Feature-based architecture
- Redux Toolkit
- Mock API working
- Dark mode
- TypeScript without any
- Clean folder structure
- Easy backend integration
- Portfolio-quality project
"""

out=Path("/mnt/data/project.md")
pypandoc.convert_text(md,"md",format="md",outputfile=str(out),extra_args=["--standalone"])
print(out)
