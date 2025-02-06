import { createApi } from "@reduxjs/toolkit/query/react";

import axiosBaseQuery from "@/utils/axiosBaseQuery";

import { processMultipleRequests } from "@/utils";
import { parseResponse, removeLinks } from "@/utils/parseResponse";
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
            transformResponse: (response) => parseResponse(response),
            invalidatesTags: ["Issues"],
        }),
        updateIssue: builder.mutation({
            query: ({
                issue,
                payload,
            }) => ({
                url: issue.links.update,
                method: "PUT",
                data: removeLinks(payload),
            }),
            transformResponse: (response) => parseResponse(response),
            invalidatesTags: ["Issue"],
        }),
        updateIssueImage: builder.mutation({
            query: ({ libraryId, periodicalId, volumeNumber, issueNumber, payload }) => {
                const formData = new FormData();
                formData.append("file", payload, payload.fileName);
                return {
                    url: `/libraries/${libraryId}/periodicals/${periodicalId}/volumes/${volumeNumber}/issues/${issueNumber}/image`,
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
        publishIssue: builder.mutation({
            query: ({ issue }) => ({
                url: issue.links.publish,
                method: "POST",
            }),
            invalidatesTags: ["Issues", "Issue"],
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
        // Issue Page Api
        getIssuePages: builder.query({
            query: ({
                url,
                status = "Typing",
                writerAssignmentFilter = null,
                reviewerAssignmentFilter = null,
                pageNumber = 1,
                pageSize = 12,
                sortDirection = "ascending",
            }) => {
                let queryVal = `?pageNumber=${pageNumber}&pageSize=${pageSize}${status ? `&status=${status}` : ""
                    }${writerAssignmentFilter ? `&writerAssignmentFilter=${writerAssignmentFilter}` : ""}${reviewerAssignmentFilter
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
        addIssuePage: builder.mutation({
            query: ({
                libraryId,
                periodicalId,
                volumeNumber,
                issueNumber,
                payload,
            }) => ({
                url: `/libraries/${libraryId}/periodicals/${periodicalId}/volumes/${volumeNumber}/issues/${issueNumber}/pages`,
                method: "POST",
                data: removeLinks(payload),
            }),
            transformResponse: (response) => parseResponse(response),
            invalidatesTags: ["IssuePage", "IssuePages"],
        }),
        updateIssuePage: builder.mutation({
            query: ({ page }) => ({
                url: page.links.update,
                method: "PUT",
                data: removeLinks(page),
            }),
            transformResponse: (response) => parseResponse(response),
            invalidatesTags: ["IssuePage", "IssuePages"],
        }),
        updateIssuePages: builder.mutation({
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
            transformResponse: (response) => parseResponse(response),
            invalidatesTags: (result, error) => (error ? [] : ["IssuePage", "IssuePages"]),
        }),
        deleteIssuePage: builder.mutation({
            query: ({ page }) => ({
                url: page.links.delete,
                method: "DELETE",
            }),
            invalidatesTags: ["IssuePage", "IssuePages"],
        }),
        deleteIssuePages: builder.mutation({
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
            invalidatesTags: (result, error) => (error ? [] : ["IssuePage", "IssuePages"]),
        }),
        assignIssuePage: builder.mutation({
            query: ({ page, payload }) => ({
                url:
                    payload.accountId === "me"
                        ? page.links.assign_to_me
                        : page.links.assign,
                method: "POST",
                data: removeLinks(payload),
            }),
            invalidatesTags: ["IssuePages"],
        }),
        assignIssuePages: builder.mutation({
            async queryFn(
                { requests, payload, onProgress },
                _queryApi,
                _extraOptions,
                baseQuery
            ) {
                return processMultipleRequests({
                    baseQuery,
                    method: "POST",
                    url: (request, payload) =>
                        payload.accountId === "me"
                            ? request.data.links.assign_to_me
                            : request.data.links.assign,
                    requests,
                    payload,
                    onProgress,
                });
            },
            invalidatesTags: (result, error) => (error ? [] : ["IssuePages"]),
        }),
        ocrIssuePage: builder.mutation({
            query: ({ page, key }) => ({
                url: page.links.ocr,
                method: "POST",
                data: { key: key },
            }),
            invalidatesTags: ["IssuePages"],
        }),
        ocrIssuePages: builder.mutation({
            async queryFn(
                { requests, payload, onProgress },
                _queryApi,
                _extraOptions,
                baseQuery
            ) {
                return processMultipleRequests({
                    baseQuery,
                    method: "PUT",
                    url: (request) => {
                        return request.data.links.ocr;
                    },
                    requests,
                    payload,
                    onProgress,
                });
            },
            invalidatesTags: (result, error) => (error ? [] : ["IssuePages"]),
        }),
        updateIssuePageImage: builder.mutation({
            query: ({ page, payload }) => {
                const formData = new FormData();
                formData.append("file", payload, payload.fileName);
                return {
                    url: page.links.image_upload,
                    method: "PUT",
                    data: formData,
                    formData: true,
                    headers: {
                        "content-type": "multipart/form-data",
                    },
                };
            },
            invalidatesTags: ["IssuePages"],
        }),
        updateIssuePageSequence: builder.mutation({
            query: ({ page, payload }) => ({
                url: page.links.page_sequence,
                method: "POST",
                data: removeLinks(payload),
            }),
            invalidatesTags: ["IssuePages"],
        }),
        createIssuePageWithImage: builder.mutation({
            query: ({ issue, fileList }) => {
                const formData = new FormData();
                fileList.forEach((file, index) => {
                    formData.append(index, file, `${index}.jpg`);
                });
                return {
                    url: issue.links.create_multiple,
                    method: "POST",
                    data: formData,
                    formData: true,
                    headers: {
                        "content-type": "multipart/form-data",
                    },
                };
            },
            invalidatesTags: ["Issue", "IssuePages"],
        }),
    }),
});

export const {
    useGetIssuesQuery,
    useGetIssuesYearsQuery,
    useGetIssueQuery,
    useAddIssueMutation,
    useUpdateIssueMutation,
    useUpdateIssueImageMutation,
    useDeleteIssueMutation,
    usePublishIssueMutation,
    useAddIssueContentMutation,
    useUpdateIssueContentMutation,
    useDeleteIssueContentMutation,
    useGetArticleQuery,
    useGetArticleContentsQuery,
    useGetIssuePagesQuery,
    useGetIssuePageQuery,
    useAddIssuePageMutation,
    useUpdateIssuePageMutation,
    useUpdateIssuePagesMutation,
    useDeleteIssuePageMutation,
    useDeleteIssuePagesMutation,
    useAssignIssuePageMutation,
    useAssignIssuePagesMutation,
    useOcrIssuePageMutation,
    useOcrIssuePagesMutation,
    useUpdateIssuePageImageMutation,
    useUpdateIssuePageSequenceMutation,
    useCreateIssuePageWithImageMutation,
} = issuesApi;
