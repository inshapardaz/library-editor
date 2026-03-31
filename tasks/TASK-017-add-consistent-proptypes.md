# TASK-017: Add PropTypes Consistently Across All Components

## Summary
PropTypes are defined in some components (e.g. `batchActionDrawer.jsx`, `error.jsx`, `pageHeader.jsx`) but are absent from the majority of components and pages. Consistent PropTypes validate the component contracts at runtime in development and serve as inline documentation.

## Approach
1. Run `npm run lint` — the `react/prop-types` ESLint rule (enabled via `react.configs.recommended`) will flag all components with missing PropTypes.
2. Work through each flagged component and add `ComponentName.propTypes = { … }` declarations.
3. If the team prefers TypeScript over runtime PropTypes, consider TASK-018 (TypeScript migration) instead and skip this task.

## High-Priority Components to Address
- All components in `src/components/books/`
- All components in `src/components/authors/`
- All components in `src/components/periodicals/`
- Page components in `src/pages/`
- Shared components: `layoutToggle.jsx`, `sortMenu.jsx`, `dataView.jsx`

## Acceptance Criteria
- [ ] `npm run lint` reports zero `react/prop-types` violations.
- [ ] No existing PropType declarations are removed or weakened.

## Files to Change
- Majority of `src/components/**/*.jsx` and `src/pages/**/*.jsx`

## Priority
**Low** — developer experience / documentation.
