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
    getCorrections: builder.query({
      query: ({ language,
        profile,
        query = null,
        pageNumber = 1,
        pageSize = 12,
      }) => {
        let queryVal = query ? `&query=${query}` : "";
        return {
          url: `/tools/${language}/corrections/${profile}?pageNumber=${pageNumber}&pageSize=${pageSize}${queryVal}`,
          method: "get",
        };
      },
      transformResponse: (response) => parseResponse(response),
      providesTags: ["AutoCorrect"],
    }),
    addCorrection: builder.mutation({
      query: ({ language, profile, payload }) => ({
        url: `/tools/${language}/corrections/${profile}`,
        method: "POST",
        data: removeLinks(payload),
      }),
      invalidatesTags: ["AutoCorrect"],
    }),
    updateCorrection: builder.mutation({
      query: ({ language, profile, id, payload }) => ({
        url: `/tools/${language}/corrections/${profile}/${id}`,
        method: "PUT",
        data: removeLinks(payload),
      }),
      invalidatesTags: ["AutoCorrect"],
    }),
    deleteCorrection: builder.mutation({
      query: ({ correction }) => ({
        url: correction.links.delete,
        method: "DELETE",
      }),
      invalidatesTags: ["AutoCorrect"],
    }),
  }),
});

export const {
  useGetPunctuationQuery,
  useGetAutoCorrectQuery,
  useGetCorrectionsQuery,
  useAddCorrectionMutation,
  useUpdateCorrectionMutation,
  useDeleteCorrectionMutation,
} = toolsApi;
