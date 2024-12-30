import { configureStore } from "@reduxjs/toolkit";

// Local Imports
import { uiSlice } from "./slices/uiSlice";
import { authSlice } from "./slices/authSlice";
import { authApi } from "./slices/auth.api";
import { librariesApi } from "./slices/libraries.api";
import { booksApi } from "./slices/books.api";
import { authorsApi } from "./slices/authors.api";
import { seriesApi } from "./slices/series.api";
import { categoriesApi } from "./slices/categories.api";
import { articlesApi } from "./slices/articles.api";
import { periodicalsApi } from "./slices/periodicals.api";
import { issuesApi } from "./slices/issues.api";
import { issueArticlesApi } from "./slices/issueArticles.api";
import { accountsApi } from "./slices/accounts.api";

// ----------------------------------------------

export const store = configureStore({
    reducer: {
        [uiSlice.name]: uiSlice.reducer,
        [authSlice.name]: authSlice.reducer,
        [authApi.reducerPath]: authApi.reducer,
        [librariesApi.reducerPath]: librariesApi.reducer,
        [booksApi.reducerPath]: booksApi.reducer,
        [authorsApi.reducerPath]: authorsApi.reducer,
        [articlesApi.reducerPath]: articlesApi.reducer,
        [seriesApi.reducerPath]: seriesApi.reducer,
        [categoriesApi.reducerPath]: categoriesApi.reducer,
        [periodicalsApi.reducerPath]: periodicalsApi.reducer,
        [issuesApi.reducerPath]: issuesApi.reducer,
        [issueArticlesApi.reducerPath]: issueArticlesApi.reducer,
        [accountsApi.reducerPath]: accountsApi.reducer,
    },
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware()
            .concat(authApi.middleware)
            .concat(librariesApi.middleware)
            .concat(booksApi.middleware)
            .concat(authorsApi.middleware)
            .concat(seriesApi.middleware)
            .concat(categoriesApi.middleware)
            .concat(articlesApi.middleware)
            .concat(periodicalsApi.middleware)
            .concat(issuesApi.middleware)
            .concat(issueArticlesApi.middleware)
            .concat(accountsApi.middleware)
});
