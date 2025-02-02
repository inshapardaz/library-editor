import { createApi } from "@reduxjs/toolkit/query/react";

import axiosBaseQuery from "@/utils/axiosBaseQuery";

import { parseResponse, removeLinks } from "@/utils/parseResponse";
import { processMultipleRequests } from "@/utils";
// ----------------------------------------------
export const issueArticlesApi = createApi({
    reducerPath: "issueArticles",
    baseQuery: axiosBaseQuery(),
    tagTypes: ["Articles", "Article"],
    endpoints: (builder) => ({
        getIssueArticles: builder.query({
            query: ({
                libraryId,
                periodicalId,
                volumeNumber,
                issueNumber,
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
                pageSize = 12,
            }) => {
                let queryVal = query ? `&query=${query}` : "";
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
                    queryVal += "&favorite=true";
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
                return {
                    url: `/libraries/${libraryId}/periodicals/${periodicalId}/volumes/${volumeNumber}/issues/${issueNumber}/articles?pageNumber=${pageNumber}&pageSize=${pageSize}${queryVal}`,
                    method: "get",
                };
            },
            transformResponse: (response) => parseResponse(response),
            providesTags: ["IssueArticles"],
        }),
        getIssueArticle: builder.query({
            query: ({ libraryId,
                periodicalId,
                volumeNumber,
                issueNumber,
                articleNumber }) => ({
                    url: `/libraries/${libraryId}/periodicals/${periodicalId}/volumes/${volumeNumber}/issues/${issueNumber}/articles/${articleNumber}`,
                    method: "get",
                }),
            transformResponse: (response) => parseResponse(response),
            providesTags: ["IssueArticle"],
        }),
        addIssueArticle: builder.mutation({
            query: ({
                libraryId,
                periodicalId,
                volumeNumber,
                issueNumber,
                payload,
            }) => ({
                url: `/libraries/${libraryId}/periodicals/${periodicalId}/volumes/${volumeNumber}/issues/${issueNumber}/articles`,
                method: "POST",
                data: removeLinks(payload),
            }),
            invalidatesTags: ["Article", "IssueArticles"],
        }),
        updateIssueArticle: builder.mutation({
            query: ({ url, payload }) => ({
                url: url,
                method: "PUT",
                data: removeLinks(payload),
            }),
            invalidatesTags: ["IssueArticle", "IssueArticles"],
        }),
        deleteIssueArticle: builder.mutation({
            query: ({ issueArticle }) => ({
                url: issueArticle.links.delete,
                method: "DELETE",
            }),
            invalidatesTags: ["IssueArticle", "IssueArticles"],
        }),
        deleteIssueArticles: builder.mutation({
            async queryFn(
                { requests, payload, onProgress },
                _queryApi,
                _extraOptions,
                baseQuery
            ) {
                return processMultipleRequests({
                    baseQuery,
                    method: "DELETE",
                    url: (request) => request.data.links.delete,
                    requests,
                    payload,
                    onProgress,
                });
            },
            invalidatesTags: (result, error) =>
                error ? [] : ["IssueArticle", "IssueArticles"],
        }),
        updateIssueArticles: builder.mutation({
            async queryFn(
                { requests, payload, onProgress },
                _queryApi,
                _extraOptions,
                baseQuery
            ) {
                return processMultipleRequests({
                    baseQuery,
                    method: "PUT",
                    url: (request) => request.data.links.update,
                    requests,
                    payload,
                    onProgress,
                });
            },
            invalidatesTags: (result, error) =>
                error ? [] : ["IssueArticles"],
        }),
        assignIssueArticles: builder.mutation({
            async queryFn(
                { requests, payload, onProgress },
                _queryApi,
                _extraOptions,
                baseQuery
            ) {
                return processMultipleRequests({
                    baseQuery,
                    method: "POST",
                    url: (request) => request.data.links.assign,
                    requests,
                    payload,
                    onProgress,
                });
            },
            invalidatesTags: (result, error) =>
                error ? [] : ["IssueArticles"],
        }),
        updateIssueArticleSequence: builder.mutation({
            query: ({
                libraryId,
                periodicalId,
                volumeNumber,
                issueNumber,
                payload,
            }) => ({
                url: `/libraries/${libraryId}/periodicals/${periodicalId}/volumes/${volumeNumber}/issues/${issueNumber}/articles/sequence`,
                method: "POST",
                data: removeLinks(payload),
            }),
            invalidatesTags: ["IssueArticles"],
        }),
        getIssueArticleContent: builder.query({
            query: ({ libraryId,
                periodicalId,
                volumeNumber,
                issueNumber,
                articleNumber,
                language }) => ({
                    url: `/libraries/${libraryId}/periodicals/${periodicalId}/volumes/${volumeNumber}/issues/${issueNumber}/articles/${articleNumber}/contents?language=${language}`,
                    method: "get",
                }),
            transformResponse: (response) => parseResponse(response),
            providesTags: ["IssueArticleContent"],
        }),
    }),
});

export const {
    useGetIssueArticlesQuery,
    useGetIssueArticleQuery,
    useAddIssueArticleMutation,
    useUpdateIssueArticleMutation,
    useUpdateIssueArticlesMutation,
    useDeleteIssueArticleMutation,
    useDeleteIssueArticlesMutation,
    useAssignIssueArticlesMutation,
    useUpdateIssueArticleSequenceMutation,
    useGetIssueArticleContentQuery,
} = issueArticlesApi;
