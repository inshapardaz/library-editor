# TASK-020: Split `utils/index.js` Into Focused Modules

## Summary
`src/utils/index.js` is a 1132-line barrel file that mixes four completely unrelated concerns. It is hard to navigate, impossible to tree-shake effectively, and any change risks unintended side-effects.

## Current Concerns Mixed Into One File

| Lines | Concern |
|---|---|
| 1–440 | URL query-string builders (`updateLinkTo*`) |
| 440–615 | Batch request processor (`processMultipleRequests`) |
| 615–730 | Placeholder image exports and legacy URL builders (`buildLinkTo*`) |
| 730–1132 | PDF utilities (`loadPdfPage`, `downloadPdf`, `downloadFile`, `dataURItoBlob`, `getTitlePage`) |

There is also a dead `parseReadFilter` function (line ~640) that is never called.

## Proposed Module Split

```
src/utils/
  index.js              ← re-exports everything (backward-compat shim, can be retired later)
  queryParams.js        ← all updateLinkTo* + buildLinkTo* URL builders
  placeholders.js       ← placeholder image paths + setDefault*Image helpers
  pdf.js                ← already exists; absorb loadPdfPage, downloadPdf, downloadFile, dataURItoBlob, getTitlePage
  batchRequests.js      ← processMultipleRequests
```

## Steps
1. Create each new module and move the relevant exports into it.
2. Update `src/utils/index.js` to re-export everything for backward compatibility during migration.
3. Update all direct imports across the codebase that use named imports from `@/utils` to point to the new focused module (use IDE "Find all references" or `grep -r "from '@/utils'"` to find callers).
4. Remove the dead `parseReadFilter` function.
5. Once all consumers are updated, remove the re-export shim.

## Acceptance Criteria
- [ ] Each new module contains only a single concern.
- [ ] No breaking change — all existing imports continue to resolve.
- [ ] Dead `parseReadFilter` is deleted.
- [ ] `npm run build` and `npm run lint` pass cleanly.

## Priority
**High** — foundational code organisation that unblocks further refactors.
