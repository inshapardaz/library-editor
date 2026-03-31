# TASK-031: Establish Lighthouse Performance Baseline and CI Budget

## Summary
Milestone 4 of the roadmap targets a measurable performance improvement. Without a baseline measurement today, there is no way to know if changes made by TASK-027 (code splitting) and TASK-008 (gzip) actually improve the score. This task captures the current state and enforces a budget in CI to prevent regressions.

## Steps

### 1. Capture current baseline
Run Lighthouse against the production URL and the local dev build:
```bash
npx lighthouse https://editor.nawishta.co.uk --output json --output-path=lighthouse-baseline.json
```
Record the following scores (0–100):
- **Performance**
- **Accessibility**
- **Best Practices**
- **SEO**

Document the baseline in `docs/performance-baseline.md`.

### 2. Add `@lhci/cli` to the project
```bash
npm install --save-dev @lhci/cli
```

Create `lighthouserc.js`:
```js
export default {
    ci: {
        collect: {
            url: ['http://localhost:4300'],
            startServerCommand: 'npm start',
        },
        assert: {
            assertions: {
                'categories:performance': ['warn', { minScore: 0.6 }],
                'categories:accessibility': ['error', { minScore: 0.8 }],
                'categories:best-practices': ['warn', { minScore: 0.8 }],
            },
        },
        upload: { target: 'temporary-public-storage' },
    },
};
```

### 3. Add to CI (TASK-014)
Add a `lighthouse` job to the GitHub Actions workflow that runs after the build job:
```yaml
- name: Run Lighthouse CI
  run: npx lhci autorun
```

### 4. After Milestone 4 ships
Re-run Lighthouse and compare scores against the baseline. Update `docs/performance-baseline.md` with the new scores and the delta.

## Acceptance Criteria
- [ ] `docs/performance-baseline.md` contains current Lighthouse scores.
- [ ] `lighthouserc.js` is committed with performance ≥ 60 and accessibility ≥ 80 budgets.
- [ ] CI enforces the budget on every PR (warns on performance, fails on accessibility).
- [ ] Post-Milestone 4 measurement shows improvement over baseline.

## Files to Change
- `package.json`
- `lighthouserc.js` (new)
- `docs/performance-baseline.md` (new)

## Dependencies
- TASK-001 (fix port) — Lighthouse needs a running dev server.
- TASK-014 (CI pipeline) — must exist before adding Lighthouse to CI.

## Priority
**Medium** — needed to validate the Milestone 4 performance work.
