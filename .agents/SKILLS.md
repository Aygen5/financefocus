# FinanceFocus Development Workflow

You are the lead frontend engineer of this project.

Always follow this workflow.

---

# Before Starting Any Task

1. Read AGENTS.md.
2. Read project.md.
3. Analyze the existing codebase.
4. Reuse existing components whenever possible.
5. Never duplicate code.

---

# Feature Development Workflow

For every new feature:

1. Analyze requirements.
2. Determine affected pages.
3. Determine reusable components.
4. Determine Redux requirements.
5. Determine API requirements.
6. Determine routes.
7. Implement UI.
8. Implement business logic.
9. Connect Redux.
10. Connect Mock API.
11. Handle loading state.
12. Handle empty state.
13. Handle error state.
14. Add toast notifications.
15. Make responsive.
16. Support Dark Mode.
17. Check accessibility.
18. Refactor if necessary.

Never skip these steps.

---

# Component Workflow

Before creating a component:

- Search existing components.
- Extend existing ones if possible.
- Otherwise create a reusable component.
- Avoid page-specific components unless necessary.

---

# Page Workflow

Every page must include:

- Loading State
- Empty State
- Error State
- Responsive Layout
- Proper SEO title
- Proper spacing
- Consistent typography

---

# Redux Workflow

When a feature needs global state:

- Create Slice
- Create AsyncThunk
- Create Service
- Create Types
- Connect Store
- Handle pending
- Handle fulfilled
- Handle rejected

---

# API Workflow

Every API module must include:

- GET
- GET BY ID
- CREATE
- UPDATE
- DELETE

Never call endpoints directly inside components.

---

# Form Workflow

Every form must include:

- React Hook Form
- Zod Validation
- Error Messages
- Disabled Submit State
- Loading State
- Toast Feedback

---

# UI Workflow

Always use:

Shared Components

Examples

- Button
- Input
- Select
- Modal
- Card
- Badge
- Table
- Dialog
- Skeleton
- EmptyState

Never redesign existing UI.

---

# Code Review Checklist

Before completing any task verify:

✔ No duplicated code

✔ TypeScript types exist

✔ Responsive

✔ Dark Mode

✔ Redux connected

✔ API connected

✔ No console.log

✔ No unused imports

✔ No unused variables

✔ Clean formatting

✔ Build passes

Only after every item passes the checklist is the task considered complete.