import { createApi } from "@reduxjs/toolkit/query/react";

import axiosBaseQuery from "@/utils/axiosBaseQuery";

import { parseResponse } from "@/utils/parseResponse";
// ----------------------------------------------
export const articlesApi = createApi({
  reducerPath: "articles",
  baseQuery: axiosBaseQuery(),
  tagTypes: ["Articles", "Article"],
  endpoints: (builder) => ({
    getArticles: builder.query({
      query: ({
        libraryId,
        query = null,
        author = null,
        category = null,
        type = null,
        sortBy = null,
        sortDirection = null,
        favorite = null,
        read = null,
        status = null,
        pageNumber = 1,
        pageSize = 12,
      }) => {
        let queryVal = query ? `&query=${query}` : "";
        if (author) {
          queryVal += `&authorId=${author}`;
        }
        if (category) {
          queryVal += `&categoryId=${category}`;
        }
        if (type) {
          queryVal += `&type=${type}`;
        }
        if (sortBy) {
          queryVal += `&sortBy=${sortBy}`;
        }
        if (favorite) {
          queryVal += "&favorite=true";
        }
        if (read !== undefined && read !== null) {
          queryVal += `&read=${read}`;
        }
        if (status) {
          queryVal += `&status=${status}`;
        }
        if (sortDirection) {
          queryVal += `&sortDirection=${sortDirection}`;
        }
        return {
          url: `/libraries/${libraryId}/articles?pageNumber=${pageNumber}&pageSize=${pageSize}${queryVal}`,
          method: "get",
        };
      },
      transformResponse: (response) => parseResponse(response),
      providesTags: ["Articles"],
    }),
    getArticle: builder.query({
      query: ({ libraryId, articleId }) => ({
        url: `/libraries/${libraryId}/articles/${articleId}`,
        method: "get",
      }),
      transformResponse: (response) => parseResponse(response),
      providesTags: ["Articles"],
    }),
    getArticleContents: builder.query({
      query: ({ libraryId, articleId, language }) => ({
        url: `/libraries/${libraryId}/articles/${articleId}/contents?language=${language}`,
        method: "get",
      }),
      transformResponse: (response) => parseResponse(response),
    }),
    addArticleToFavorite: builder.mutation({
      query: ({ article }) => {
        return {
          url: article.links.create_favorite,
          method: "POST"
        };
      },
      invalidatesTags: ["Articles", "Article"],
    }),
    removeArticleFromFavorite: builder.mutation({
      query: ({ article }) => {
        return {
          url: article.links.remove_favorite,
          method: "DELETE"
        };
      },
      invalidatesTags: ["Articles", "Article"],
    }),
  }),
});

export const {
  useGetArticlesQuery,
  useGetArticleQuery,
  useGetArticleContentsQuery,
  useAddArticleToFavoriteMutation,
  useRemoveArticleFromFavoriteMutation,
} = articlesApi;
