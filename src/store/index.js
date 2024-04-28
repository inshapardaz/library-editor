import { configureStore } from "@reduxjs/toolkit";

// Local Imports
import { uiSlice } from "./slices/uiSlice";
import { authSlice } from "./slices/authSlice";
import { librariesApi } from "./slices/librariesSlice";
import { accountsApi } from "./slices/accountsSlice";
import { booksApi } from "./slices/booksSlice";
import { authorsApi } from "./slices/authorsSlice";
import { seriesApi } from "./slices/seriesSlice";
import { categoriesApi } from "./slices/categoriesSlice";
import { periodicalsApi } from "./slices/periodicalsSlice";
import { issuesApi } from "./slices/issuesSlice";
import { articlesApi } from "./slices/articlesSlice";
import { toolsApi } from "./slices/toolsSlice";

// ----------------------------------------------

export const store = configureStore({
  reducer: {
    [uiSlice.name]: uiSlice.reducer,
    [authSlice.name]: authSlice.reducer,
    [librariesApi.reducerPath]: librariesApi.reducer,
    [accountsApi.reducerPath]: accountsApi.reducer,
    [booksApi.reducerPath]: booksApi.reducer,
    [authorsApi.reducerPath]: authorsApi.reducer,
    [seriesApi.reducerPath]: seriesApi.reducer,
    [categoriesApi.reducerPath]: categoriesApi.reducer,
    [periodicalsApi.reducerPath]: periodicalsApi.reducer,
    [issuesApi.reducerPath]: issuesApi.reducer,
    [articlesApi.reducerPath]: articlesApi.reducer,
    [toolsApi.reducerPath]: toolsApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware()
      .concat(librariesApi.middleware)
      .concat(accountsApi.middleware)
      .concat(booksApi.middleware)
      .concat(authorsApi.middleware)
      .concat(seriesApi.middleware)
      .concat(categoriesApi.middleware)
      .concat(periodicalsApi.middleware)
      .concat(issuesApi.middleware)
      .concat(articlesApi.middleware)
      .concat(toolsApi.middleware),
});
