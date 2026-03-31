# TASK-028: Create a Generic `buildQueryParams` Helper for API Slices

## Summary
Every RTK Query API slice (`books.api.js`, `issueArticles.api.js`, `periodicals.api.js`, etc.) builds query strings using identical repetitive `if (x) { queryVal += ... }` patterns. This is error-prone (wrong parameter names, copy-paste mistakes), hard to read, and scattered across multiple files.

## Example of Current Duplication

`books.api.js` — `getBooks`:
```js
let queryVal = query ? `&query=${query}` : "";
if (author) queryVal += `&authorId=${author}`;
if (category) queryVal += `&categoryId=${category}`;
if (series) queryVal += `&seriesId=${series}`;
// ... 6 more conditionals
```

`issueArticles.api.js` — `getIssueArticles`:
```js
let queryVal = query ? `&query=${query}` : "";
if (author) queryVal += `&authorId=${author}`;
// ... nearly identical block
```

## Proposed Utility

```js
// src/utils/queryParams.js  (or extend the existing util)
/**
 * Builds a URLSearchParams string from a key→value map.
 * Entries with null / undefined / '' values are omitted.
 * Boolean `true` is serialised as "true".
 */
export const buildQueryString = (params) => {
    const sp = new URLSearchParams();
    Object.entries(params).forEach(([key, val]) => {
        if (val !== null && val !== undefined && val !== '') {
            sp.append(key, String(val));
        }
    });
    const qs = sp.toString();
    return qs ? `?${qs}` : '';
};
```

### Usage in an API slice
```js
query: ({ libraryId, query, author, category, series, sortBy, sortDirection,
          favorite, read, status, pageNumber = 1, pageSize = 12 }) => ({
    url: `/libraries/${libraryId}/books${buildQueryString({
        pageNumber, pageSize, query, authorId: author,
        categoryId: category, seriesId: series, sortBy,
        sortDirection, favorite: favorite || undefined,
        read: read ?? undefined, status,
    })}`,
    method: 'get',
}),
```

## Steps
1. Create `buildQueryString` in `src/utils/queryParams.js`.
2. Replace the query-string building in at least `books.api.js`, `issueArticles.api.js`, `periodicals.api.js`, and `authors.api.js`.
3. Verify all API calls still include the correct parameters.

## Acceptance Criteria
- [ ] `buildQueryString` exists and is unit-tested (can be a plain Node/Vitest test).
- [ ] At least four API slices use it.
- [ ] No manual `if (x) queryVal +=` patterns remain in migrated slices.
- [ ] All list pages still filter, sort, and paginate correctly.

## Priority
**Medium** — reduces duplication, prevents parameter-name bugs across API slices.
