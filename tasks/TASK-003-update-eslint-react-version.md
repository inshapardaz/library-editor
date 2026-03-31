# TASK-003: Update ESLint Settings React Version to 19

## Summary
`eslint.config.js` declares `settings: { react: { version: '18.3' } }` but the project uses React 19 (`"react": "^19.0.0"` in `package.json`). This can suppress or misfire lint rules that depend on the React version (e.g. deprecated API warnings).

## Problem
```js
settings: { react: { version: '18.3' } },
```
The recommended value is `'detect'` so ESLint automatically reads the installed version, or it should be set to `'19.0'`.

## Acceptance Criteria
- [ ] `settings.react.version` is set to `'detect'` (preferred) or `'19.0'`.
- [ ] `npm run lint` passes without new errors after the change.

## Files to Change
- `eslint.config.js`

## Priority
**Low** — tooling correctness.
