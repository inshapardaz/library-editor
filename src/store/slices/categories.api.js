import { createApi } from "@reduxjs/toolkit/query/react";

// Local Imports
import axiosBaseQuery from "@/utils/axiosBaseQuery";

import { parseResponse, removeLinks } from "@/utils/parseResponse";
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
        getCategory: builder.query({
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
            invalidatesTags: ["Category"],
        }),
        deleteCategory: builder.mutation({
            query: ({ libraryId, categoryId }) => ({
                url: `/libraries/${libraryId}/categories/${categoryId}`,
                method: "DELETE",
            }),
            invalidatesTags: ["Categories", "Category"],
        }),
    }),
});

export const {
    useGetCategoriesQuery,
    useGetCategoryQuery,
    useAddCategoryMutation,
    useUpdateCategoryMutation,
    useDeleteCategoryMutation,
} = categoriesApi;
