import { createApi } from '@reduxjs/toolkit/query/react'

import { axiosBaseQuery } from '../../helpers/axios.helpers'

import { parseResponse, removeLinks } from '../../helpers/parseResponse';
// ----------------------------------------------
export const periodicalsApi = createApi({
    reducerPath: 'periodicals',
    baseQuery: axiosBaseQuery({ baseUrl: process.env.REACT_APP_API_URL }),
    endpoints: (builder) => ({
        getPeriodicals: builder.query({
            query: ({ libraryId }) => ({ url: `/libraries/${libraryId}/periodicals`, method: 'get' }),
            transformResponse: (response) => parseResponse(response)
        }),
        getPeriodicalById: builder.query({
            query: ({ libraryId, periodicalId }) =>
                ({ url: `/libraries/${libraryId}/periodicals/${periodicalId}`, method: 'get' }),
            transformResponse: (response) => parseResponse(response)
        }),
        addPeriodical: builder.mutation({
            query: ({ libraryId, payload }) => ({
                url: `/libraries/${libraryId}/periodicals`,
                method: 'POST',
                payload: removeLinks(payload)
            })
        }),
        updatePeriodical: builder.mutation({
            query: ({ libraryId, periodicalId, payload }) => ({
                url: `/libraries/${libraryId}/periodicals/${periodicalId}`,
                method: 'PUT',
                payload: removeLinks(payload)
            })
        }),
        updatePeriodicalImage: builder.mutation({
            query: ({ libraryId, periodicalId, payload }) => {
                const formData = new FormData();
                formData.append('file', payload, payload.fileName);
                return ({
                    url: `/libraries/${libraryId}/periodicals/${periodicalId}/image`,
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
    useGetPeriodicalsQuery,
    useGetPeriodicalByIdQuery,
    useAddPeriodicalMutation,
    useUpdatePeriodicalMutation,
    useUpdatePeriodicalImageMutation } = periodicalsApi
