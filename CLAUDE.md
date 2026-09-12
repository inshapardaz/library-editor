# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

> This repo also maintains [AGENT.MD](AGENT.MD), written for other coding agents, covering the same architecture and conventions in more detail. Keep the two in sync when either changes; this file is the condensed, Claude-Code-oriented entry point.

## Project

Nawishta Library Editor — the editor/publisher app for an e-book cataloguing and publishing platform. Used by librarians, editors, and writers to catalogue books/periodicals, digitize scans (OCR + manual typing), proof-read, and publish finished works (e-pub, text, Word, embedded reader).

Stack: React 19 + Vite 6, Mantine 7, Redux Toolkit / RTK Query, React Router DOM v7, Lexical (rich-text editor), react-i18next (English + Urdu/RTL), Playwright (E2E), ESLint 9 flat config.

## Commands

```bash
npm install                  # install dependencies
npm start                    # dev server (vite.config.js binds port 4300)
npm run build                # production build -> dist/
npm run lint                 # eslint .
npm test                     # full Playwright E2E suite
npm run test:debug           # Playwright in UI mode
npx playwright test tests/specs/homePage.spec.js   # run a single spec file
npx playwright test -g "some test name"             # run tests matching a title
```

`npm test` starts the dev server itself via `playwright.config.js`'s `webServer` — no need to run `npm start` first. Note `playwright.config.js` targets `http://localhost:5173` (Vite's default) while `vite.config.js` configures port `4300`; if E2E runs fail to connect, check which port is actually live.

The `@` path alias resolves to `src/` (see `vite.config.js`).

There is no unit test runner configured — all automated tests are Playwright E2E specs under `tests/specs/`, with helpers in `tests/pageObjects/`.

## Architecture

### Environment detection

`src/config.js` derives `NODE_ENV`, `API_URL`, and `MAIN_SITE` from `window.location.host` (no `.env` files) — `localhost` → local API on `:4000`, `editor.nawishta.dev` → dev API, `editor.nawishta.co.uk` → production API.

### Data fetching — RTK Query only

All server communication goes through RTK Query API slices in `src/store/slices/*.api.js` (one per domain: `books.api.js`, `authors.api.js`, `periodicals.api.js`, etc.). Do not hand-roll fetch/axios calls in components or store server data in plain Redux slices.

- `src/utils/axiosBaseQuery.js` — custom base query wrapping Axios; handles auth headers, base URL, error normalisation.
- `src/utils/parseResponse.js` — strips HATEOAS `_links` objects from API responses before they hit the RTK Query cache.
- Consume via generated hooks (`useGetBooksQuery`, `useAddBookMutation`, ...).

`authSlice` and `uiSlice` (`src/store/slices/`) are the only hand-written Redux state — auth/user and UI prefs (language, theme) respectively.

### Routing

All routes are centralized in `src/router.jsx`, grouped by layout:
- `LayoutWithHeaderAndFooter` + `SecurePage` — authenticated editor routes under `/libraries/:libraryId/...`
- `LayoutWithHeader` — full-screen views (book reader, ebook reader, page processor)
- public error pages (403/404/500)

### Rich-text editor

Lexical-based editor in `src/components/editor/`, supporting RTL, Urdu Nastaleeq fonts, markdown import/export, and side-by-side OCR editing. Extend via `editor/plugins/` and `editor/nodes/`; editor commands live in `editor/commands/`.

### i18n / RTL

English (`en`, LTR) and Urdu (`ur`, RTL) only. Keys must be added to **both** `src/i18n/en.js` and `src/i18n/ur.js`. Direction is driven by `uiSlice`'s language selector and applied via Mantine's `DirectionProvider`. Avoid hard-coded `left`/`right` CSS — use Mantine logical properties so RTL keeps working.

### Adding features

- New API endpoint → add a `builder.query`/`builder.mutation` in the relevant `src/store/slices/<domain>.api.js`, export the generated hook.
- New page → component under `src/pages/<domain>/`, export from `src/pages/index.js`, add a `<Route>` in `src/router.jsx` under the right layout group.
- New shared component → `src/components/` (domain subfolder if domain-specific); prefer Mantine primitives over custom CSS.

## Domain model

- **Library** — tenant/walled garden containing books, authors, categories, periodicals, poetry, prose. Roles: Reader < Writer < LibraryAdmin < Admin.
- **Book** — title, authors, chapters (ordered text sections), pages (scanned image + OCR/typed text, linked to a chapter), files (PDF/text/Word/generated e-book).
  - Digitizing pipeline: upload PDF scan → split into single pages → define chapters, assign pages → type/OCR page text → mark for proof-reading → proof-read pages → join page text into chapter text → proof-read chapters → publish.
  - Page/chapter status: `Incomplete → Being Typed → Typed → Being Proof Read → Completed`. Book status: `Available | Being Typed | Typed | Proof Read | Published`.
- **Periodicals** — issues identified by volume/issue number; like books but with an editor instead of an author and articles instead of chapters; same digitisation pipeline.
- **Poetry / Articles (Writings)** — standalone text, optionally linked to a book chapter. Status: `Incomplete → Typing → Typed → Proof Reading → Published`.
- **Visibility** — Public / Protected / Private, cascading from a resource to its children (e.g. book → chapters → pages → files).

## Mantine documentation (agent-friendly)

This UI is built almost entirely on **Mantine 7** (`@mantine/core`, `@mantine/form`, `@mantine/dates`, `@mantine/dropzone`, `@mantine/modals`, `@mantine/notifications`, `@mantine/spotlight`, `@mantine/carousel`). Mantine publishes an LLM-oriented documentation set — prefer these over guessing prop names or scraping the regular docs site:

- **https://mantine.dev/llms.txt** — index of every doc page as plain Markdown, organized by components/hooks/forms/dates/charts/theming/styles. Fetch this first to find the right page.
- **https://mantine.dev/llms-full.txt** — the entire documentation set concatenated into one file (large; use for broad context or when several related components are needed at once).
- Individual pages follow `https://mantine.dev/llms/<slug>.md` (e.g. `core-button.md`, `hooks-use-form.md`), as listed in the index above.

When implementing or modifying a Mantine-based component, look up its specific `llms/*.md` page for current props/API rather than relying on training data — Mantine's API changes between majors.
