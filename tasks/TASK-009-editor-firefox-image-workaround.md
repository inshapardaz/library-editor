# TASK-009: Resolve Editor TODO — Firefox Image Drag Workaround

## Summary
`src/components/editor/nodes/imageNode/imageComponent.jsx` line 277 contains:
```js
// TODO This is just a temporary workaround for FF to behave like other browsers.
```
This workaround should be reviewed: either replace it with the proper fix, document why it is permanent, or remove it if Firefox has since adopted standard behaviour.

## Steps
1. Read the workaround code and identify what Firefox behaviour it addresses.
2. Test in the latest Firefox (current stable) to check if the issue still exists.
3. **If the bug is fixed in Firefox**: remove the workaround and the TODO comment.
4. **If the bug still exists**: replace the comment with a detailed explanation referencing the MDN/Firefox bug tracker issue so future developers understand the context.
5. **If a proper fix exists**: implement it and remove the workaround.

## Acceptance Criteria
- [ ] The `// TODO` comment is removed.
- [ ] Image dragging works correctly in both Chromium and Firefox.
- [ ] If the workaround must remain, a comment with a bug reference is added.

## Files to Change
- `src/components/editor/nodes/imageNode/imageComponent.jsx`

## Priority
**Low** — code quality / browser compatibility.
