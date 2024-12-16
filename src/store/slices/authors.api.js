import { createApi } from "@reduxjs/toolkit/query/react";

import axiosBaseQuery from "@/utils/axiosBaseQuery";
import { parseResponse } from "@/utils/parseResponse";
// ----------------------------------------------

export const authorsApi = createApi({
  reducerPath: "authors",
  baseQuery: axiosBaseQuery(),
  tagTypes: ["Authors", "Author"],
  endpoints: (builder) => ({
    getAuthors: builder.query({
      query: ({ libraryId,
        query,
        authorType,
        sortBy = null,
        sortDirection = null,
        pageNumber = 1,
        pageSize = 12 }) => {
        let queryVal = query ? `&query=${query}` : "";
        if (authorType) {
          queryVal += `authorType=${authorType}`;
        }
        if (sortBy) {
          queryVal += `&sortBy=${sortBy}`;
        }
        if (sortDirection) {
          queryVal += `&sortDirection=${sortDirection}`;
        }
        return {
          url: `/libraries/${libraryId}/authors?pageNumber=${pageNumber}&pageSize=${pageSize}${queryVal}`,
          method: "get",
        };
      },
      transformResponse: (response) => parseResponse(response),
      providesTags: ["Authors"],
    }),
    getAuthor: builder.query({
      query: ({ libraryId, authorId }) => ({
        url: `/libraries/${libraryId}/authors/${authorId}`,
        method: "get",
      }),
      transformResponse: (response) => parseResponse(response),
      providesTags: ["Author"],
    })
  })
});

export const {
  useGetAuthorsQuery,
  useGetAuthorQuery,
} = authorsApi;
