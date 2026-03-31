# TASK-026: Fix Dark Mode — Decouple Mantine State From Redux

## Summary
Dark mode is implemented with a split across two independent stores that can diverge, leading to the wrong colour scheme being applied on page reload.

## Current (Broken) State

`DarkModeToggle.jsx` correctly updates both stores on toggle:
```js
dispatch(setUiMode(newMode));   // Redux
setColorScheme(newMode);        // Mantine
```

But on **page load** `App.jsx` creates the theme without reading the persisted mode from either store or localStorage:
```jsx
const theme = createTheme({ scale: 0.9 });
// ...
<MantineProvider theme={theme}>   // ← no colorScheme prop
```

Mantine v7 persists color scheme in `localStorage` under `mantine-color-scheme-value`. Redux persists it under `uiMode` in `localStorage`. These two keys can diverge if one is cleared or updated without the other.

## Recommended Fix: Let Mantine Own the Colour Scheme

Mantine v7 handles persistence automatically via `localStorageManager`. Remove the Redux `mode` state entirely for this concern and rely solely on Mantine.

### Changes to `App.jsx`
```jsx
import { ColorSchemeScript, MantineProvider } from '@mantine/core';

// In <head> (index.html):
// <ColorSchemeScript defaultColorScheme="light" />

// In App.jsx:
<MantineProvider theme={theme} defaultColorScheme="light">
```

### Changes to `uiSlice.js`
- Remove `mode`, `toggleUiMode`, and `setUiMode` from the slice (they are now owned by Mantine).
- Keep `setLocale`, `readerFont`, `readerFontSize`, etc.

### Changes to `DarkModeToggle.jsx`
- Remove `dispatch(setUiMode(...))` — only call `setColorScheme(newMode)`.

### Changes to `index.html`
- Add `<ColorSchemeScript defaultColorScheme="light" />` inside `<head>` to prevent flash of wrong colour scheme on load.

## Alternative (Minimal Change)
If Redux `mode` must be kept (e.g. for SSR or testing), initialise Mantine from it:
```jsx
const mode = useSelector(state => state.ui.mode);
<MantineProvider theme={theme} defaultColorScheme={mode} colorScheme={mode}>
```
And remove Mantine's own localStorage persistence to avoid conflicts.

## Acceptance Criteria
- [ ] Hard-refreshing the page preserves the last selected dark/light mode.
- [ ] Toggling dark mode takes effect immediately.
- [ ] No flash of wrong colour scheme on initial load.
- [ ] There is exactly one source of truth for the colour scheme.

## Files to Change
- `src/App.jsx`
- `index.html`
- `src/store/slices/uiSlice.js`
- `src/components/layout/darkModeToggle.jsx`

## Priority
**High** — visible UX bug on every page load for users who prefer dark mode.
