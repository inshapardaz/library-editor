# TASK-023: Add `useLibrary()` Custom Hook for Context Consumption

## Summary
`LibraryContext` in `src/contexts/index.js` is just a raw `createContext()` call with no default value and no ergonomic wrapper. Every consumer must:
1. Import `useContext` from React.
2. Import `LibraryContext` from `@/contexts`.
3. Destructure `{ libraryId, library }` manually — with no null safety.

A `useLibrary()` hook encapsulates this, provides a descriptive error if used outside the provider, and makes the API surface explicit.

## Proposed Implementation

```js
// src/hooks/useLibrary.js
import { useContext } from 'react';
import { LibraryContext } from '@/contexts';

export const useLibrary = () => {
    const context = useContext(LibraryContext);
    if (context === undefined) {
        throw new Error('useLibrary must be used within a LibraryContext.Provider');
    }
    return context; // { libraryId, library }
};
```

## Steps
1. Create `src/hooks/useLibrary.js` with the implementation above.
2. Find all `useContext(LibraryContext)` usages:
   ```bash
   grep -rn "useContext(LibraryContext)" src/
   ```
3. Replace each with `const { libraryId, library } = useLibrary();` and remove the now-unused `useContext` + `LibraryContext` imports.
4. Export `useLibrary` from `src/hooks/index.js` (create the index if it doesn't exist).

## Acceptance Criteria
- [ ] `src/hooks/useLibrary.js` exists and is exported from `src/hooks/`.
- [ ] No direct `useContext(LibraryContext)` calls remain in component files.
- [ ] Accessing the hook outside a provider throws a descriptive error in development.
- [ ] `npm run build` and `npm run lint` pass.

## Priority
**Medium** — developer experience, prevents silent `undefined` bugs.
