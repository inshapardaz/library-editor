# TASK-034: Create CONTRIBUTING.md Developer Onboarding Guide

## Summary
There is no `CONTRIBUTING.md` or developer onboarding documentation. A new team member who clones the repository has to infer the commit convention, branch strategy, code patterns, review process, and local setup from reading the source. This creates friction and leads to inconsistent contributions.

## Content to Cover

### 1. Prerequisites
- Node 22 LTS
- Docker (optional, for container testing)
- VS Code recommended extensions (ESLint, Playwright, Mantine Snippets)

### 2. Local Development Setup
```bash
git clone https://github.com/inshapardaz/library-editor.git
cd library-editor
npm install
npm start                   # dev server at http://localhost:4300
# API expected at http://localhost:4000 (see src/config.js)
```

### 3. Running Tests
```bash
npm run test:unit            # Vitest unit tests (fast)
npm run test                 # Playwright E2E (requires dev server)
npm run test:debug           # Playwright UI mode
```

### 4. Code Conventions
- **State / data fetching**: Always use RTK Query hooks. Do not add raw Axios calls to components.
- **URL parameters**: Use `useListPageParams` hook (TASK-029). Do not access `useSearchParams` directly in list pages.
- **Library context**: Use `useLibrary()` hook (TASK-023). Do not access `LibraryContext` directly.
- **Translations**: Add keys to **both** `src/i18n/en.js` and `src/i18n/ur.js`.
- **Styling**: Use Mantine components and CSS Modules. Avoid inline styles. Avoid hardcoded `left`/`right` — use logical CSS properties for RTL support.
- **Utilities**: Place URL builders in `src/utils/queryParams.js`, PDF utils in `src/utils/pdf.js`, etc. (see TASK-020 module layout).

### 5. Branch and PR Strategy
- Branch naming: `feature/<task-id>-short-description`, `fix/<task-id>-description`
- All PRs require CI to pass (lint + unit tests + E2E + Docker build).
- Reference the task ticket in the PR description.

### 6. Internationalization
The app supports English (LTR) and Urdu (RTL). When adding a new page or component:
- Do not hardcode UI strings — use `const { t } = useTranslation()`.
- Test layout in both LTR and RTL by switching the language toggle in the app header.

### 7. Updating the Roadmap
When a task ticket is completed, update its status and note the completion milestone in `ROADMAP.md`.

## Acceptance Criteria
- [ ] `CONTRIBUTING.md` exists at the repo root.
- [ ] It covers all 7 sections above.
- [ ] A new developer can clone and run the app by following only the instructions in this file.
- [ ] `AGENT.MD` links to `CONTRIBUTING.md` for developer workflow details.

## Files to Change
- `CONTRIBUTING.md` (new)
- `AGENT.MD` (add reference link)
- `README.md` (add reference link)

## Priority
**Medium** — developer experience, scales the team.
