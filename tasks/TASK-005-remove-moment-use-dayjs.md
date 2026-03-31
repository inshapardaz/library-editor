# TASK-005: Remove moment.js — Use dayjs Exclusively

## Summary
Both `moment` (^2.30.1) and `dayjs` (^1.11.13) are listed as production dependencies. `moment` is in maintenance-only mode, is ~300 KB minified, and the project already imports `dayjs` via `@mantine/dates`. All `moment` usages should be migrated to `dayjs` and `moment` removed from `package.json`.

## Steps
1. Find all files that import from `'moment'`:
   ```bash
   grep -r "from 'moment'" src/
   ```
2. Replace each `moment(...)` call with the equivalent `dayjs(...)` call.
   - Formatting: `moment(x).format('...')` → `dayjs(x).format('...')`
   - Relative time: enable the `relativeTime` plugin in the dayjs init block in `src/i18n/index.js`.
3. Remove `moment` from `package.json` dependencies and run `npm install`.
4. Verify the build and all date-related UI elements still work.

## Acceptance Criteria
- [ ] No `import` of `moment` remains in `src/`.
- [ ] `moment` is absent from `package.json`.
- [ ] All date formatting and relative-time display works correctly.
- [ ] Bundle size is reduced.

## Files to Change
- `src/i18n/index.js` (imports moment today)
- Any other file found in step 1
- `package.json`

## Priority
**Medium** — bundle size, dependency hygiene.
