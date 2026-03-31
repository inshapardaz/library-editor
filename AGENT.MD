# Nawishta — Library Editor

Nawishta is an electronic books cataloging and publishing platform. This is the **editor/publisher app** used by librarians, editors, and writers to manage an e-library: cataloguing books & periodicals, digitizing scanned content, writing/proof-reading text, and publishing finished works.

---

## Tech Stack

| Concern | Technology |
|---|---|
| Framework | React 19 (JSX) |
| Build tool | Vite 6 |
| UI library | Mantine 7 |
| State management | Redux Toolkit + RTK Query |
| Routing | React Router DOM v7 |
| Rich-text editor | Lexical |
| HTTP client | Axios (custom `axiosBaseQuery`) |
| i18n | react-i18next (English + Urdu / RTL support) |
| Testing | Playwright (E2E) |
| Linting | ESLint 9 (flat config) |
| CSS | CSS Modules + PostCSS + Mantine PostCSS preset |

---

## Development Setup

```bash
npm install          # install dependencies
npm start            # dev server at http://localhost:4300
npm run build        # production build
npm run lint         # lint all files
npm test             # run Playwright E2E tests
npm run test:debug   # run Playwright tests in UI mode
```

The `@` path alias resolves to `src/` (configured in `vite.config.js`).

---

## Environment / Configuration

Runtime environment is detected in `src/config.js` by inspecting `window.location.host`:

| Host | Environment | API URL |
|---|---|---|
| `localhost` | local | `http://localhost:4000` |
| `editor.nawishta.dev` | development | `http://api.nawishta.dev` |
| `editor.nawishta.co.uk` | production | `https://api.nawishta.co.uk` |

The three exported values are `NODE_ENV`, `API_URL`, and `MAIN_SITE`.

---

## Project Structure

```
src/
  App.jsx                  # Root component: theme, i18n direction, auth init
  router.jsx               # All application routes
  config.js                # Runtime environment detection
  index.jsx                # Entry point

  store/
    index.js               # Redux store configuration
    slices/
      authSlice.js         # Auth state (login, user profile)
      uiSlice.js           # UI state (language, theme)
      *.api.js             # RTK Query API slices (one per domain)

  pages/                   # Route-level page components (one folder per domain)
  components/              # Shared and domain-specific components
    editor/                # Lexical rich-text editor (plugins, nodes, UI, themes)
  layout/                  # Layout wrappers (with header/footer, secure page guard)
  models/                  # Enum/constant definitions (statuses, types, etc.)
  i18n/                    # Translation files (en.js, ur.js) and font lists
  hooks/                   # Custom React hooks
  domain/                  # Non-Redux service logic (book, language, unsaved changes)
  utils/                   # Axios helpers, notifications, PDF utilities, etc.
  contexts/                # React context providers
```

---

## Architecture Patterns

### API / Data Fetching (RTK Query)

All server communication goes through RTK Query API slices in `src/store/slices/*.api.js`.

- One API slice per domain: `books.api.js`, `authors.api.js`, `periodicals.api.js`, etc.
- The custom `axiosBaseQuery` (in `src/utils/axiosBaseQuery.js`) wraps Axios and handles auth headers, base URL, and error normalisation.
- `parseResponse` / `removeLinks` (`src/utils/parseResponse.js`) strip HATEOAS `_links` objects from API responses before storing them in the cache.
- Use the generated hooks (e.g. `useGetBooksQuery`, `useAddBookMutation`) directly in components.

### State Management (Redux)

- `authSlice` — current user, auth status, token management.
- `uiSlice` — selected language/locale (`selectedLanguage` selector is used throughout).
- Avoid storing server data in hand-written slices; use RTK Query cache instead.

### Routing

All routes are defined in `src/router.jsx`. Route groups:

- `LayoutWithHeaderAndFooter` + `SecurePage` — all authenticated editor routes under `/libraries/:libraryId/...`
- `LayoutWithHeader` — full-screen reader/processing views (book reader, ebook reader, page processor)
- Public error pages (403, 404, 500)

### Rich-Text Editor

The Lexical-based editor lives in `src/components/editor/`. It supports RTL text, Urdu Nastaleeq fonts, markdown import/export, and side-by-side OCR editing. Extend it by adding plugins inside `editor/plugins/` and nodes inside `editor/nodes/`.

### Internationalisation

- Supported languages: **English** (`en`, LTR) and **Urdu** (`ur`, RTL).
- Translation keys live in `src/i18n/en.js` and `src/i18n/ur.js`.
- Direction is driven by `uiSlice`'s language setting and applied via Mantine's `DirectionProvider`.
- A curated list of Urdu-specific fonts is maintained in `src/i18n/index.js`.

---

## Adding New Features

### New API endpoint
1. Open or create the appropriate `src/store/slices/<domain>.api.js` file.
2. Add a new `builder.query` or `builder.mutation` endpoint inside the `endpoints` function.
3. Export the generated hook and use it in your component.

### New page
1. Create the page component under `src/pages/<domain>/`.
2. Export it from `src/pages/index.js`.
3. Add a `<Route>` in `src/router.jsx` under the appropriate layout group.

### New shared component
- Place in `src/components/` (domain sub-folder if domain-specific).
- Use Mantine primitives where possible to keep styling consistent.
- For RTL compatibility, avoid hard-coded `left`/`right` CSS values; use Mantine's logical-property support.

### New translation key
Add the key to **both** `src/i18n/en.js` and `src/i18n/ur.js` to avoid missing-translation warnings.

---

## Testing

End-to-end tests use **Playwright** and live in `tests/`.

```
tests/
  specs/          # Test specs (*.spec.js)
  pageObjects/    # Page Object helpers
```

Run against the dev server (`npm start` is started automatically by `playwright.config.js`). Add new specs in `tests/specs/` and corresponding page objects in `tests/pageObjects/`.

---

## Domain Concepts

### Libraries

The platform is organised into **Libraries**. A Library acts as a tenant — a walled garden that is an individual entity for consumers. A library can contain books, authors, categories, periodicals, poetry, and prose. Each library has an administrator. Additional users can be added with Writer or Reader roles.

### Book

A book has title, one or more authors, description, cover image, taxonomy (categories/series), publisher, publish date, language, etc. It contains:
- **Chapters** — text-only, ordered sections.
- **Pages** — linked to chapters; each page can have a scanned image and associated typed/OCR'd text.
- **Files** — PDF scans, text files, Word documents, or generated e-book files.

**Digitizing workflow:**
1. Upload a PDF scan of the book.
2. Process the PDF to split two-page scans into single-page images.
3. Define chapters and associate pages with chapters.
4. Enter text via OCR or manual typing in a side-by-side editor.
5. Mark book for proof-reading once all pages are typed.
6. Proof-read all pages and mark them completed.
7. Join page text into chapter text.
8. Proof-read chapters.
9. Publish (e-pub, plain text, Word document, or embedded reader).

**Page/Chapter statuses:** `Incomplete` → `Being Typed` → `Typed` → `Being Proof Read` → `Completed`

**Book statuses:** `Available` | `Being Typed` | `Typed` | `Proof Read` | `Published`

### Periodicals

Published at regular intervals: Daily, Weekly, BiWeekly, Monthly, Quarterly, Yearly, or Occasionally.

#### Issues
Each periodical has issues identified by **Volume Number** and **Issue Number** with a publish date. Issues are like books but have an editor instead of an author, and articles instead of chapters. Articles can have their own authors. Issues support file uploads and the same digitisation workflow as books.

### Authors

Authors have a name, image, and type (**Poet** or **Prose writer**). They can be associated with books, articles, issue articles, poetry, etc.

### Poetry

Independent poetry text with title, content, taxonomy, and poet. Can optionally link to a book chapter.

**Statuses:** `Incomplete` → `Typing` → `Typed` → `Proof Reading` → `Published`

### Articles (Writings)

Independent prose text with title, content, taxonomy, and writer. Can optionally link to a book chapter. Same statuses as poetry.

### Users & Roles

| Role | Permissions |
|---|---|
| **Reader** | Read published library content |
| **Writer** | Reader + create/edit books and periodicals |
| **LibraryAdmin** | Writer + delete content, manage categories/authors/periodicals/members within their library |
| **Admin** | Everything + create/edit/delete libraries, manage all memberships |

### Permission Model

Books, periodical issues, poetry, and articles have visibility: **Public**, **Protected**, or **Private**.

- **Public** — visible to everyone including anonymous users.
- **Protected** — visible only to library members.
- **Private** — visible only to admins, librarians, and writers.

Permissions cascade to child resources (e.g. book permissions apply to its chapters, pages, and files).
