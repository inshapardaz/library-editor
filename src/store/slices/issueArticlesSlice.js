import { createApi } from "@reduxjs/toolkit/query/react";

import axiosBaseQuery from "/src/util/axiosBaseQuery";

import { parseResponse, removeLinks } from "/src/util/parseResponse";
import { processMultipleRequests } from "/src/util";
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
            invalidatesTags: ["IssueArticles"],
        }),
        updateIssueArticle: builder.mutation({
            query: ({ url, payload }) => ({
                url: url,
                method: "PUT",
                data: removeLinks(payload),
            }),
            invalidatesTags: ["IssueArticles"],
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
                error ? [] : ["IssueArticles"],
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
        assignIssueArticle: builder.mutation({
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
    }),
});

export const {
    useGetIssueArticlesQuery,
    useAddIssueArticleMutation,
    useUpdateIssueArticleMutation,
    useUpdateIssueArticlesMutation,
    useDeleteIssueArticlesMutation,
    useAssignIssueArticleMutation,
    useUpdateIssueArticleSequenceMutation,
} = issueArticlesApi;
