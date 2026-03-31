# TASK-029: Create a `usePagedData` Custom Hook for List Pages

## Summary
Every list page in the application follows the same pattern:
1. Read `pageNumber`, `pageSize`, `query`, sort/filter params from `useSearchParams`.
2. Call an RTK Query `useGet*Query` hook.
3. Handle `isLoading`, `isFetching`, `error`, and `data` states.
4. Build a new URL with `updateLinkTo*` when the user changes a filter or page.
5. Navigate to the new URL with `useNavigate`.

This pattern is repeated in: `BooksPage`, `AuthorsPage`, `PeriodicalsPage`, `SeriesListPage`, `WritingsPage`, `PoetriesPage`, and more — at least 8 pages.

## Proposed Hook

```js
// src/hooks/useListPageParams.js
import { useSearchParams, useNavigate } from 'react-router-dom';

/**
 * Reads search params and returns helpers for updating them.
 * @param {Object} defaults - Default values for each param key.
 * @returns {{ params, setParam, setParams }}
 */
export const useListPageParams = (defaults = {}) => {
    const [searchParams, setSearchParams] = useSearchParams();
    const navigate = useNavigate();

    const params = Object.fromEntries(
        Object.entries(defaults).map(([key, def]) => [
            key,
            searchParams.get(key) ?? def,
        ])
    );

    const setParam = (key, value) => {
        const next = new URLSearchParams(searchParams);
        if (value === null || value === undefined || value === '') {
            next.delete(key);
        } else {
            next.set(key, String(value));
        }
        // Reset to page 1 when any filter changes (not pageNumber itself)
        if (key !== 'pageNumber') next.set('pageNumber', '1');
        navigate(`?${next.toString()}`, { replace: true });
    };

    const setParams = (updates) => {
        const next = new URLSearchParams(searchParams);
        Object.entries(updates).forEach(([key, value]) => {
            if (value === null || value === undefined || value === '') next.delete(key);
            else next.set(key, String(value));
        });
        navigate(`?${next.toString()}`, { replace: true });
    };

    return { params, setParam, setParams };
};
```

## Steps
1. Create `src/hooks/useListPageParams.js`.
2. Refactor `BooksPage` to use the hook as a proof-of-concept.
3. Migrate other list pages incrementally.
4. Remove the per-page `useState` + `useSearchParams` boilerplate that the hook replaces.
5. Export from `src/hooks/index.js`.

## Acceptance Criteria
- [ ] `useListPageParams` hook exists and is exported.
- [ ] At least `BooksPage` and `AuthorsPage` use it.
- [ ] Pagination, sorting, and filtering still work correctly.
- [ ] All 15+ `updateLinkTo*` functions can eventually be replaced by `setParams` calls (tracked in TASK-021).

## Priority
**Medium** — significantly reduces boilerplate in list pages.
