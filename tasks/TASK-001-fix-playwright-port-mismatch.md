# TASK-001: Fix Playwright Port Mismatch

## Summary
The Playwright configuration targets port `5173` (the default Vite dev port) but `vite.config.js` explicitly sets the dev server port to `4300`. This causes all E2E tests to fail when running against the local dev server.

## Problem
`playwright.config.js`:
```js
use: { baseURL: 'http://localhost:5173' },
webServer: { url: 'http://localhost:5173', command: 'npm start' }
```
`vite.config.js`:
```js
server: { port: 4300 }
```

The `webServer` check never succeeds at `5173`, so Playwright either times out waiting for the server or connects to nothing.

## Acceptance Criteria
- [ ] `playwright.config.js` `baseURL` and `webServer.url` are both updated to `http://localhost:4300`.
- [ ] `npm test` starts the dev server and runs all specs without port-related failures.

## Files to Change
- `playwright.config.js`

## Priority
**High** — blocks all E2E test runs locally.
