import { createApi } from '@reduxjs/toolkit/query/react'

import { axiosBaseQuery } from '../../helpers/axios.helpers'

import { parseResponse } from '../../helpers/parseResponse';
// ----------------------------------------------
export const categoriesApi = createApi({
    reducerPath: 'categories',
    baseQuery: axiosBaseQuery({ baseUrl: process.env.REACT_APP_API_URL }),
    endpoints: (builder) => ({
        getCategories: builder.query({
            query: ({ libraryId }) => ({ url: `/libraries/${libraryId}/categories`, method: 'get' }),
            transformResponse: (response) => parseResponse(response)
        }),
    }),
})


export const { useGetCategoriesQuery } = categoriesApi
