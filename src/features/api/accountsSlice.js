import { createApi } from '@reduxjs/toolkit/query/react'

import { axiosBaseQuery } from '../../helpers/axios.helpers'

import { parseResponse } from '../../helpers/parseResponse';
// ----------------------------------------------
export const accountsApi = createApi({
    reducerPath: 'acconnts',
    baseQuery: axiosBaseQuery({ baseUrl: process.env.REACT_APP_API_URL }),
    endpoints: (builder) => ({
        getAccounts: builder.query({
            query: (query = null, pageNumber = 1, pageSize = 12) => {
                let queryVal = query ? `&query=${query}` : '';
                return ({ url: `/libraries?pageNumber=${pageNumber}&pageSize=${pageSize}${queryVal}`, method: 'get' });
            },
            transformResponse: (response) => parseResponse(response)
        }),
        getWriters: builder.query({
            query: ({libraryId, query = null, pageNumber = 1, pageSize = 12}) => {
                let queryVal = query ? `&query=${query}` : '';
                return ({ url: `/libraries/${libraryId}/writers?pageNumber=${pageNumber}&pageSize=${pageSize}${queryVal}`, method: 'get' });
            },
            transformResponse: (response) => parseResponse(response)
        })
    }),
})


export const { useGetAccountsQuery, useGetWritersQuery } = accountsApi
