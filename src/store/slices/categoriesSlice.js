import { createApi } from "@reduxjs/toolkit/query/react";

import axiosBaseQuery from "~/src/util/axiosBaseQuery";

import { parseResponse, removeLinks } from "~/src/util/parseResponse";
// ----------------------------------------------
export const categoriesApi = createApi({
  reducerPath: "categories",
  baseQuery: axiosBaseQuery(),
  tagTypes: ["Categories"],
  endpoints: (builder) => ({
    getCategories: builder.query({
      query: ({ libraryId, query, pageNumber = 1, pageSize = 12 }) => {
        let queryVal = query ? `&query=${query}` : "";
        return {
          url: `/libraries/${libraryId}/categories?pageNumber=${pageNumber}&pageSize=${pageSize}${queryVal}`,
          method: "get",
        };
      },
      transformResponse: (response) => parseResponse(response),
      providesTags: ["Categories"],
    }),
    getCategoryById: builder.query({
      query: ({ libraryId, categoryId }) => ({
        url: `/libraries/${libraryId}/categories/${categoryId}`,
        method: "get",
      }),
      transformResponse: (response) => parseResponse(response),
      providesTags: ["Categories"],
    }),
    addCategory: builder.mutation({
      query: ({ libraryId, payload }) => ({
        url: `/libraries/${libraryId}/categories`,
        method: "POST",
        data: removeLinks(payload),
      }),
      invalidatesTags: ["Categories"],
    }),
    updateCategory: builder.mutation({
      query: ({ libraryId, categoryId, payload }) => ({
        url: `/libraries/${libraryId}/categories/${categoryId}`,
        method: "PUT",
        data: removeLinks(payload),
      }),
      invalidatesTags: ["Categories"],
    }),
    deleteCategory: builder.mutation({
      query: ({ libraryId, categoryId }) => ({
        url: `/libraries/${libraryId}/categories/${categoryId}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Categories"],
    }),
  }),
});

export const {
  useGetCategoriesQuery,
  useGetCategoryByIdQuery,
  useAddCategoryMutation,
  useUpdateCategoryMutation,
  useDeleteCategoryMutation,
} = categoriesApi;
