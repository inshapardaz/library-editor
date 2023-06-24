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
import BooksHomePage from './pages/books/index'
import BookPage from './pages/books/book'
import BookEditPage from './pages/books/edit'
import AuthorsHomePage from './pages/authors/index'
import AuthorPage from './pages/authors/author';
import SeriesHomePage from './pages/series/index'
import SeriesPage from './pages/series/series';
import PeriodicalsHomePage from './pages/periodicals/index';
import BookReader from './pages/books/reader'

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
                    <Route path="/libraries/:libraryId/books" element={<BooksHomePage />} />
                    <Route path="/libraries/:libraryId/books/:bookId" element={<BookPage />} />
                    <Route path="/libraries/:libraryId/books/:bookId/edit" element={<BookEditPage />} />
                    <Route path="/libraries/:libraryId/authors" element={<AuthorsHomePage />} />
                    <Route path="/libraries/:libraryId/authors/:authorId" element={<AuthorPage />} />
                    <Route path="/libraries/:libraryId/series" element={<SeriesHomePage />} />
                    <Route path="/libraries/:libraryId/series/:seriesId" element={<SeriesPage />} />
                    <Route path="/libraries/:libraryId/periodicals" element={<PeriodicalsHomePage />} />
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
