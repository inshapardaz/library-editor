import { createApi } from '@reduxjs/toolkit/query/react'

import { axiosBaseQuery } from '../../helpers/axios.helpers'

import { parseResponse, removeLinks } from '../../helpers/parseResponse';
// ----------------------------------------------
export const categoriesApi = createApi({
    reducerPath: 'categories',
    baseQuery: axiosBaseQuery({ baseUrl: process.env.REACT_APP_API_URL }),
    endpoints: (builder) => ({
        getCategories: builder.query({
            query: ({ libraryId, query, pageNumber = 1, pageSize = 12 }) => {
                let queryVal = query ? `&query=${query}` : '';
                return ({ url: `/libraries/${libraryId}/categories?pageNumber=${pageNumber}&pageSize=${pageSize}${queryVal}`, method: 'get' })
            },
            transformResponse: (response) => parseResponse(response),
            providesTags: [ 'Series' ]
        }),
        getCategoryById: builder.query({
            query: ({ libraryId, categoryId }) =>
                ({ url: `/libraries/${libraryId}/categories/${categoryId}`, method: 'get' }),
            transformResponse: (response) => parseResponse(response),
            providesTags: [ 'Series' ]
        }),
        addCategory: builder.mutation({
            query: ({ libraryId, payload }) => ({
                url: `/libraries/${libraryId}/categories`,
                method: 'POST',
                payload: removeLinks(payload)
            }),
            invalidatesTags: [ 'Categories' ]
        }),
        updateCategory: builder.mutation({
            query: ({ libraryId, categoryId, payload }) => ({
                url: `/libraries/${libraryId}/categories/${categoryId}`,
                method: 'PUT',
                payload: removeLinks(payload)
            }),
            invalidatesTags: [ 'Categories' ]
        }),
        deleteCategory: builder.mutation({
            query: ({ libraryId, categoryId }) => ({
                url: `/libraries/${libraryId}/categories/${categoryId}`,
                method: 'DELETE'
            }),
            invalidatesTags: [ 'Categories' ]
        }),
    }),
})


export const {
    useGetCategoriesQuery,
    useGetCategoryByIdQuery,
    useAddCategoryMutation,
    useUpdateCategoryMutation,
    useDeleteCategoryMutation, } = categoriesApi
