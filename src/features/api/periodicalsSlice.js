import { createApi } from '@reduxjs/toolkit/query/react'

import { axiosBaseQuery } from '../../helpers/axios.helpers'

import { parseResponse } from '../../helpers/parseResponse';
// ----------------------------------------------
export const periodicalsApi = createApi({
    reducerPath: 'periodicals',
    baseQuery: axiosBaseQuery({ baseUrl: process.env.REACT_APP_API_URL }),
    endpoints: (builder) => ({
        getPeriodicals: builder.query({
            query: ({ libraryId }) => ({ url: `/libraries/${libraryId}/periodicals`, method: 'get' }),
            transformResponse: (response) => parseResponse(response)
        }),
    }),
})


export const { useGetPeriodicalsQuery } = periodicalsApi
