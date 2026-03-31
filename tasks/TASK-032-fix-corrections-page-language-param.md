# TASK-032: Fix `updateLinkToCorrectionsPage` Parameter Bug

## Summary
`src/utils/index.js` contains a copy-paste bug in the `updateLinkToCorrectionsPage` function. The `language` parameter is stored under the key `"year"` in the URL search params instead of `"language"`. This means the corrections page never receives the language filter from the URL, silently showing unfiltered results regardless of which language the user selected.

## Evidence

```js
// src/utils/index.js — updateLinkToCorrectionsPage
if (language) {
    searchParams.set("year", language);   // BUG — should be "language"
}
```

## Impact
- Any navigation to or from the corrections page that includes a language filter silently drops it.
- The language filter cannot be bookmarked or shared via URL.
- If the corrections page also reads a `year` param elsewhere, this could produce an incorrect filter.

## Fix

```js
if (language) {
    searchParams.set("language", language);   // ← corrected key
}
```

## Steps
1. Apply the one-line fix above in `src/utils/index.js`.
2. Check `src/pages/tools/correctionsPage.jsx` to confirm it reads `searchParams.get("language")` (not `searchParams.get("year")`).
3. Add a unit test (via TASK-030 Vitest setup) that asserts `updateLinkToCorrectionsPage` sets the `language` param correctly.
4. Manually verify the corrections page filters by language.

## Acceptance Criteria
- [ ] `updateLinkToCorrectionsPage` sets `searchParams.set("language", language)`.
- [ ] Selecting a language filter on the corrections page is reflected in the URL `?language=…`.
- [ ] Navigating to a URL with `?language=…` applies the correct filter.
- [ ] A unit test covers this function.

## Files to Change
- `src/utils/index.js`
- `tests/unit/queryParams.test.js` (new, via TASK-030)

## Priority
**High** — silent data bug in a user-facing filter.
