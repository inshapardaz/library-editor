import { createApi } from "@reduxjs/toolkit/query/react";

// Local Imports
import axiosBaseQuery from "@/utils/axiosBaseQuery";

import { parseResponse } from "@/utils/parseResponse";
// ----------------------------------------------

export const categoriesApi = createApi({
  reducerPath: "categories",
  baseQuery: axiosBaseQuery(),
  tagTypes: ["Categories"],
  endpoints: (builder) => ({
    getCategories: builder.query({
      query: ({ libraryId, query = null, pageNumber = 1, pageSize = 12 }) => {
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
  }),
});

export const {
  useGetCategoriesQuery,
  useGetCategoryByIdQuery,
} = categoriesApi;
