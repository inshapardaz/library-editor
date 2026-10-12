import { createApi } from "@reduxjs/toolkit/query/react";

import axiosBaseQuery from "@/utils/axiosBaseQuery";

import { parseResponse, removeLinks } from "@/utils/parseResponse";
// ----------------------------------------------
export const toolsApi = createApi({
  reducerPath: "tools",
  baseQuery: axiosBaseQuery(),
  tagTypes: ["Punctuation", "AutoCorrect"],
  endpoints: (builder) => ({
    getPunctuation: builder.query({
      query: ({ language }) => {
        return {
          url: `/tools/${language}/spellchecker/punctuation`,
          method: "get",
        };
      },
      transformResponse: (response) => parseResponse(response),
      providesTags: ["Punctuation"],
    }),
    getAutoCorrect: builder.query({
      query: ({ language }) => {
        return {
          url: `/tools/${language}/spellchecker/autocorrect`,
          method: "get",
        };
      },
      transformResponse: (response) => parseResponse(response),
      providesTags: ["AutoCorrect"],
    }),
    //Common Words
    getCommonWordsList: builder.query({
      query: ({ language }) => {
        return {
          url: `/tools/${language}/words/list`,
          method: "get",
        };
      },
      providesTags: ["WordList"],
    }),
    getCommonWords: builder.query({
      query: ({ language, query, pageNumber, pageSize }) => {
        let queryVal = query ? `&query=${query}` : "";

        return {
          url: `/tools/${language}/words?pageNumber=${pageNumber}&pageSize=${pageSize}${queryVal}`,
          method: "get",
        };
      },
      transformResponse: (response) => parseResponse(response),
      providesTags: ["WordList", "CommonWord", "CommonWords"],
    }),
    getCommonWord: builder.query({
      query: ({ language, id }) => {
        return {
          url: `/tools/${language}/words/${id}`,
          method: "get",
        };
      },
      transformResponse: (response) => parseResponse(response),
      providesTags: ["WordList", "CommonWord"],
    }),
    addCommonWord: builder.mutation({
      query: ({ language, word }) => ({
        url: `/tools/${language}/words`,
        method: "POST",
        data: {
          word
        },
      }),
      transformResponse: (response) => parseResponse(response),
      invalidatesTags: ["WordList", "CommonWord", "CommonWords"],
    }),

    updateCommonWord: builder.mutation({
      query: ({ word }) => ({
        url: word.links.update,
        method: "PUT",
        data: removeLinks(word),
      }),
      transformResponse: (response) => parseResponse(response),
      invalidatesTags: ["WordList", "CommonWord", "CommonWords"],
    }),

    deleteCommonWord: builder.mutation({
      query: ({ word }) => ({
        url: word.links.delete,
        method: "DELETE",
      }),
      invalidatesTags: ["WordList", "CommonWord", "CommonWords"],
    }),
  }),
});

export const {
  useGetPunctuationQuery,
  useGetAutoCorrectQuery,
  //Common Words
  useGetCommonWordsListQuery,
  useGetCommonWordsQuery,
  useGetCommonWordQuery,
  useAddCommonWordMutation,
  useUpdateCommonWordMutation,
  useDeleteCommonWordMutation,
} = toolsApi;
