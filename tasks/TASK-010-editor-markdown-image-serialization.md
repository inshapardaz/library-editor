# TASK-010: Implement Markdown Image Serialization with Width and Height

## Summary
`src/components/editor/transformers/markdownImageTransformer.jsx` line 10 has:
```js
// TODO: support serialziation of images with width and height
```
When a user sets an explicit width/height on an image node and then exports as Markdown, the dimensions are lost. On re-import the image reverts to its natural size, breaking the authored layout.

## Steps
1. Review the `markdownImageTransformer` export handler to see how image nodes are currently serialised.
2. Extend the Markdown export to include width/height as HTML attributes or as extended Markdown syntax (e.g. `![alt](url){width=300 height=200}`).
3. Extend the import/parse side to read those attributes back and apply them to the `ImageNode`.
4. Write a test (or manual test plan) that round-trips an image with explicit dimensions through Markdown export → import.

## Acceptance Criteria
- [ ] Exporting a page containing a sized image to Markdown preserves width and height.
- [ ] Importing that Markdown back into the editor restores the image at the saved dimensions.
- [ ] The `// TODO` comment is removed.
- [ ] No regression in standard Markdown image import/export.

## Files to Change
- `src/components/editor/transformers/markdownImageTransformer.jsx`

## Priority
**Medium** — editor feature completeness.
