# TASK-004: Upgrade Dockerfile Base Image from Node 18 to Node 22

## Summary
The `dockerfile` uses `node:18-alpine` as the build base. Node 18 reached end-of-life in April 2025. The project runs React 19 and Vite 6 which require Node ≥ 20. Node 22 is the current LTS.

## Problem
```dockerfile
FROM node:18-alpine AS build
```

Running `npm install` or `npm run build` against Node 18 with newer packages may produce deprecation warnings or subtle incompatibilities.

## Acceptance Criteria
- [ ] `dockerfile` build stage uses `node:22-alpine`.
- [ ] `npm install` and `npm run build` complete without errors inside the container.
- [ ] The resulting nginx image still serves the app correctly.

## Files to Change
- `dockerfile`

## Priority
**Medium** — security (EOL runtime) and compatibility.
