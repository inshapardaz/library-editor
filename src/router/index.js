import React from "react";
import { Routes, BrowserRouter, Route } from "react-router-dom";

import {
    Home,
    Login,
    Register,
    ForgotPassword,
    ResetPassword,
    ChangePassword,
    VerifyAccount,
    Error403,
    Error404,
    Error500,
    EditorPage,
    LibrariesHome,
    LibraryEditPage,
    LibraryHome,
    CategoriesHomePage,
    CategoriesEditPage,
    BooksHomePage,
    BookEditPage,
    BooksUpload,
    BookPage,
    BookPageEditPage,
    BookProcessPage,
    ChapterEditor,
    SeriesHomePage,
    SeriesEditPage,
    SeriesPage,
    AuthorsHomePage,
    AuthorEditPage,
    AuthorPage,
    ArticlesHomePage,
    ArticleEditPage,
    ArticlePage,
    ArticleContentEditPage,
    PeriodicalsHomePage,
    PeriodicalEditPage,
    PeriodicalPage,
    IssueEditPage,
    IssuePage,
} from "/src/pages";

import LayoutWithHeader from "/src/components/layout/layoutWithHeader";
import LayoutWithFooter from "/src/components/layout/layoutWithFooter";
import SecurePage from "/src/components/layout/securePage";

const Router = () => {
    return (
        <BrowserRouter>
            <Routes>
                <Route element={<LayoutWithHeader />}>
                    <Route element={<SecurePage />}>
                        <Route path="/" element={<Home />} />
                        {/* Library */}
                        <Route path="/libraries/" element={<LibrariesHome />} />
                        <Route
                            path="/libraries/add"
                            element={<LibraryEditPage />}
                        />
                        <Route
                            path="/libraries/:libraryId"
                            element={<LibraryHome />}
                        />
                        <Route
                            path="/libraries/:libraryId/edit"
                            element={<LibraryEditPage />}
                        />
                        {/* <Route
              path="/libraries/:libraryId/search"
              element={<SearchPage />}
            /> */}
                        {/* Books */}
                        <Route
                            path="/libraries/:libraryId/books"
                            element={<BooksHomePage />}
                        />
                        <Route
                            path="/libraries/:libraryId/books/add"
                            element={<BookEditPage />}
                        />
                        <Route
                            path="/libraries/:libraryId/books/upload"
                            element={<BooksUpload />}
                        />
                        <Route
                            path="/libraries/:libraryId/books/:bookId"
                            element={<BookPage />}
                        />
                        <Route
                            path="/libraries/:libraryId/books/:bookId/edit"
                            element={<BookEditPage />}
                        />
                        <Route
                            path="/libraries/:libraryId/books/:bookId/contents/:contentId/process"
                            element={<BookProcessPage />}
                        />
                        <Route
                            path="/libraries/:libraryId/books/:bookId/chapters/:chapterNumber/edit"
                            element={<ChapterEditor />}
                        />
                        <Route
                            path="/libraries/:libraryId/books/:bookId/pages/add"
                            element={<BookPageEditPage />}
                        />
                        <Route
                            path="/libraries/:libraryId/books/:bookId/pages/upload"
                            element={<BookProcessPage />}
                        />
                        <Route
                            path="/libraries/:libraryId/books/:bookId/pages/:pageNumber/edit"
                            element={<BookPageEditPage />}
                        />
                        {/* Categories */}
                        <Route
                            path="/libraries/:libraryId/categories"
                            element={<CategoriesHomePage />}
                        />
                        <Route
                            path="/libraries/:libraryId/categories/add"
                            element={<CategoriesEditPage />}
                        />
                        <Route
                            path="/libraries/:libraryId/categories/:categoryId/edit"
                            element={<CategoriesEditPage />}
                        />
                        {/* Series */}
                        <Route
                            path="/libraries/:libraryId/series"
                            element={<SeriesHomePage />}
                        />
                        <Route
                            path="/libraries/:libraryId/series/add"
                            element={<SeriesEditPage />}
                        />
                        <Route
                            path="/libraries/:libraryId/series/:seriesId"
                            element={<SeriesPage />}
                        />
                        <Route
                            path="/libraries/:libraryId/series/:seriesId/edit"
                            element={<SeriesEditPage />}
                        />
                        {/* Authors */}
                        <Route
                            path="/libraries/:libraryId/authors"
                            element={<AuthorsHomePage />}
                        />
                        <Route
                            path="/libraries/:libraryId/authors/add"
                            element={<AuthorEditPage />}
                        />
                        <Route
                            path="/libraries/:libraryId/authors/:authorId"
                            element={<AuthorPage />}
                        />
                        <Route
                            path="/libraries/:libraryId/authors/:authorId/edit"
                            element={<AuthorEditPage />}
                        />
                        {/* Articles */}
                        <Route
                            path="/libraries/:libraryId/articles"
                            element={<ArticlesHomePage />}
                        />
                        <Route
                            path="/libraries/:libraryId/articles/add"
                            element={<ArticleEditPage />}
                        />
                        <Route
                            path="/libraries/:libraryId/articles/:articleId/edit"
                            element={<ArticleEditPage />}
                        />
                        <Route
                            path="/libraries/:libraryId/articles/:articleId"
                            element={<ArticlePage />}
                        />
                        <Route
                            path="/libraries/:libraryId/articles/:articleId/contents/:language"
                            element={<ArticlePage />}
                        />
                        <Route
                            path="/libraries/:libraryId/articles/:articleId/contents/:language/edit"
                            element={<ArticleContentEditPage />}
                        />
                        {/* Periodicals */}

                        <Route
                            path="/libraries/:libraryId/periodicals"
                            element={<PeriodicalsHomePage />}
                        />
                        <Route
                            path="/libraries/:libraryId/periodicals/add"
                            element={<PeriodicalEditPage />}
                        />
                        <Route
                            path="/libraries/:libraryId/periodicals/:periodicalId"
                            element={<PeriodicalPage />}
                        />
                        <Route
                            path="/libraries/:libraryId/periodicals/:periodicalId/edit"
                            element={<PeriodicalEditPage />}
                        />
                        <Route
                            path="/libraries/:libraryId/periodicals/:periodicalId/issues/add"
                            element={<IssueEditPage />}
                        />
                        <Route
                            path="/libraries/:libraryId/periodicals/:periodicalId/volumes/:volumeNumber/issues/:issueNumber/edit"
                            element={<IssueEditPage />}
                        />
                        <Route
                            path="/libraries/:libraryId/periodicals/:periodicalId/volumes/:volumeNumber/issues/:issueNumber"
                            element={<IssuePage />}
                        />
                    </Route>
                    <Route path="/editor" element={<EditorPage />} />
                    <Route path="/500" element={<Error500 />} />
                    <Route path="/403" element={<Error403 />} />
                    <Route path="*" element={<Error404 />} />
                </Route>
                <Route element={<LayoutWithFooter />}>
                    <Route element={<SecurePage />}>
                        <Route
                            path="/change-password"
                            element={<ChangePassword />}
                        />
                    </Route>
                    <Route path="/account/login" element={<Login />} />
                    <Route path="/account/register" element={<Register />} />
                    <Route
                        path="/account/forgot-password"
                        element={<ForgotPassword />}
                    />
                    <Route
                        path="/account/reset-password"
                        element={<ResetPassword />}
                    />
                    <Route path="/account/verify" element={<VerifyAccount />} />
                </Route>
            </Routes>
        </BrowserRouter>
    );
};

export default Router;
