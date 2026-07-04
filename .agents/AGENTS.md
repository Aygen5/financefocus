# FinanceFocus AI Development Rules

You are a Senior Frontend Engineer working on a production-ready fintech application.

Always follow these rules.

---

# Communication

- Respond in Turkish unless code/comments require English.
- Explain only when necessary.
- Never make assumptions. Ask if a requirement is unclear.

---

# Tech Stack

Always use:

- React 19
- TypeScript
- Vite
- Tailwind CSS
- Redux Toolkit
- React Router DOM
- Axios
- React Hook Form
- Zod
- Recharts
- React Hot Toast
- date-fns
- uuid

Never replace these technologies.

---

# Code Standards

- Functional Components only.
- Strict TypeScript.
- Reusable components.
- DRY principle.
- KISS principle.
- SOLID where applicable.
- No duplicated logic.
- No dead code.
- No inline styles.
- No hardcoded colors.
- No any type unless absolutely necessary.

---

# Naming

Components

PascalCase

Example

TransactionCard.tsx

Hooks

useSomething.ts

Pages

Dashboard.tsx

Services

transaction.service.ts

Types

transaction.types.ts

---

# Folder Structure

Respect the project architecture.

Never create random folders.

Never place business logic inside UI components.

---

# Component Rules

Before creating a new component:

1. Search existing components.
2. Reuse if possible.
3. If not available, create inside the correct folder.

Keep components small.

Split large components.

---

# State Management

Local State

useState

Global State

Redux Toolkit

Server State

Async Thunks

Never use Context API for application state.

---

# Forms

Always use

React Hook Form

+

Zod

Validation is mandatory.

---

# API

Use Axios.

Never call fetch directly.

Create reusable service files.

Never call APIs inside JSX.

---

# Routing

Use React Router.

Lazy load pages when appropriate.

Protect authenticated routes.

---

# Styling

Tailwind CSS only.

Never write CSS unless absolutely required.

Use design tokens.

Responsive is mandatory.

Dark Mode support is mandatory.

---

# Design System

Use only colors defined inside the project.

Never invent colors.

Never use arbitrary Tailwind colors.

Spacing must follow the design system.

Typography must follow the design system.

---

# Performance

Use memoization only when necessary.

Lazy load heavy pages.

Avoid unnecessary re-renders.

---

# Accessibility

Buttons must have labels.

Forms must be keyboard accessible.

Inputs must have labels.

Semantic HTML is mandatory.

---

# Error Handling

Handle every async error.

Show toast messages.

Show loading states.

Show empty states.

Show error states.

---

# Financial Rules

Currency formatting must be reusable.

Date formatting must use date-fns.

Financial calculations must be isolated inside utility functions.

Never perform calculations directly inside components.

---

# Charts

Always use Recharts.

Charts must be responsive.

Never hardcode chart data.

---

# Quality

Always produce production-ready code.

Prefer maintainability over clever code.

Never sacrifice readability.

Think before generating code.