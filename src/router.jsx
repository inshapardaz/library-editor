import { Routes, BrowserRouter, Route } from "react-router-dom";

import Pages from "@/pages";

import LayoutWithHeaderAndFooter from "@/layout/layoutWithHeaderAndFooter";
import LayoutWithHeader from "@/layout/layoutWithHeader";
import SecurePage from "@/layout/securePage";

// ------------------------------------------------------------------

const Router = () => {
    return (
        <BrowserRouter>
            <Routes>
                <Route element={<LayoutWithHeaderAndFooter />}>
                    <Route element={<SecurePage />}>
                        <Route path="/" element={<Pages.HomePage />} />
                        <Route path="/libraries/:libraryId/authors/add" element={<Pages.EditAuthorPage />} />
                        <Route path="/libraries/:libraryId/authors/:authorId/edit" element={<Pages.EditAuthorPage />} />
                        <Route path="/libraries/:libraryId/authors/:authorId" element={<Pages.AuthorPage />} />
                        <Route path="/libraries/:libraryId/authors" element={<Pages.AuthorsPage />} />
                        <Route path="/libraries/:libraryId/series/add" element={<Pages.EditSeriesPage />} />
                        <Route path="/libraries/:libraryId/series/:seriesId/edit" element={<Pages.EditSeriesPage />} />
                        <Route path="/libraries/:libraryId/series/:seriesId" element={<Pages.SeriesPage />} />
                        <Route path="/libraries/:libraryId/series" element={<Pages.SeriesListPage />} />
                        <Route path="/libraries/:libraryId/books/add" element={<Pages.EditBookPage />} />
                        <Route path="/libraries/:libraryId/books/upload" element={<Pages.BookUploadPage />} />
                        <Route path="/libraries/:libraryId/books/:bookId" element={<Pages.BookPage />} />
                        <Route path="/libraries/:libraryId/books/:bookId/chapters/add" element={<Pages.ChapterEditorPage />} />
                        <Route path="/libraries/:libraryId/books/:bookId/edit" element={<Pages.EditBookPage />} />
                        <Route path="/libraries/:libraryId/books" element={<Pages.BooksPage />} />
                        <Route path="/libraries/:libraryId/periodicals/:periodicalId/issues/add" element={<Pages.EditIssuePage />} />
                        <Route path="/libraries/:libraryId/periodicals/:periodicalId/volumes/:volumeNumber/issues/:issueNumber/edit" element={<Pages.EditIssuePage />} />
                        <Route path="/libraries/:libraryId/periodicals/:periodicalId/volumes/:volumeNumber/issues/:issueNumber/articles/add" element={<Pages.EditIssueArticlePage />} />
                        <Route path="/libraries/:libraryId/periodicals/:periodicalId/volumes/:volumeNumber/issues/:issueNumber/articles/:articleNumber/edit" element={<Pages.EditIssueArticlePage />} />
                        <Route path="/libraries/:libraryId/periodicals/:periodicalId/volumes/:volumeNumber/issues/:issueNumber/articles/:articleNumber" element={<Pages.IssueArticlePage />} />
                        <Route path="/libraries/:libraryId/periodicals/:periodicalId/volumes/:volumeNumber/issues/:issueNumber" element={<Pages.IssuePage />} />
                        <Route path="/libraries/:libraryId/periodicals/:periodicalId/volumes/:volumeNumber" element={<Pages.PeriodicalPage />} />
                        <Route path="/libraries/:libraryId/periodicals/add" element={<Pages.EditPeriodicalPage />} />
                        <Route path="/libraries/:libraryId/periodicals/:periodicalId/edit" element={<Pages.EditPeriodicalPage />} />
                        <Route path="/libraries/:libraryId/periodicals/:periodicalId" element={<Pages.PeriodicalPage />} />
                        <Route path="/libraries/:libraryId/periodicals" element={<Pages.PeriodicalsPage />} />
                        <Route path="/libraries/:libraryId/writings" element={<Pages.WritingsPage />} />
                        <Route path="/libraries/:libraryId/poetry/:poetryId" element={<Pages.PoetryPage />} />
                        <Route path="/libraries/:libraryId/poetry" element={<Pages.PoetriesPage />} />
                        <Route path="/libraries/add" element={<Pages.LibraryEditPage />} />
                        <Route path="/libraries/:libraryId/edit" element={<Pages.LibraryEditPage />} />
                        <Route path="/libraries/:libraryId" element={<Pages.LibraryPage />} />
                        <Route path="/libraries" element={<Pages.LibrariesPage />} />
                        <Route path="/tools/language/:profile" element={<Pages.CorrectionsPage />} />
                    </Route>
                    <Route path="/403" element={<Pages.Error403Page />} />
                    <Route path="/500" element={<Pages.Error500Page />} />
                    <Route path="*" element={<Pages.Error404Page />} />
                </Route>
                <Route element={<LayoutWithHeader />}>
                    <Route path="/libraries/:libraryId/books/:bookId/read" element={<Pages.BookReaderPage />} />
                    <Route path="/libraries/:libraryId/books/:bookId/ebook" element={<Pages.EBookReaderPage />} />
                    <Route path="/libraries/:libraryId/books/:bookId/files/:fileId/process" element={<Pages.BookProcessPage />} />
                    <Route path="/libraries/:libraryId/writings/:articleId" element={<Pages.WritingPage />} />
                    <Route path="/libraries/:libraryId/books/:bookId/chapters/:chapterNumber/contents/edit" element={<Pages.ChapterEditorPage />} />
                    <Route path="/libraries/:libraryId/books/:bookId/pages/:pageNumber/contents/edit" element={<Pages.BookPageEditPage />} />
                </Route>
            </Routes>
        </BrowserRouter>
    );
};

export default Router;