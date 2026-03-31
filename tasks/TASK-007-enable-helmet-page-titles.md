# TASK-007: Enable Dynamic Page Titles via react-helmet-async

## Summary
`src/App.jsx` has a fully commented-out `react-helmet-async` integration (`HelmetProvider` + `Helmet`). Dynamic `<title>` tags improve SEO and browser tab usability. The package `react-helmet-async` is not currently in `package.json` so it needs to be added.

## Current State
```jsx
// import { Helmet, HelmetProvider } from 'react-helmet-async';
// <HelmetProvider>
//   <Helmet htmlAttributes={{ lang: currentLocal }}>
//     <title>{t('app')}</title>
//   </Helmet>
```

## Steps
1. Install: `npm install react-helmet-async`.
2. Uncomment the `HelmetProvider` and root `Helmet` in `App.jsx`.
3. Add page-specific `<Helmet><title>…</title></Helmet>` in key page components (Books, Periodicals, Authors, etc.) using the appropriate i18n key.
4. Ensure the `lang` attribute on `<html>` is set correctly for both `en` and `ur` locales (it may already be handled by `uiSlice`, verify no duplication).

## Acceptance Criteria
- [ ] Browser tab title changes when navigating between major pages.
- [ ] `<html lang="…">` reflects the selected locale.
- [ ] `react-helmet-async` is listed in `package.json` dependencies.

## Files to Change
- `package.json`
- `src/App.jsx`
- Key page components under `src/pages/`

## Priority
**Low** — SEO / UX.
