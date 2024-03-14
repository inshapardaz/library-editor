import { configureStore } from '@reduxjs/toolkit';
import authReducer from './features/auth/authSlice';
import { librariesApi } from './features/api/librariesSlice'
import { authorsApi } from './features/api/authorsSlice'
import { seriesApi } from './features/api/seriesSlice'
import { booksApi } from './features/api/booksSlice'
import { categoriesApi } from './features/api/categoriesSlice'
import { periodicalsApi } from './features/api/periodicalsSlice'
import { issuesApi } from './features/api/issuesSlice'
import { articlesApi } from './features/api/articlesSlice'
import { accountsApi } from './features/api/accountsSlice'
import { toolsApi } from './features/api/toolsSlice'
import uiReducer from './features/ui/uiSlice';

export const store = configureStore({
    reducer: {
        ui: uiReducer,
        auth: authReducer,
        [librariesApi.reducerPath]: librariesApi.reducer,
        [authorsApi.reducerPath]: authorsApi.reducer,
        [seriesApi.reducerPath]: seriesApi.reducer,
        [booksApi.reducerPath]: booksApi.reducer,
        [categoriesApi.reducerPath]: categoriesApi.reducer,
        [periodicalsApi.reducerPath]: periodicalsApi.reducer,
        [issuesApi.reducerPath]: issuesApi.reducer,
        [accountsApi.reducerPath]: accountsApi.reducer,
        [articlesApi.reducerPath]: articlesApi.reducer,
        [toolsApi.reducerPath]: toolsApi.reducer
    },
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware()
            .concat(librariesApi.middleware)
            .concat(authorsApi.middleware)
            .concat(seriesApi.middleware)
            .concat(booksApi.middleware)
            .concat(categoriesApi.middleware)
            .concat(periodicalsApi.middleware)
            .concat(issuesApi.middleware)
            .concat(accountsApi.middleware)
            .concat(articlesApi.middleware)
            .concat(toolsApi.middleware)
});
