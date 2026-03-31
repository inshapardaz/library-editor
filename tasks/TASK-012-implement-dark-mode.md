# TASK-012: Implement Dark Mode Support

## Summary
`src/store/slices/uiSlice.js` stores a `mode` value (`'light'` / `'dark'`) and exposes `toggleUiMode` and `setUiMode` actions, but `src/App.jsx` never passes this value to Mantine's `MantineProvider`. As a result the dark/light toggle has no visual effect.

## Current State
`App.jsx`:
```jsx
const theme = createTheme({ scale: 0.9 });
// ...
<MantineProvider theme={theme}>
```
The `mode` from the Redux store is never read here.

## Steps
1. In `App.jsx`, read `mode` from the store:
   ```jsx
   const mode = useSelector(state => state.ui.mode);
   ```
2. Pass it to `MantineProvider`:
   ```jsx
   <MantineProvider theme={theme} defaultColorScheme={mode} colorScheme={mode}>
   ```
   Use `ColorSchemeScript` if SSR is ever added.
3. Ensure the `<html>` `data-mantine-color-scheme` attribute is updated on toggle (Mantine v7 handles this automatically via `MantineProvider`).
4. Add a toggle button in the app header (if one does not already exist), wired to `dispatch(toggleUiMode())`.
5. Verify that the persisted preference (`localStorage.uiMode`) is loaded on page refresh.

## Acceptance Criteria
- [ ] Toggling dark/light mode changes the Mantine colour scheme immediately.
- [ ] The selected mode is persisted in `localStorage` and restored on page reload.
- [ ] All major pages are usable in dark mode (no white-on-white or black-on-black issues).

## Files to Change
- `src/App.jsx`
- `src/layout/layoutWithHeader.jsx` or the header component (for the toggle button)

## Priority
**Medium** — expected feature.
