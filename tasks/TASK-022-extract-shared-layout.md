# TASK-022: Extract Shared Layout Logic Into a Single `LibraryLayout` Component

## Summary
`src/layout/layoutWithHeader.jsx` and `src/layout/layoutWithHeaderAndFooter.jsx` are near-identical. Both:
- Fetch `library` data via `useGetLibraryQuery`.
- Wrap children in `<LibraryContext.Provider>`.
- Switch between `<AppHeader>` and `<LibraryHeader>` based on whether a library is loaded.
- Render an `<AppShell>` with `<AppShell.Header>` and `<AppShell.Main>`.

The only difference is the optional `<AppFooter />`. This duplication means any change to header logic, shell padding, or context shape has to be made in two places.

## Proposed Refactor

Create `src/layout/libraryLayout.jsx`:

```jsx
const LibraryLayout = ({ showFooter = false }) => {
    const { libraryId } = useParams();
    const { data: library } = useGetLibraryQuery({ libraryId }, { skip: !libraryId });

    return (
        <LibraryContext.Provider value={{ libraryId, library }}>
            <AppShell>
                <AppShell.Header>
                    {libraryId && library ? <LibraryHeader library={library} /> : <AppHeader />}
                </AppShell.Header>
                <AppShell.Main pt={rem(60)} pb={showFooter ? 'var(--mantine-spacing-md)' : 0} className="pageBackground">
                    <Outlet />
                </AppShell.Main>
                {showFooter && <AppFooter />}
            </AppShell>
        </LibraryContext.Provider>
    );
};
```

Then simplify:
```jsx
// layoutWithHeader.jsx
export default () => <LibraryLayout />;

// layoutWithHeaderAndFooter.jsx
export default () => <LibraryLayout showFooter />;
```

## Steps
1. Fix the typo `className="pageBackgound"` → `className="pageBackground"` (and update the CSS class name).
2. Create `src/layout/libraryLayout.jsx` with the merged logic.
3. Reduce `layoutWithHeader.jsx` and `layoutWithHeaderAndFooter.jsx` to thin wrappers.
4. Verify that `<Outlet>` context (LibraryContext) is still available in all child routes.

## Acceptance Criteria
- [ ] The library fetch and context provision exist in exactly one component.
- [ ] Both layout variants (`with` / `without` footer) still work correctly.
- [ ] The CSS typo `pageBackgound` is corrected.
- [ ] `npm run build` and `npm run lint` pass.

## Priority
**Medium** — reduces duplication and future maintenance burden.
