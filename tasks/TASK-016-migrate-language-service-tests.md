# TASK-016: Convert languageServiceTests.js to Proper Playwright Spec

## Summary
`tests/specs/languageServiceTests.js` is not a valid Playwright test file — it does not use the `test` / `expect` Playwright API and will not be picked up by the test runner. The language service logic it covers needs to be wrapped in proper Playwright (or Vitest unit) test syntax.

## Steps
1. Open `tests/specs/languageServiceTests.js` and review what behaviour it tests.
2. Decide on the appropriate test type:
   - **Unit tests** (e.g. with Vitest): if the tests cover pure functions in `src/domain/language.service.js`.
   - **E2E tests** (Playwright): if the tests exercise browser UI behaviour related to language switching.
3. Rewrite the file using the correct test framework syntax.
4. Ensure the tests are discovered and pass in CI.

## Acceptance Criteria
- [ ] `languageServiceTests.js` is either converted to a valid Playwright spec or moved to a unit test file with Vitest.
- [ ] `npm test` (or `npx vitest`) runs and reports results for the language service tests.
- [ ] The original test intentions (whatever the file was testing) are preserved.

## Files to Change
- `tests/specs/languageServiceTests.js`
- `package.json` (if Vitest is added as a dependency)

## Priority
**Medium** — test infrastructure correctness.
