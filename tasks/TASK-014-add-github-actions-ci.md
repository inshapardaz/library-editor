# TASK-014: Add GitHub Actions CI/CD Pipeline

## Summary
The repository has no continuous integration configuration. Adding a GitHub Actions workflow ensures that linting and E2E tests are run automatically on every pull request, and that a production Docker image is built and pushed on merge to `main`.

## Proposed Workflow File: `.github/workflows/ci.yml`

```yaml
name: CI

on:
  push:
    branches: [main]
  pull_request:
    branches: [main]

jobs:
  lint:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with: { node-version: 22, cache: npm }
      - run: npm ci
      - run: npm run lint

  test:
    runs-on: ubuntu-latest
    needs: lint
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with: { node-version: 22, cache: npm }
      - run: npm ci
      - run: npx playwright install --with-deps chromium
      - run: npm test
      - uses: actions/upload-artifact@v4
        if: failure()
        with:
          name: playwright-report
          path: playwright-report/

  docker:
    runs-on: ubuntu-latest
    needs: test
    if: github.ref == 'refs/heads/main'
    steps:
      - uses: actions/checkout@v4
      - uses: docker/build-push-action@v5
        with:
          push: false   # set to true with registry credentials
          tags: library-editor:latest
```

## Acceptance Criteria
- [ ] `.github/workflows/ci.yml` exists.
- [ ] PRs show lint and test status checks.
- [ ] Build job runs on `main` and produces a Docker image.
- [ ] Playwright report is uploaded as an artifact on test failure.

## Files to Change
- `.github/workflows/ci.yml` (new)

## Priority
**High** — development workflow quality.
