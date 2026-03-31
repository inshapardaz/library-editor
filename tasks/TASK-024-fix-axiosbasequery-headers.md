# TASK-024: Fix `axiosBaseQuery` to Forward Custom Request Headers

## Summary
`src/utils/axiosBaseQuery.js` accepts a query configuration object `{ url, method, data, params }` but does **not** include `headers` in the destructuring or in the Axios call. Several RTK Query endpoints define custom headers that are silently dropped.

## Evidence

`books.api.js` — `getChapterContents`:
```js
query: ({ libraryId, bookId, chapterNumber, language }) => ({
    url: `...`,
    method: "get",
    headers: {
        "Accept-Language": language || "en-US",  // ← silently ignored
    },
}),
```

`books.api.js` — `updateBookPageImage`, `createBookPageWithImage`:
```js
headers: {
    "content-type": "multipart/form-data",  // ← silently ignored
},
```

The multipart headers are still somewhat handled by Axios/FormData auto-detection, but `Accept-Language` headers for language-specific content fetching are genuinely lost.

## Fix

```js
// axiosBaseQuery.js
const axiosBaseQuery =
    ({ baseUrl } = { baseUrl: API_URL }) =>
        async ({ url, method, data, params, headers }) => {  // ← add headers
            try {
                const result = await axiosPrivate({
                    url: url.startsWith("http") ? url : baseUrl + url,
                    method,
                    data,
                    params,
                    headers,  // ← forward to Axios
                });
                return { data: result.data };
            } catch (axiosError) {
                return {
                    error: {
                        status: axiosError.response?.status,
                        data: axiosError.response?.data || axiosError.message,
                    },
                };
            }
        };
```

## Acceptance Criteria
- [ ] `axiosBaseQuery` accepts and forwards a `headers` field.
- [ ] Chapter content API calls include the correct `Accept-Language` header.
- [ ] File upload endpoints work correctly (no regression).
- [ ] `var result` is changed to `const result` (use of `var` in the current code is a secondary hygiene fix).

## Priority
**High** — silent data correctness bug affecting multi-language content retrieval.
