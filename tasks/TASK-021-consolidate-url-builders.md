# TASK-021: Consolidate Legacy `buildLinkTo*` URL Builders

## Summary
`src/utils/index.js` contains two generations of URL-building functions that do the same thing:

- **Newer** (`updateLinkTo*`) — use `URLSearchParams`, correctly handle delete-on-empty, are the standard going forward.
- **Legacy** (`buildLinkTo*`) — use manual string concatenation, have subtle bugs (trailing `&` trimming), and accept positional arguments instead of a named-params object.

Both coexist, creating confusion about which style to use for new code.

## Inventory of Legacy Functions to Retire

```
buildLinkToAuthorsPage(location, page, pageSize, query, authorType)
buildLinkToCategoriesList(libraryId, page, pageSize, query)
buildLinkToBooksPagesPage(location, pageNumber, pageSize, statusFilter, ...)
```

## Steps
1. Find every call-site of the `buildLinkTo*` functions:
   ```bash
   grep -rn "buildLinkTo" src/
   ```
2. Replace each call with the equivalent `updateLinkTo*` function.
3. Delete the `buildLinkTo*` functions from `utils/index.js` (or the new `queryParams.js` module, as per TASK-020).
4. Consider creating a single shared helper:
   ```js
   export const buildSearchParams = (location, params) => {
       const sp = new URLSearchParams(location.search);
       Object.entries(params).forEach(([key, val]) => {
           if (val !== undefined && val !== null && val !== '') sp.set(key, val);
           else sp.delete(key);
       });
       return `${location.pathname}?${sp.toString()}`;
   };
   ```
   This would replace all 15+ `updateLinkTo*` functions with a single generic one.

## Acceptance Criteria
- [ ] All `buildLinkTo*` functions are deleted.
- [ ] All call-sites use `updateLinkTo*` or the new generic helper.
- [ ] No regression in pagination, filtering, or sorting in any list page.

## Priority
**Medium** — reduces duplication and fixes latent bugs in the legacy helpers.

## Dependencies
- Coordinate with TASK-020 (module split) — ideally done in the same PR.
