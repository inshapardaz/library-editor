# TASK-030: Add Vitest Unit Testing Framework

## Summary
The project has Playwright for E2E testing but no unit test framework. Pure utility functions, hooks, model helpers, and RTK Query transformations have no fast-feedback test path. Every change to `buildQueryString`, URL builders, `parseResponse`, or custom hooks requires a full browser E2E run to verify.

## Why Vitest (not Jest)
The project uses Vite. Vitest shares the same config, understands the `@/` alias, runs in under 1 second for most suites, and works natively with ES modules — no transform setup required.

## Steps

### 1. Install
```bash
npm install --save-dev vitest @vitest/coverage-v8
```

### 2. Add to `vite.config.js`
```js
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
    plugins: [react()],
    resolve: { alias: [{ find: '@', replacement: fileURLToPath(new URL('./src', import.meta.url)) }] },
    test: {
        environment: 'jsdom',
        globals: true,
        coverage: { provider: 'v8', reporter: ['text', 'html'] },
    },
})
```

### 3. Add scripts to `package.json`
```json
"test:unit": "vitest run",
"test:unit:watch": "vitest",
"test:unit:coverage": "vitest run --coverage"
```

### 4. Seed with first unit tests
Write tests for the highest-value pure functions as a proof-of-concept:
- `buildQueryString` (from TASK-028) — verify params are appended, null values omitted, empty string clears the key.
- `parseResponse` (`src/utils/parseResponse.js`) — verify HATEOAS `links` array is converted to a keyed object.
- `processMultipleRequests` (`src/utils/index.js`) — verify status transitions and error handling.

### 5. Update CI (TASK-014)
Add `npm run test:unit` as a step before the Playwright step in the GitHub Actions workflow.

## Acceptance Criteria
- [ ] `npm run test:unit` runs and reports results without starting a browser.
- [ ] At least 3 unit test files exist covering the functions listed above.
- [ ] `npm run test:unit:coverage` generates an HTML coverage report.
- [ ] CI runs unit tests before E2E tests.

## Files to Change
- `package.json`
- `vite.config.js`
- `tests/unit/*.test.js` (new — suggest `tests/unit/` to separate from Playwright `tests/specs/`)

## Dependencies
- Coordinate with TASK-014 (CI pipeline) and TASK-028 (`buildQueryString`).

## Priority
**High** — unit tests give instant feedback on utility refactors in Milestones 3 & 4.
