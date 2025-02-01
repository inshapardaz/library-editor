import { createApi } from "@reduxjs/toolkit/query/react";

import axiosBaseQuery from "@/utils/axiosBaseQuery";

import { parseResponse, removeLinks } from "@/utils/parseResponse";
import { processMultipleRequests } from '@/utils';

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
    addArticle: builder.mutation({
      query: ({ libraryId, payload }) => ({
        url: `/libraries/${libraryId}/articles`,
        method: "POST",
        data: removeLinks(payload),
      }),
      invalidatesTags: ["Articles"],
    }),
    updateArticle: builder.mutation({
      query: ({ libraryId, articleId, payload }) => ({
        url: `/libraries/${libraryId}/articles/${articleId}`,
        method: "PUT",
        data: removeLinks(payload),
      }),
      invalidatesTags: ["Articles"],
    }),
    updateArticles: builder.mutation({
      async queryFn(
        { requests, payload, onProgress },
        _queryApi,
        _extraOptions,
        baseQuery
      ) {
        return processMultipleRequests({
          baseQuery,
          method: "PUT",
          url: (request) => request.data.links.update,
          requests,
          payload,
          onProgress,
        });
      },
      transformResponse: (response) => parseResponse(response),
      invalidatesTags: (result, error) => (error ? [] : ["Article", "Articles"]),
    }),
    deleteArticle: builder.mutation({
      query: ({ libraryId, articleId }) => ({
        url: `/libraries/${libraryId}/articles/${articleId}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Articles"],
    }),
    updateArticleImage: builder.mutation({
      query: ({ libraryId, articleId, payload }) => {
        const formData = new FormData();
        formData.append("file", payload, payload.fileName);
        return {
          url: `/libraries/${libraryId}/articles/${articleId}/image`,
          method: "PUT",
          data: formData,
          formData: true,
          headers: {
            "content-type": "multipart/form-data",
          },
        };
      },
      invalidatesTags: ["Articles"],
    }),
    assignArticle: builder.mutation({
      query: ({ article, payload }) => ({
        url: article.links.assign,
        method: "POST",
        data: removeLinks(payload),
      }),
      invalidatesTags: ["Article"],
    }),
    assignArticles: builder.mutation({
      async queryFn(
        { requests, payload, onProgress },
        _queryApi,
        _extraOptions,
        baseQuery
      ) {
        return processMultipleRequests({
          baseQuery,
          method: "POST",
          url: (request, payload) =>
            payload.accountId === "me"
              ? request.data.links.assign_to_me
              : request.data.links.assign,
          requests,
          payload,
          onProgress,
        });
      },
      invalidatesTags: (result, error) => (error ? [] : ["Article", "Articles"]),
    }),
    addArticleContents: builder.mutation({
      query: ({ libraryId, articleId, language, layout, payload }) => ({
        url: `/libraries/${libraryId}/articles/${articleId}/contents`,
        method: "POST",
        data: {
          language: language,
          layout: layout,
          text: payload,
        },
      }),
    }),
    updateArticleContents: builder.mutation({
      query: ({ libraryId, articleId, language, layout, payload }) => ({
        url: `/libraries/${libraryId}/articles/${articleId}/contents`,
        method: "PUT",
        data: {
          language: language,
          layout: layout,
          text: payload,
        },
      }),
    }),
  }),
});

export const {
  useGetArticlesQuery,
  useGetArticleQuery,
  useGetArticleContentsQuery,
  useAddArticleToFavoriteMutation,
  useRemoveArticleFromFavoriteMutation,
  useAddArticleMutation,
  useUpdateArticleMutation,
  useUpdateArticlesMutation,
  useDeleteArticleMutation,
  useUpdateArticleImageMutation,
  useAssignArticleMutation,
  useAssignArticlesMutation,
  useAddArticleContentsMutation,
  useUpdateArticleContentsMutation,
} = articlesApi;
