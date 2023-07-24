import { Routes, BrowserRouter, Route } from 'react-router-dom';

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
    Error500
} from "./pages";

import LibrariesHome from './pages/libraries'
import LibraryHome from './pages/libraries/library'
import SearchPage from './pages/libraries/search'
import BooksHomePage from './pages/books/index'
import BookPage from './pages/books/book'
import BookEditPage from './pages/books/edit'
import PageEditPage from './pages/books/pages/edit'
import AuthorsHomePage from './pages/authors/index'
import AuthorPage from './pages/authors/author';
import AuthorEditPage from './pages/authors/edit'
import CategoriesHomePage from './pages/categories/index'
import CategoriesPage from './pages/categories/category';
import CategoriesEditPage from './pages//categories/edit';
import SeriesHomePage from './pages/series/index'
import SeriesPage from './pages/series/series';
import SeriesEditPage from './pages//series/edit';
import PeriodicalsHomePage from './pages/periodicals/index';
import PeriodicalPage from './pages/periodicals/periodical';
import PeriodicalEditPage from './pages/periodicals/edit';
import IssueEditPage from './pages/periodicals/issues/edit';
import BookReader from './pages/books/reader'
import ChapterEditor from './pages/books/chapters/edit'

import LayoutWithHeader from './components/layout/layoutWithHeader'
import LayoutWithFooter from './components/layout/layoutWithFooter';
import SecurePage from './components/layout/securePage';

const Router = () => {
    return (<BrowserRouter>
        <Routes>
            <Route element={<LayoutWithHeader />}>
                <Route element={<SecurePage />}>
                    <Route path="/" element={<Home />} />
                    <Route path="/libraries/" element={<LibrariesHome />} />
                    <Route path="/libraries/:libraryId" element={<LibraryHome />} />
                    <Route path="/libraries/:libraryId/search" element={<SearchPage />} />
                    <Route path="/libraries/:libraryId/books" element={<BooksHomePage />} />
                    <Route path="/libraries/:libraryId/books/add" element={<BookEditPage />} />
                    <Route path="/libraries/:libraryId/books/:bookId" element={<BookPage />} />
                    <Route path="/libraries/:libraryId/books/:bookId/edit" element={<BookEditPage />} />
                    <Route path="/libraries/:libraryId/books/:bookId/chapters/{:chapterNumber}/edit" element={<ChapterEditor />} />
                    <Route path="/libraries/:libraryId/books/:bookId/pages/add" element={<PageEditPage />} />
                    <Route path="/libraries/:libraryId/books/:bookId/pages/:pageNumber/edit" element={<PageEditPage />} />
                    <Route path="/libraries/:libraryId/authors" element={<AuthorsHomePage />} />
                    <Route path="/libraries/:libraryId/authors/add" element={<AuthorEditPage />} />
                    <Route path="/libraries/:libraryId/authors/:authorId" element={<AuthorPage />} />
                    <Route path="/libraries/:libraryId/authors/:authorId/edit" element={<AuthorEditPage />} />
                    <Route path="/libraries/:libraryId/categories" element={<CategoriesHomePage />} />
                    <Route path="/libraries/:libraryId/categories/add" element={<CategoriesEditPage />} />
                    <Route path="/libraries/:libraryId/categories/:categoryId" element={<CategoriesPage />} />
                    <Route path="/libraries/:libraryId/categories/:categoryId/edit" element={<CategoriesEditPage />} />
                    <Route path="/libraries/:libraryId/series" element={<SeriesHomePage />} />
                    <Route path="/libraries/:libraryId/series/add" element={<SeriesEditPage />} />
                    <Route path="/libraries/:libraryId/series/:seriesId" element={<SeriesPage />} />
                    <Route path="/libraries/:libraryId/series/:seriesId/edit" element={<SeriesEditPage />} />
                    <Route path="/libraries/:libraryId/periodicals" element={<PeriodicalsHomePage />} />
                    <Route path="/libraries/:libraryId/periodicals/add" element={<PeriodicalEditPage />} />
                    <Route path="/libraries/:libraryId/periodicals/:periodicalId" element={<PeriodicalPage />} />
                    <Route path="/libraries/:libraryId/periodicals/:periodicalId/edit" element={<PeriodicalEditPage />} />
                    <Route path="/libraries/:libraryId/periodicals/:periodicalId/issues/add" element={<IssueEditPage />} />
                    <Route path="/libraries/:libraryId/periodicals/:periodicalId/volumes/:volumeNumber/issues/:issueNumber/edit" element={<IssueEditPage />} />
                </Route>
                <Route path="/500" element={<Error500 />} />
                <Route path="/403" element={<Error403 />} />
                <Route path="*" element={<Error404 />} />
            </Route>
            <Route path="/libraries/:libraryId/books/:bookId/chapters/:chapterId" element={<BookReader />} />
            <Route element={<LayoutWithFooter />} >
                <Route element={<SecurePage />}>
                    <Route path="/change-password" element={<ChangePassword />} />
                </Route>
                <Route path="/account/login" element={<Login />} />
                <Route path="/account/register" element={<Register />} />
                <Route path="/account/forgot-password" element={<ForgotPassword />} />
                <Route path="/account/reset-password" element={<ResetPassword />} />
                <Route path="/account/verify" element={<VerifyAccount />} />
            </Route>
        </Routes>
    </BrowserRouter>);
}

export default Router;
