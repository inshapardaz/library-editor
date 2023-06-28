import { createApi } from '@reduxjs/toolkit/query/react'

import { axiosBaseQuery } from '../../helpers/axios.helpers'

import { parseResponse, removeLinks } from '../../helpers/parseResponse';
// ----------------------------------------------
export const issuesApi = createApi({
    reducerPath: 'issues',
    baseQuery: axiosBaseQuery({ baseUrl: process.env.REACT_APP_API_URL }),
    endpoints: (builder) => ({
        getIssues: builder.query({
            query: ({ libraryId,
                periodicalId,
                query = null,
                categories = null,
                sortBy = null,
                sortDirection = null,
                status = null,
                pageNumber = 1,
                pageSize = 12 }) => {
                let queryVal = query ? `&query=${query}` : '';
                if (categories) {
                    queryVal += `&categoryId=${categories}`;
                }
                if (sortBy) {
                    queryVal += `&sortBy=${sortBy}`;
                }
                if (status) {
                    queryVal += `&status=${status}`;
                }
                if (sortDirection) {
                    queryVal += `&sortDirection=${sortDirection}`;
                }
                return ({ url: `/libraries/${libraryId}/periodicals/${periodicalId}/issues?pageNumber=${pageNumber}&pageSize=${pageSize}${queryVal}`, method: 'get' })
            },
            transformResponse: (response) => parseResponse(response)
        }),
        getIssue: builder.query({
            query: ({ libraryId, periodicalId, volumeNumber, issueNumber }) => ({ url: `/libraries/${libraryId}/periodicals/${periodicalId}/volumes/${volumeNumber}/issues/${issueNumber}`, method: 'get' }),
            transformResponse: (response) => parseResponse(response)
        }),
        getIssueArticles: builder.query({
            query: ({ libraryId, periodicalId, volumeNumber, issueNumber }) => ({ url: `/libraries/${libraryId}/periodicals/${periodicalId}/volumes/${volumeNumber}/issues/${issueNumber}/articles`, method: 'get' }),
            transformResponse: (response) => parseResponse(response)
        }),
        getArticle: builder.query({
            query: ({ libraryId, periodicalId, volumeNumber, issueNumber, articleNumber }) => ({ url: `/libraries/${libraryId}/periodicals/${periodicalId}/volumes/${volumeNumber}/issues/${issueNumber}/article/${articleNumber}`, method: 'get' }),
            transformResponse: (response) => parseResponse(response)
        }),
        getArticleContents: builder.query({
            query: ({ libraryId, periodicalId, volumeNumber, issueNumber, articleNumber }) => ({ url: `/libraries/${libraryId}/periodicals/${periodicalId}/volumes/${volumeNumber}/issues/${issueNumber}/article/${articleNumber}/contents`, method: 'get' }),
            transformResponse: (response) => parseResponse(response)
        }),
        addIssue: builder.mutation({
            query: ({ libraryId, periodicalId, volumeNumber, issueNumber, payload }) => ({
                url: `/libraries/${libraryId}/periodicals/${periodicalId}/volumes/${volumeNumber}/issues/${issueNumber}`,
                method: 'POST',
                payload: removeLinks(payload)
            })
        }),
        updateIssue: builder.mutation({
            query: ({ libraryId, periodicalId, volumeNumber, issueNumber, payload }) => ({
                url: `/libraries/${libraryId}/periodicals/${periodicalId}/volumes/${volumeNumber}/issues/${issueNumber}`,
                method: 'PUT',
                payload: removeLinks(payload)
            })
        }),
        updateIssueImage: builder.mutation({
            query: ({ libraryId, periodicalId, volumeNumber, issueNumber, payload }) => {
                const formData = new FormData();
                formData.append('file', payload, payload.fileName);
                return ({
                    url: `/libraries/${libraryId}/periodicals/${periodicalId}/volumes/${volumeNumber}/issues/${issueNumber}/image`,
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
    useGetIssuesQuery,
    useGetIssueQuery,
    useGetIssueArticlesQuery,
    useGetArticleQuery,
    useGetArticleContentsQuery,
    useAddIssueMutation,
    useUpdateIssueMutation,
    useUpdateIssueImageMutation } = issuesApi
