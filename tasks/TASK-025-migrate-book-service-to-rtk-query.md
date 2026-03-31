# TASK-025: Migrate `domain/book.service.js` Into RTK Query Mutations

## Summary
`src/domain/book.service.js` exposes four functions (`addChapterContent`, `updateChapterContent`, `addIssueArticleContent`, `updateIssueArticleContent`) that make direct `axiosPrivate` calls, bypassing the RTK Query cache entirely.

This creates a parallel data-access layer with different error handling, loading state, and no automatic cache invalidation. After saving chapter content via these functions, the cached chapter data in RTK Query does not know it is stale.

## Problems
- Loading / error state must be manually managed with `useState` in each page that calls these functions.
- No cache invalidation — the chapter/article list in the UI can show stale status or text after an update.
- Inconsistent error handling compared to all other mutations.
- The functions are imported directly into page components, coupling pages to a non-Redux data layer.

## Migration Plan

### In `src/store/slices/books.api.js` add:
```js
addChapterContent: builder.mutation({
    query: ({ chapter, language, payload }) => ({
        url: `${chapter.links.add_content}?language=${language}`,
        method: 'POST',
        data: payload,
        headers: {
            'Content-Type': 'application/json',
            'Content-Language': language || 'en-US',
        },
    }),
    invalidatesTags: ['Chapter', 'Chapters'],
}),
updateChapterContent: builder.mutation({
    query: ({ chapterContent, language, payload }) => ({
        url: `${chapterContent.links.update}?language=${language}`,
        method: 'PUT',
        data: payload,
        headers: {
            'Content-Type': 'application/json',
            'Content-Language': language || 'en-US',
        },
    }),
    invalidatesTags: ['Chapter', 'Chapters'],
}),
```

### In `src/store/slices/issueArticles.api.js` add the equivalent mutations for `addIssueArticleContent` and `updateIssueArticleContent`.

### Steps
1. Add the four mutations above.
2. Export the generated hooks.
3. Update the chapter editor page and issue article editor page to use the hooks instead of `domain/book.service.js`.
4. Delete `src/domain/book.service.js` once all consumers are migrated.

## Acceptance Criteria
- [ ] `src/domain/book.service.js` is deleted.
- [ ] Chapter and issue article content saves go through RTK Query.
- [ ] Cache is automatically invalidated after a save (chapter list reflects updated status).
- [ ] Loading and error states are driven by the mutation hooks, not local `useState`.

## Priority
**High** — cache correctness and consistent data layer.
