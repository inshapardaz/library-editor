import { createApi } from '@reduxjs/toolkit/query/react'

import { axiosBaseQuery } from '../../helpers/axios.helpers'

import { parseResponse } from '../../helpers/parseResponse';
// ----------------------------------------------
export const toolsApi = createApi({
    reducerPath: 'tools',
    baseQuery: axiosBaseQuery({ baseUrl: process.env.REACT_APP_API_URL }),
    endpoints: (builder) => ({
        getPunctuation: builder.query({
            query: ({ language }) => {
                return ({ url: `/tools/${language}/spellchecker/punctuation`, method: 'get' })
            },
            transformResponse: (response) => parseResponse(response),
            providesTags: [ 'Punctuation' ]
        }),
        getAutoCorrect: builder.query({
            query: ({ language }) => {
                return ({ url: `/tools/${language}/spellchecker/autocorrect`, method: 'get' })
            },
            transformResponse: (response) => parseResponse(response),
            providesTags: [ 'AutoCorrect' ]
        }),
    }),
})


export const {
    useGetPunctuationQuery,
    useGetAutoCorrectQuery
 } = toolsApi
