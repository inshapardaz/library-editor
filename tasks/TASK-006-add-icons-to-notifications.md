# TASK-006: Add Icons to Toast Notifications

## Summary
`src/utils/notifications.js` has commented-out icon imports and icon props for all four notification types (error, success, warning, info). Adding icons improves visual clarity, especially for users who are colour-blind.

## Current State
```js
// import { IconError, IconSuccess, IconWarning, IconInfo } from '@/components/icons';
// icon: (<IconError />),
```

## Steps
1. Confirm `IconError`, `IconSuccess`, `IconWarning`, `IconInfo` exist in `src/components/icons.jsx` (add them if missing using `@iconify-icon/react`).
2. Uncomment the import and the `icon` property in each notification helper (`error`, `success`, `warning`, `info`).
3. Verify notifications render with icons in the app.

## Acceptance Criteria
- [ ] All four notification helpers (`error`, `success`, `warning`, `info`) render a matching icon.
- [ ] Icon components exist and are exported from `src/components/icons.jsx`.
- [ ] No dead commented-out code remains in `notifications.js`.

## Files to Change
- `src/utils/notifications.js`
- `src/components/icons.jsx` (if icons are missing)

## Priority
**Low** — UX improvement.
