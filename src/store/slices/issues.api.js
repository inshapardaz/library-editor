import { createApi } from "@reduxjs/toolkit/query/react";

import axiosBaseQuery from "@/utils/axiosBaseQuery";

import { parseResponse } from "@/utils/parseResponse";
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
                volumeNumber = null,
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
                if (volumeNumber) {
                    queryVal += `&volumeNumber=${volumeNumber}`;
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
                url: `/libraries/${libraryId}/periodicals/${periodicalId}/volumes/${volumeNumber}/issues/${issueNumber}/articles/${articleNumber}`,
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
                url: `/libraries/${libraryId}/periodicals/${periodicalId}/volumes/${volumeNumber}/issues/${issueNumber}/articles/${articleNumber}/contents`,
                method: "get",
            }),
            transformResponse: (response) => parseResponse(response),
            providesTags: ["IssueArticlesContent"],
        }),

        // Issue Page Api
        getIssuePages: builder.query({
            query: ({
                url,
                status = "Typing",
                assignment = null,
                reviewerAssignmentFilter = null,
                pageNumber = 1,
                pageSize = 12,
                sortDirection = "ascending",
            }) => {
                let queryVal = `?pageNumber=${pageNumber}&pageSize=${pageSize}${status ? `&status=${status}` : ""
                    }${assignment ? `&assignmentFilter=${assignment}` : ""}${reviewerAssignmentFilter
                        ? `&reviewerAssignmentFilter=${reviewerAssignmentFilter}`
                        : ""
                    }${sortDirection != "ascending"
                        ? `&sortDirection=${sortDirection}`
                        : ""
                    }`;
                return {
                    url: `${url}${queryVal}`,
                };
            },
            transformResponse: (response) => parseResponse(response),
            providesTags: ["IssuePages"],
        }),
        getIssuePage: builder.query({
            query: ({
                libraryId,
                periodicalId,
                volumeNumber,
                issueNumber,
                pageNumber,
            }) => ({
                url: `/libraries/${libraryId}/periodicals/${periodicalId}/volumes/${volumeNumber}/issues/${issueNumber}/pages/${pageNumber}`,
                method: "GET",
            }),
            transformResponse: (response) => parseResponse(response),
            providesTags: ["IssuePages"],
        }),
        getIssuePageContents: builder.query({
            query: ({
                libraryId,
                periodicalId,
                volumeNumber,
                issueNumber,
                pageNumber,
            }) => ({
                url: `/libraries/${libraryId}/periodicals/${periodicalId}/volumes/${volumeNumber}/issues/${issueNumber}/pages/${pageNumber}`,
                method: "GET",
            }),
            transformResponse: (response) => parseResponse(response),
            providesTags: ["IssuePages"],
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
    useGetIssuePagesQuery,
    useGetIssuePageQuery,
} = issuesApi;
