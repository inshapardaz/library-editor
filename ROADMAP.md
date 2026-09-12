# Nawishta Library Editor — Product Roadmap

**Last updated:** March 2026
**Product:** Library Editor (editor.nawishta.co.uk)
**Goal:** Make the platform stable, performant, and easy to maintain so the team can ship new features with confidence.

---

## Roadmap Overview

```
Milestone 1 │ Milestone 2 │ Milestone 3  │ Milestone 4  │ Milestone 5
  Apr 2026   │  May 2026   │  Jun 2026    │  Jul 2026    │  Aug 2026
─────────────┼─────────────┼──────────────┼──────────────┼─────────────
  Stabilise  │  Developer  │ Architecture │  Performance │  User
  & Harden   │  Tooling    │ Cleanup      │  & Scale     │  Experience
```

---

## Milestone 1 — Stabilise & Harden (April 2026)

> **Theme:** Stop the bleeding. Fix bugs that silently corrupt data, break auth, and crash the app with no recovery path.

These are not optional — they affect every user in production today.

### Deliverables

| # | Task | Description | Effort |
|---|---|---|---|
| 1 | [TASK-024](tasks/TASK-024-fix-axiosbasequery-headers.md) | Fix `axiosBaseQuery` to forward custom headers | S |
| 2 | [TASK-025](tasks/TASK-025-migrate-book-service-to-rtk-query.md) | Migrate `book.service.js` to RTK Query (cache invalidation) | M |
| 3 | [TASK-018](tasks/TASK-018-fix-securepage-redirect.md) | Fix SecurePage auth redirect (unused variable, brittle guard) | S |
| 4 | [TASK-013](tasks/TASK-013-add-react-error-boundary.md) | Add React Error Boundary (blank screen on runtime error) | S |
| 5 | [TASK-026](tasks/TASK-026-fix-dark-mode-state-divergence.md) | Fix dark mode state divergence on page reload | S |
| 6 | [TASK-032](tasks/TASK-032-fix-corrections-page-language-param.md) | Fix corrections page language URL param bug (`year` → `language`) | XS |
| 7 | [TASK-033](tasks/TASK-033-nginx-security-headers.md) | Add HTTP security headers to nginx (CSP, X-Frame-Options, etc.) | S |

### Success Criteria
- Multi-language chapter content is fetched with the correct `Accept-Language` header.
- Saving chapter or article content automatically refreshes the list view status.
- Unauthenticated users are reliably redirected to login exactly once.
- A runtime render error shows a fallback UI instead of a blank white screen.
- Dark mode preference is correctly restored after a page reload.
- The corrections page language filter is reflected in and restored from the URL.
- All HTTP responses include security headers; the app passes an OWASP top-10 headers check.

---

## Milestone 2 — Developer Tooling (May 2026)

> **Theme:** Give the team a safety net. Without CI and tests, every deployment is a leap of faith.

### Deliverables

| # | Task | Description | Effort |
|---|---|---|---|
| 1 | [TASK-001](tasks/TASK-001-fix-playwright-port-mismatch.md) | Fix Playwright port mismatch (tests currently can't run) | XS |
| 2 | [TASK-014](tasks/TASK-014-add-github-actions-ci.md) | Add GitHub Actions CI pipeline (lint → test → Docker build) | M |
| 3 | [TASK-016](tasks/TASK-016-migrate-language-service-tests.md) | Convert `languageServiceTests.js` to a real Playwright spec | S |
| 4 | [TASK-015](tasks/TASK-015-expand-playwright-test-coverage.md) | Expand E2E test coverage (auth, books, periodicals) | L |
| 5 | [TASK-004](tasks/TASK-004-upgrade-dockerfile-node-version.md) | Upgrade Dockerfile from Node 18 (EOL) to Node 22 LTS | XS |
| 6 | [TASK-019](tasks/TASK-019-add-docker-compose.md) | Add `docker-compose.yml` for local development | S |
| 7 | [TASK-003](tasks/TASK-003-update-eslint-react-version.md) | Update ESLint React version setting to `detect` | XS |
| 8 | [TASK-030](tasks/TASK-030-add-vitest-unit-testing.md) | Add Vitest unit testing framework and seed first unit tests | M |
| 9 | [TASK-034](tasks/TASK-034-contributing-guide.md) | Create CONTRIBUTING.md developer onboarding guide | S |

### Success Criteria
- Every pull request automatically runs lint, tests, and a Docker build before merge.
- A developer can spin up the full stack locally with a single `docker compose up`.
- The test suite covers the critical happy-path flows (login redirect, books list, chapter edit).
- All test runs are stable (no port or configuration errors).
- Unit tests run in < 5 seconds and cover all utility functions and hooks.
- A new developer can clone and have the app running by following `CONTRIBUTING.md` alone.

---

## Milestone 3 — Architecture Cleanup (June 2026)

> **Theme:** Pay down technical debt that is actively slowing feature delivery. Establish patterns the whole team follows.

### Deliverables

| # | Task | Description | Effort |
|---|---|---|---|
| 1 | [TASK-020](tasks/TASK-020-split-utils-index.md) | Split 1132-line `utils/index.js` into focused modules | M |
| 2 | [TASK-021](tasks/TASK-021-consolidate-url-builders.md) | Retire legacy `buildLinkTo*` URL builders | M |
| 3 | [TASK-028](tasks/TASK-028-generic-queryparams-helper.md) | Create generic `buildQueryString` helper for API slices | S |
| 4 | [TASK-022](tasks/TASK-022-extract-shared-layout.md) | Merge duplicate `LayoutWithHeader` components + fix CSS typo | S |
| 5 | [TASK-023](tasks/TASK-023-add-use-library-hook.md) | Add `useLibrary()` hook (stop silent `undefined` crashes) | S |
| 6 | [TASK-029](tasks/TASK-029-create-usepaged-data-hook.md) | Create `useListPageParams` hook to remove list-page boilerplate | M |
| 7 | [TASK-005](tasks/TASK-005-remove-moment-use-dayjs.md) | Remove `moment.js` (use `dayjs` already in the project) | M |
| 8 | [TASK-011](tasks/TASK-011-remove-dead-commented-code.md) | Remove all dead commented-out code | S |
| 9 | [TASK-002](tasks/TASK-002-remove-debug-console-statements.md) | Remove `console.debug` statements from `config.js` | XS |

### Success Criteria
- A new developer can find any utility in under 30 seconds by looking at the module name.
- There is exactly one URL-building pattern across the codebase.
- All list pages (books, authors, periodicals, …) use the same hook for reading/writing search params.
- Bundle size is reduced by removing `moment.js`.
- No dead code or debug output remains in the production bundle.

---

## Milestone 4 — Performance & Scale (July 2026)

> **Theme:** Improve load times and server efficiency. Critical for Urdu users on slower connections and for SEO.

### Deliverables

| # | Task | Description | Effort |
|---|---|---|---|
| 1 | [TASK-027](tasks/TASK-027-add-route-level-code-splitting.md) | Route-level code splitting with `React.lazy` (defer `pdfjs`, Lexical) | M |
| 2 | [TASK-008](tasks/TASK-008-nginx-gzip-compression.md) | Enable gzip compression in nginx (60–80% JS/CSS size reduction) | XS |
| 3 | [TASK-007](tasks/TASK-007-enable-helmet-page-titles.md) | Dynamic page titles via `react-helmet-async` (SEO + usability) | S |
| 4 | [TASK-031](tasks/TASK-031-lighthouse-performance-baseline.md) | Establish Lighthouse performance baseline and CI budget | M |
| 5 | [TASK-035](tasks/TASK-035-bundle-size-visualizer.md) | Add bundle size visualizer (`rollup-plugin-visualizer`) | XS |

### Success Criteria
- Initial JS bundle does not include `pdfjs-dist` or Lexical source.
- JS and CSS assets are served gzip-compressed from the nginx container.
- Browser tab title changes when navigating between major sections.
- Lighthouse performance score improves measurably vs. baseline captured in TASK-031.
- Bundle treemap confirms `pdfjs-dist` and Lexical are absent from the main chunk.
- Gzip encoding is confirmed via `curl -I` response headers.

---

## Milestone 5 — User Experience Polish (August 2026)

> **Theme:** Surface-level improvements that make the editor feel complete and professional.

### Deliverables

| # | Task | Description | Effort |
|---|---|---|---|
| 1 | [TASK-006](tasks/TASK-006-add-icons-to-notifications.md) | Add icons to toast notifications | S |
| 2 | [TASK-010](tasks/TASK-010-editor-markdown-image-serialization.md) | Editor: preserve image dimensions in Markdown export/import | M |
| 3 | [TASK-009](tasks/TASK-009-editor-firefox-image-workaround.md) | Editor: resolve Firefox image drag workaround | S |
| 4 | [TASK-017](tasks/TASK-017-add-consistent-proptypes.md) | Add consistent PropTypes across components | L |

### Success Criteria
- Toast notifications are immediately recognisable by icon and colour.
- Images with explicit dimensions survive a Markdown round-trip.
- The rich-text editor behaves consistently in Chrome and Firefox.
- ESLint reports zero `react/prop-types` violations.

---

## Backlog (No Milestone Yet)

Tasks that are valid but not yet scheduled. Reassess at each milestone review.

| # | Task | Rationale for deferral |
|---|---|---|
| [TASK-012](tasks/TASK-012-implement-dark-mode.md) | Superseded by [TASK-026](tasks/TASK-026-fix-dark-mode-state-divergence.md) — fix the correct way first |

---

## Effort Legend

| Size | Typical person-days |
|---|---|
| XS | < 0.5 days |
| S | 0.5 – 1 day |
| M | 2 – 3 days |
| L | 4 – 7 days |

---

## Dependency Graph

The following ordering constraints must be respected:

```
TASK-001 (fix port)        ──► TASK-015 (expand tests)
TASK-001 (fix port)        ──► TASK-014 (CI pipeline)
TASK-001 (fix port)        ──► TASK-031 (lighthouse baseline)
TASK-014 (CI pipeline)     ──► TASK-030 (vitest, add unit step to CI)
TASK-014 (CI pipeline)     ──► TASK-031 (lighthouse CI budget)
TASK-020 (split utils)     ──► TASK-021 (retire URL builders)
TASK-028 (query helper)    ──► TASK-021 (retire URL builders)
TASK-021 (URL builders)    ──► TASK-029 (useListPageParams hook)
TASK-026 (dark mode fix)   ──  resolves TASK-012 (implement dark mode)
TASK-030 (vitest)          ──► TASK-032 (unit test the URL bug fix)
TASK-027 (code splitting)  ──► TASK-035 (verify with bundle visualizer)
```

---

## Risks & Assumptions

| Risk | Likelihood | Impact | Mitigation |
|---|---|---|---|
| TASK-025 (RTK Query migration) causes regression in chapter editor | Medium | High | Feature-flag the new mutations; keep old service until tests pass |
| TASK-027 (code splitting) breaks Vite chunk configuration | Low | Medium | Verify with TASK-035 (bundle visualizer) before shipping |
| TASK-033 (CSP headers) breaks third-party fonts or API calls | Medium | Medium | Test in staging first; start with `report-only` mode, then enforce |
| Milestone 3 scope creep (architecture work expands) | High | Medium | Time-box each architecture task; defer any discovered sub-tasks to next milestone |
| Node 22 Dockerfile (TASK-004) reveals npm peer conflicts | Low | Low | Pin to Node 20 LTS as fallback |
