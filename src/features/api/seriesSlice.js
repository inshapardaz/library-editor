import { createApi } from '@reduxjs/toolkit/query/react'

import { axiosBaseQuery } from '../../helpers/axios.helpers'

import { parseResponse } from '../../helpers/parseResponse';
// ----------------------------------------------
export const seriesApi = createApi({
    reducerPath: 'series',
    baseQuery: axiosBaseQuery({ baseUrl: process.env.REACT_APP_API_URL }),
    endpoints: (builder) => ({
        getSeries: builder.query({
            query: ({ libraryId, query, pageNumber, pageSize }) => {
                let queryVal = query ? `&query=${query}` : '';
                return ({ url: `/libraries/${libraryId}/series?pageNumber=${pageNumber}&pageSize=${pageSize}${queryVal}`, method: 'get' })
            },
            transformResponse: (response) => parseResponse(response)
        }),
        getSeriesById: builder.query({
            query: ({ libraryId, seriesId }) =>
                ({ url: `/libraries/${libraryId}/series/${seriesId}`, method: 'get' }),
            transformResponse: (response) => parseResponse(response)
        }),
    }),
})


export const { useGetSeriesQuery, useGetSeriesByIdQuery } = seriesApi
