import { createApi } from '@reduxjs/toolkit/query/react'

import { axiosBaseQuery } from '../../helpers/axios.helpers'

import { parseResponse } from '../../helpers/parseResponse';
// ----------------------------------------------
export const librariesApi = createApi({
    reducerPath: 'libraries',
    baseQuery: axiosBaseQuery({ baseUrl: process.env.REACT_APP_API_URL }),
    endpoints: (builder) => ({
        getLibraries: builder.query({
            query: (query = null, pageNumber = 1, pageSize = 12) => {
                let queryVal = query ? `&query=${query}` : '';
                return ({ url: `/libraries?pageNumber=${pageNumber}&pageSize=${pageSize}${queryVal}`, method: 'get' });
            },
            transformResponse: (response) => parseResponse(response)
        }),
        getLibrary: builder.query({
            query: ({ libraryId }) => ({ url: `/libraries/${libraryId}`, method: 'get' }),
            transformResponse: (response) => parseResponse(response)
        }),
    }),
})


export const { useGetLibrariesQuery, useGetLibraryQuery } = librariesApi
