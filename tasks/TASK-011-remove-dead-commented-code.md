# TASK-011: Remove Dead Commented-Out Code

## Summary
Several source files contain commented-out import statements and dead code blocks that should be cleaned up. These add noise and confuse future readers about intent.

## Inventory

| File | Dead Code |
|---|---|
| `src/App.jsx` | `// import { Helmet, HelmetProvider }` and the associated JSX block (tracked separately in TASK-007 if being re-enabled, otherwise delete) |
| `src/utils/notifications.js` | Commented icon import and icon props (tracked in TASK-006 if being re-enabled) |
| `src/components/writings/writingsList.jsx` | `// import WritingDeleteButton from './writingDeleteButton';` |
| `src/components/poetry/poetryList.jsx` | `// import WritingDeleteButton from './writingDeleteButton';` (wrong component name for poetry context) |
| `src/pages/libraries/index.jsx` | `// import { useTranslation } from "react-i18next";` |
| `src/i18n/wordLists/en.js` | `// console.log(insertQuery);` near end of file |
| `src/i18n/wordLists/ur.js` | `// console.log(insertQuery);` near end of file |
| `src/i18n/index.js` | `// debug: true,` |

## Notes
- For `writingsList.jsx` and `poetryList.jsx`: confirm whether `WritingDeleteButton` / `PoetryDeleteButton` should be wired up (see TASK-017 on delete buttons) before removing.
- Coordinate with TASK-006 and TASK-007 before touching `App.jsx` and `notifications.js`.

## Acceptance Criteria
- [ ] All identified dead-code comments are removed (or the feature is re-enabled as a separate task).
- [ ] `npm run lint` and `npm run build` pass cleanly.

## Priority
**Low** — code hygiene.
