import { createApi } from '@reduxjs/toolkit/query/react'

import { axiosBaseQuery } from '../../helpers/axios.helpers'

import { parseResponse, removeLinks } from '../../helpers/parseResponse';
// ----------------------------------------------
export const articlesApi = createApi({
    reducerPath: 'articles',
    baseQuery: axiosBaseQuery({ baseUrl: process.env.REACT_APP_API_URL }),
    endpoints: (builder) => ({
        getArticles: builder.query({
            query: ({ libraryId,
                query = null,
                author = null,
                categories = null,
                type = null,
                sortBy = null,
                sortDirection = null,
                favorite = null,
                read = null,
                status = null,
                pageNumber = 1,
                pageSize = 12 }) => {
                let queryVal = query ? `&query=${query}` : '';
                if (author) {
                    queryVal += `&authorId=${author}`;
                }
                if (categories) {
                    queryVal += `&categoryId=${categories}`;
                }
                if (type) {
                    queryVal += `&type=${type}`;
                }
                if (sortBy) {
                    queryVal += `&sortBy=${sortBy}`;
                }
                if (favorite) {
                    queryVal += '&favorite=true';
                }
                if (read !== undefined && read !== null) {
                    queryVal += `&read=${read}`;
                }
                if (status) {
                    queryVal += `&status=${status}`;
                }
                if (sortDirection) {
                    queryVal += `&sortDirection=${sortDirection}`;
                }
                return ({ url: `/libraries/${libraryId}/articles?pageNumber=${pageNumber}&pageSize=${pageSize}${queryVal}`, method: 'get' })
            },
            transformResponse: (response) => parseResponse(response),
            providesTags: [ 'Articles' ]
        }),
        getArticle: builder.query({
            query: ({ libraryId, articleId }) => ({ url: `/libraries/${libraryId}/articles/${articleId}`, method: 'get' }),
            transformResponse: (response) => parseResponse(response),
            providesTags: [ 'Articles' ]
        }),
        getArticleContents: builder.query({
            query: ({ libraryId, articleId, language }) => ({ url: `/libraries/${libraryId}/articles/${articleId}/contents?language=${language}`, method: 'get' }),
            transformResponse: (response) => parseResponse(response)
        }),
        addArticle: builder.mutation({
            query: ({ libraryId, payload }) => ({
                url: `/libraries/${libraryId}/articles`,
                method: 'POST',
                payload: removeLinks(payload)
            }),
            invalidatesTags: [ 'Articles' ]
        }),
        updateArticle: builder.mutation({
            query: ({ libraryId, articleId, payload }) => ({
                url: `/libraries/${libraryId}/articles/${articleId}`,
                method: 'PUT',
                payload: removeLinks(payload)
            }),
            invalidatesTags: [ 'Articles' ]
        }),
        deleteArticle: builder.mutation({
            query: ({ libraryId, articleId }) => ({
                url: `/libraries/${libraryId}/articles/${articleId}`,
                method: 'DELETE'
            }),
            invalidatesTags: [ 'Articles' ]
        }),
        updateArticleImage: builder.mutation({
            query: ({ libraryId, articleId, payload }) => {
                const formData = new FormData();
                formData.append('file', payload, payload.fileName);
                return ({
                    url: `/libraries/${libraryId}/articles/${articleId}/image`,
                    method: 'PUT',
                    payload: formData,
                    formData: true,
                    headers: {
                        'content-type': 'multipart/form-data'
                    }
                });
            },
            invalidatesTags: [ 'Articles' ]
        }),
        assignArticle: builder.mutation({
            query: ({ article, payload }) => ({
                url: article.links.assign,
                method: 'POST',
                payload: removeLinks(payload)
            }),
            invalidatesTags: [ 'Article' ]
        }),
        addArticleContents: builder.mutation({
            query: ({ libraryId, articleId, language, layout, payload }) => ({
                url: `/libraries/${libraryId}/articles/${articleId}/contents`,
                method: 'POST',
                payload: {
                    language: language,
                    layout: layout,
                    text: payload
                }
            })
        }),
        updateArticleContents: builder.mutation({
            query: ({ libraryId, articleId, language, layout, payload }) => ({
                url: `/libraries/${libraryId}/articles/${articleId}/contents`,
                method: 'PUT',
                payload: {
                    language: language,
                    layout: layout,
                    text: payload
                }
            })
        }),
    }),
})

export const {
    useGetArticlesQuery,
    useGetArticleQuery,
    useGetArticleContentsQuery,
    useAddArticleMutation,
    useUpdateArticleMutation,
    useDeleteArticleMutation,
    useUpdateArticleImageMutation,
    useAssignArticleMutation,
    useAddArticleContentsMutation,
    useUpdateArticleContentsMutation
 } = articlesApi
