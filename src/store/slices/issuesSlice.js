import { createApi } from "@reduxjs/toolkit/query/react";

import axiosBaseQuery from "/src/util/axiosBaseQuery";

import { parseResponse, removeLinks } from "/src/util/parseResponse";
// ----------------------------------------------
export const issuesApi = createApi({
    reducerPath: "issues",
    baseQuery: axiosBaseQuery(),
    tagTypes: ["Issues", "Issue"],
    endpoints: (builder) => ({
        getIssues: builder.query({
            query: ({
                libraryId,
                periodicalId,
                query = null,
                year = null,
                categories = null,
                sortBy = null,
                sortDirection = null,
                status = null,
                pageNumber = 1,
                pageSize = 12,
            }) => {
                let queryVal = query ? `&query=${query}` : "";
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

                if (year) {
                    queryVal += `&year=${year}`;
                }

                return {
                    url: `/libraries/${libraryId}/periodicals/${periodicalId}/issues?pageNumber=${pageNumber}&pageSize=${pageSize}${queryVal}`,
                    method: "get",
                };
            },
            transformResponse: (response) => parseResponse(response),
            providesTags: ["Issues"],
        }),
        getIssuesYears: builder.query({
            query: ({ libraryId, periodicalId, sortDirection = null }) => {
                let queryVal = sortDirection
                    ? `?sortDirection=${sortDirection}`
                    : "";
                return {
                    url: `/libraries/${libraryId}/periodicals/${periodicalId}/issues/years${queryVal}`,
                    method: "get",
                };
            },
            transformResponse: (response) => parseResponse(response),
            providesTags: ["Issues"],
        }),
        getIssue: builder.query({
            query: ({
                libraryId,
                periodicalId,
                volumeNumber,
                issueNumber,
            }) => ({
                url: `/libraries/${libraryId}/periodicals/${periodicalId}/volumes/${volumeNumber}/issues/${issueNumber}`,
                method: "get",
            }),
            transformResponse: (response) => parseResponse(response),
            providesTags: ["Issue"],
        }),
        getIssueArticles: builder.query({
            query: ({
                libraryId,
                periodicalId,
                volumeNumber,
                issueNumber,
            }) => ({
                url: `/libraries/${libraryId}/periodicals/${periodicalId}/volumes/${volumeNumber}/issues/${issueNumber}/articles`,
                method: "get",
            }),
            transformResponse: (response) => parseResponse(response),
            providesTags: ["IssueArticles"],
        }),
        getArticle: builder.query({
            query: ({
                libraryId,
                periodicalId,
                volumeNumber,
                issueNumber,
                articleNumber,
            }) => ({
                url: `/libraries/${libraryId}/periodicals/${periodicalId}/volumes/${volumeNumber}/issues/${issueNumber}/article/${articleNumber}`,
                method: "get",
            }),
            transformResponse: (response) => parseResponse(response),
            providesTags: ["Article"],
        }),
        getArticleContents: builder.query({
            query: ({
                libraryId,
                periodicalId,
                volumeNumber,
                issueNumber,
                articleNumber,
            }) => ({
                url: `/libraries/${libraryId}/periodicals/${periodicalId}/volumes/${volumeNumber}/issues/${issueNumber}/article/${articleNumber}/contents`,
                method: "get",
            }),
            transformResponse: (response) => parseResponse(response),
            providesTags: ["IssueArticlesContent"],
        }),
        addIssue: builder.mutation({
            query: ({
                libraryId,
                periodicalId,
                volumeNumber,
                issueNumber,
                payload,
            }) => ({
                url: `/libraries/${libraryId}/periodicals/${periodicalId}/volumes/${volumeNumber}/issues/${issueNumber}`,
                method: "POST",
                data: removeLinks(payload),
            }),
            invalidatesTags: ["Issues"],
        }),
        updateIssue: builder.mutation({
            query: ({
                libraryId,
                periodicalId,
                volumeNumber,
                issueNumber,
                payload,
            }) => ({
                url: `/libraries/${libraryId}/periodicals/${periodicalId}/volumes/${volumeNumber}/issues/${issueNumber}`,
                method: "PUT",
                data: removeLinks(payload),
            }),
            invalidatesTags: ["Issue"],
        }),
        updateIssueImage: builder.mutation({
            query: ({ issue, payload }) => {
                const formData = new FormData();
                formData.append("file", payload, payload.fileName);
                return {
                    url: issue.links.image_upload,
                    method: "PUT",
                    data: formData,
                    formData: true,
                    headers: {
                        "content-type": "multipart/form-data",
                    },
                };
            },
            invalidatesTags: ["Issue"],
        }),
        deleteIssue: builder.mutation({
            query: ({ issue }) => ({
                url: issue.links.delete,
                method: "DELETE",
            }),
            invalidatesTags: ["Issues"],
        }),
        addIssueContent: builder.mutation({
            query: ({ issue, payload, language }) => {
                const formData = new FormData();
                formData.append("file", payload, payload.fileName);
                return {
                    url: issue.links.add_content,
                    method: "POST",
                    data: formData,
                    formData: true,
                    headers: {
                        "Content-Type": "multipart/form-data",
                        "Accept-Language'": language,
                    },
                };
            },
            transformResponse: (response) => parseResponse(response),
            invalidatesTags: ["Issue"],
        }),
        updateIssueContent: builder.mutation({
            query: ({ content, payload, language }) => {
                const formData = new FormData();
                formData.append("file", payload, payload.fileName);
                return {
                    url: content.links.update,
                    method: "PUT",
                    data: formData,
                    formData: true,
                    headers: {
                        "Content-Type": "multipart/form-data",
                        "Accept-Language'": language,
                    },
                };
            },
            transformResponse: (response) => parseResponse(response),
            invalidatesTags: ["Issue"],
        }),
        deleteIssueContent: builder.mutation({
            query: ({ content }) => ({
                url: content.links.delete,
                method: "DELETE",
            }),
            invalidatesTags: ["Issue"],
        }),
    }),
});

export const {
    useGetIssuesQuery,
    useGetIssuesYearsQuery,
    useGetIssueQuery,
    useGetIssueArticlesQuery,
    useGetArticleQuery,
    useGetArticleContentsQuery,
    useAddIssueMutation,
    useUpdateIssueMutation,
    useUpdateIssueImageMutation,
    useDeleteIssueMutation,
    useAddIssueContentMutation,
    useUpdateIssueContentMutation,
    useDeleteIssueContentMutation,
} = issuesApi;
