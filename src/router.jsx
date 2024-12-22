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
                        <Route path="/libraries/:libraryId/authors/:authorId" element={<Pages.AuthorPage />} />
                        <Route path="/libraries/:libraryId/authors" element={<Pages.AuthorsPage />} />
                        <Route path="/libraries/:libraryId/series/:seriesId" element={<Pages.SeriesPage />} />
                        <Route path="/libraries/:libraryId/series" element={<Pages.SeriesListPage />} />
                        <Route path="/libraries/:libraryId/books/add" element={<Pages.EditBookPage />} />
                        <Route path="/libraries/:libraryId/books/:bookId" element={<Pages.BookPage />} />
                        <Route path="/libraries/:libraryId/books/:bookId/edit" element={<Pages.EditBookPage />} />
                        <Route path="/libraries/:libraryId/books" element={<Pages.BooksPage />} />
                        <Route path="/libraries/:libraryId/periodicals/:periodicalId/volumes/:volumeNumber/issues/:issueNumber/articles/:articleNumber" element={<Pages.IssueArticlePage />} />
                        <Route path="/libraries/:libraryId/periodicals/:periodicalId/volumes/:volumeNumber/issues/:issueNumber" element={<Pages.IssuePage />} />
                        <Route path="/libraries/:libraryId/periodicals/:periodicalId/volumes/:volumeNumber" element={<Pages.PeriodicalPage />} />
                        <Route path="/libraries/:libraryId/periodicals/:periodicalId" element={<Pages.PeriodicalPage />} />
                        <Route path="/libraries/:libraryId/periodicals" element={<Pages.PeriodicalsPage />} />
                        <Route path="/libraries/:libraryId/writings" element={<Pages.WritingsPage />} />
                        <Route path="/libraries/:libraryId/poetry/:poetryId" element={<Pages.PoetryPage />} />
                        <Route path="/libraries/:libraryId/poetry" element={<Pages.PoetriesPage />} />
                        <Route path="/libraries/:libraryId" element={<Pages.LibraryPage />} />
                        <Route path="/libraries" element={<Pages.LibrariesPage />} />
                    </Route>
                    <Route path="/403" element={<Pages.Error403Page />} />
                    <Route path="/500" element={<Pages.Error500Page />} />
                    <Route path="*" element={<Pages.Error404Page />} />
                </Route>
                <Route element={<LayoutWithHeader />}>
                    <Route path="/libraries/:libraryId/books/:bookId/read" element={<Pages.BookReaderPage />} />
                    <Route path="/libraries/:libraryId/books/:bookId/ebook" element={<Pages.EBookReaderPage />} />
                    <Route path="/libraries/:libraryId/writings/:articleId" element={<Pages.WritingPage />} />
                </Route>
            </Routes>
        </BrowserRouter>
    );
};

export default Router;