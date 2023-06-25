import { createApi } from '@reduxjs/toolkit/query/react'

import { axiosBaseQuery } from '../../helpers/axios.helpers'

import { parseResponse, removeLinks } from '../../helpers/parseResponse';
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
        addSeries: builder.mutation({
            query: ({ libraryId, payload }) => ({
                url: `/libraries/${libraryId}/series`,
                method: 'POST',
                payload: removeLinks(payload)
            })
        }),
        updateSeries: builder.mutation({
            query: ({ libraryId, seriesId, payload }) => ({
                url: `/libraries/${libraryId}/series/${seriesId}`,
                method: 'PUT',
                payload: removeLinks(payload)
            })
        }),
        updateSeriesImage: builder.mutation({
            query: ({ libraryId, seriesId, payload }) => {
                const formData = new FormData();
                formData.append('file', payload, payload.fileName);
                return ({
                    url: `/libraries/${libraryId}/series/${seriesId}/image`,
                    method: 'PUT',
                    payload: formData,
                    formData: true,
                    headers: {
                        'content-type': 'multipart/form-data'
                    }
                });
            }
        }),
    }),
})


export const {
    useGetSeriesQuery,
    useGetSeriesByIdQuery,
    useAddSeriesMutation,
    useUpdateSeriesMutation,
    useUpdateSeriesImageMutation } = seriesApi
