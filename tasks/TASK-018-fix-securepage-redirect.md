# TASK-018: Fix SecurePage Hard Redirect to Use React Router

## Summary
`src/layout/securePage.jsx` redirects unauthenticated users with a hard `window.location.href` assignment. This breaks the browser history and causes a full page reload instead of a smooth client-side navigation. It also has a logic flaw: the check `!window.location.href.includes(MAIN_SITE)` was intended to avoid redirect loops but is brittle.

## Current Code
```jsx
useEffect(() => {
    if (userLoadStatus === 'succeeded' && !user && !window.location.href.includes(MAIN_SITE)) {
        window.location.href = `${MAIN_SITE}/account/login?returnUrl=${window.location.href}`
    }
}, [user, navigate, userLoadStatus])
```

## Problem
- `navigate` is imported but never used.
- `window.location.href` assignment discards SPA history and triggers a cross-origin full reload.
- The cross-origin redirect to `MAIN_SITE` is intentional (auth lives on a separate host), but the current URL check is unreliable.

## Proposed Fix
Since the login page is on a different origin (`MAIN_SITE`), a cross-origin redirect is unavoidable. However:
1. Remove the unused `navigate` import/variable.
2. Tighten the guard: check `userLoadStatus === 'succeeded'` and `user === null` only (the `MAIN_SITE` include-check is not necessary — re-renders after redirect will have a new `userLoadStatus`).
3. Add a short debounce or ensure the effect only fires once using a `ref` to avoid double-redirects.
4. Keep `window.location.href` for the cross-origin redirect since React Router cannot navigate to a different origin.

## Acceptance Criteria
- [ ] Unauthenticated users are reliably redirected to the login page exactly once.
- [ ] No `navigate` variable is declared but unused.
- [ ] The redirect includes the correct `returnUrl` query parameter.
- [ ] No redirect loop occurs after successful log-in.

## Files to Change
- `src/layout/securePage.jsx`

## Priority
**Medium** — auth flow correctness.
