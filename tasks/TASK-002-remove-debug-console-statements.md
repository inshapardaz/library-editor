# TASK-002: Remove Debug console.debug Statements from config.js

## Summary
`src/config.js` contains five `console.debug` calls that log the detected runtime environment and API host to the browser console. These are visible in production and expose internal configuration details.

## Problem
```js
console.debug('--------------------------------------------------')
console.debug('window.location.host:', window.location.host);
// ... and three more
console.debug('--------------------------------------------------')
```

These were likely added during development and should be removed or gated behind a `NODE_ENV` check before reaching production.

## Acceptance Criteria
- [ ] All `console.debug` calls are removed from `src/config.js`.
- [ ] The three environment-detection branches still work correctly.
- [ ] No runtime errors after the change.

## Files to Change
- `src/config.js`

## Priority
**Medium** — information disclosure / code hygiene.
