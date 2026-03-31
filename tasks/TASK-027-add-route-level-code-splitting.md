# TASK-027: Add Route-Level Code Splitting with React.lazy

## Summary
All routes in `src/router.jsx` are statically imported, causing the entire application (all pages) to be bundled into a single JavaScript chunk. Heavy pages like the book process page, PDF uploader, ebook reader, and the Lexical editor pull in large third-party libraries (pdfjs-dist, lexical) for every user on every route, including the home page.

## Evidence
`router.jsx` imports approximately 30 page components at the top level:
```js
import Pages from "@/pages";
// Pages.BookProcessPage, Pages.EBookReaderPage, etc. — all eagerly loaded
```

`package.json` lists `pdfjs-dist` (~3 MB unminified) and the entire Lexical suite (~500 KB) which are only needed on specific pages.

## Proposed Change

Convert to `React.lazy` + `Suspense`:

```jsx
import { lazy, Suspense } from 'react';
import { PageSkeleton } from '@/components/pageSkeleton';

const BookProcessPage  = lazy(() => import('@/pages/books/process'));
const BookUploadPage   = lazy(() => import('@/pages/books/upload'));
const ChapterEditorPage = lazy(() => import('@/pages/books/chapters/edit'));
// ... repeat for all pages

const Router = () => (
    <BrowserRouter>
        <Suspense fallback={<PageSkeleton />}>
            <Routes>
                {/* ... same routes but using the lazy components */}
            </Routes>
        </Suspense>
    </BrowserRouter>
);
```

## Priority Candidates for Lazy Loading (highest impact)
| Page | Heavy Dependency |
|---|---|
| `BookProcessPage` | `pdfjs-dist` |
| `BookUploadPage` | `pdfjs-dist` |
| `EBookReaderPage` | custom reader + fonts |
| `ChapterEditorPage` | Lexical |
| `BookPageEditPage` | Lexical |
| `IssuePageEditPage` | Lexical |

## Steps
1. Create a `PageSkeleton` fallback component (a full-height `Skeleton` or `Loader` centred on screen).
2. Convert `src/pages/index.js` to export lazy components, or convert `router.jsx` to use inline `lazy()` calls.
3. Wrap the `<Routes>` in `<Suspense fallback={<PageSkeleton />}>`.
4. Run `npm run build` and inspect the generated chunks to confirm splitting.

## Acceptance Criteria
- [ ] Initial bundle does not include `pdfjs-dist` or Lexical.
- [ ] Each heavy page loads its chunk on first navigation.
- [ ] A loading skeleton is shown while a chunk is downloading.
- [ ] `npm run build` produces multiple JS chunks in `dist/`.

## Priority
**High** — significant initial load performance improvement.
