# TASK-015: Expand Playwright E2E Test Coverage

## Summary
Currently there is only one real Playwright spec (`homePage.spec.js` with a single title assertion). The application has complex, user-facing workflows (book digitization, chapter editing, periodical management) that have no automated test coverage.

## Current Coverage
- `tests/specs/homePage.spec.js` — 1 test: page title check.
- `tests/specs/languageServiceTests.js` — not a valid Playwright spec (see TASK-016).

## Prioritised Test Scenarios to Add

### Authentication
- [ ] Unauthenticated user is redirected to the login page.

### Libraries
- [ ] Libraries list is displayed on the home page.
- [ ] Admin can navigate to add library form.

### Books
- [ ] Books list page renders correctly for a given library.
- [ ] Book upload form validates required fields.
- [ ] Book detail page shows chapters and pages.

### Digitization Workflow
- [ ] Page image is displayed alongside text editor on the page-edit route.
- [ ] Typing text and saving updates the page status.

### Periodicals
- [ ] Periodicals list is visible.
- [ ] Issue detail page lists articles.

### Tools
- [ ] Corrections page loads the corrections list.
- [ ] Common words page loads the word list.

## Notes
- Use the Page Object pattern already established in `tests/pageObjects/`.
- Mock or stub the API using Playwright's `page.route()` to keep tests fast and deterministic.
- Coordinate with TASK-001 (port fix) before writing new tests.

## Files to Change
- `tests/specs/*.spec.js` (new files)
- `tests/pageObjects/*.js` (new page objects)

## Priority
**High** — quality assurance.
