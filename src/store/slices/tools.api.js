import { createApi } from "@reduxjs/toolkit/query/react";

import axiosBaseQuery from "@/utils/axiosBaseQuery";

import { parseResponse } from "@/utils/parseResponse";
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
  }),
});

export const { useGetPunctuationQuery, useGetAutoCorrectQuery } = toolsApi;
