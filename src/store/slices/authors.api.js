import { createApi } from "@reduxjs/toolkit/query/react";

import axiosBaseQuery from "@/utils/axiosBaseQuery";
import { parseResponse, removeLinks } from "@/utils/parseResponse";
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
    }),
    addAuthor: builder.mutation({
      query: ({ libraryId, payload }) => ({
        url: `/libraries/${libraryId}/authors`,
        method: "POST",
        data: removeLinks(payload),
      }),
      invalidatesTags: ["Authors"],
    }),
    updateAuthor: builder.mutation({
      query: ({ libraryId, authorId, payload }) => ({
        url: `/libraries/${libraryId}/authors/${authorId}`,
        method: "PUT",
        data: removeLinks(payload),
      }),
      invalidatesTags: ["Author"],
    }),
    deleteAuthor: builder.mutation({
      query: ({ libraryId, authorId }) => ({
        url: `/libraries/${libraryId}/authors/${authorId}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Authors", "Author"],
    }),
    updateAuthorImage: builder.mutation({
      query: ({ libraryId, authorId, payload }) => {
        const formData = new FormData();
        formData.append("file", payload, payload.fileName);
        return {
          url: `/libraries/${libraryId}/authors/${authorId}/image`,
          method: "PUT",
          data: formData,
          formData: true,
          headers: {
            "content-type": "multipart/form-data",
          },
        };
      },
      invalidatesTags: ["Authors", "Author"],
    }),
  })
});

export const {
  useGetAuthorsQuery,
  useGetAuthorQuery,
  useAddAuthorMutation,
  useUpdateAuthorMutation,
  useDeleteAuthorMutation,
  useUpdateAuthorImageMutation,
} = authorsApi;
