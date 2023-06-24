import { createApi } from '@reduxjs/toolkit/query/react'

import { axiosBaseQuery } from '../../helpers/axios.helpers'

import { parseResponse, removeLinks } from '../../helpers/parseResponse';
// ----------------------------------------------
export const authorsApi = createApi({
    reducerPath: 'authors',
    baseQuery: axiosBaseQuery({ baseUrl: process.env.REACT_APP_API_URL }),
    endpoints: (builder) => ({
        getAuthors: builder.query({
            query: ({ libraryId, query, authorType, pageNumber, pageSize }) => {
                let queryVal = query ? `&query=${query}` : '';
                if (authorType) {
                    queryVal += `authorType=${authorType}`;
                }
                return ({ url: `/libraries/${libraryId}/authors?pageNumber=${pageNumber}&pageSize=${pageSize}${queryVal}`, method: 'get' })
            },
            transformResponse: (response) => parseResponse(response)
        }),
        getAuthorById: builder.query({
            query: ({ libraryId, authorId }) =>
                ({ url: `/libraries/${libraryId}/authors/${authorId}`, method: 'get' }),
            transformResponse: (response) => parseResponse(response)
        }),
        addAuthor: builder.mutation({
            query: ({ libraryId, payload }) => ({
                url: `/libraries/${libraryId}/authors`,
                method: 'POST',
                payload: removeLinks(payload)
            })
        }),
        updateAuthor: builder.mutation({
            query: ({ libraryId, authorId, payload }) => ({
                url: `/libraries/${libraryId}/authors/${authorId}`,
                method: 'PUT',
                payload: removeLinks(payload)
            })
        }),
        updateAuthorImage: builder.mutation({
            query: ({ libraryId, authorId, payload }) => {
                const formData = new FormData();
                formData.append('file', payload, payload.fileName);
                return ({
                    url: `/libraries/${libraryId}/authors/${authorId}/image`,
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


export const { useGetAuthorsQuery,
    useGetAuthorByIdQuery,
    useAddAuthorMutation,
    useUpdateAuthorMutation,
    useUpdateAuthorImageMutation } = authorsApi
