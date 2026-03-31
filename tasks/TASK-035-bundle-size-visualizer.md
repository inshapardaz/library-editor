# TASK-035: Add Bundle Size Tracking with vite-bundle-visualizer

## Summary
The roadmap's Milestone 4 risk register mentions verifying the build output after code splitting (TASK-027). Currently there is no visibility into what is in the production bundle, how large each chunk is, or which dependencies dominate. `rollup-plugin-visualizer` (the standard Vite bundle visualizer) generates an interactive treemap that makes this immediately visible.

## Why This Matters
- `pdfjs-dist` is ~3 MB — it needs to be confirmed absent from the main chunk after TASK-027.
- `lexical` and its plugins are ~500 KB — same concern.
- Without this tool, the only way to check is to manually inspect `dist/` file sizes.

## Steps

### 1. Install
```bash
npm install --save-dev rollup-plugin-visualizer
```

### 2. Add to `vite.config.js`
```js
import { visualizer } from 'rollup-plugin-visualizer';

export default defineConfig({
    plugins: [
        react(),
        visualizer({
            open: false,               // set to true to auto-open after build
            filename: 'dist/stats.html',
            gzipSize: true,
            brotliSize: true,
        }),
    ],
    // ...
});
```

### 3. Add npm script
```json
"build:analyze": "vite build && open dist/stats.html"
```

### 4. Add `dist/stats.html` to `.gitignore`
The generated file should not be committed.

### 5. Use it
Run `npm run build:analyze` and verify:
- Before TASK-027: `pdfjs-dist` appears in the main chunk.
- After TASK-027: `pdfjs-dist` and Lexical appear only in their respective lazy chunks.

## Acceptance Criteria
- [ ] `rollup-plugin-visualizer` is installed as a dev dependency.
- [ ] `npm run build:analyze` produces `dist/stats.html` and opens a treemap.
- [ ] `dist/stats.html` is in `.gitignore`.
- [ ] The treemap is used to verify TASK-027 code splitting correctness before that PR merges.

## Files to Change
- `package.json`
- `vite.config.js`
- `.gitignore`

## Dependencies
- Run before or alongside TASK-027 (code splitting).

## Priority
**Medium** — tooling to validate Milestone 4 performance claims.
