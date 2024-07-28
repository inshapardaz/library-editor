import { createApi } from "@reduxjs/toolkit/query/react";

import axiosBaseQuery from "/src/util/axiosBaseQuery";

import { parseResponse, removeLinks } from "/src/util/parseResponse";
import { ProcessStatus } from "/src/models";
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
                for (const request of requests) {
                    try {
                        request.status = ProcessStatus.InProcess;
                        onProgress(request);
                        var result = await baseQuery({
                            url: request.data.links.delete,
                            method: "DELETE",
                        });
                        if (result.error) {
                            request.status = ProcessStatus.Failed;
                        } else {
                            request.status = ProcessStatus.Completed;
                        }
                        onProgress(request);
                    } catch (e) {
                        console.error(e);
                        request.status = ProcessStatus.Failed;
                        onProgress(request);
                    }
                }
                return { data: requests };
            },
            invalidatesTags: ["IssueArticles"],
        }),
        updateIssueArticles: builder.mutation({
            async queryFn(
                { requests, payload, onProgress },
                _queryApi,
                _extraOptions,
                baseQuery
            ) {
                for (const request of requests) {
                    try {
                        request.status = ProcessStatus.InProcess;
                        onProgress(request);
                        let body =
                            typeof payload === "function"
                                ? payload(request.data)
                                : payload;
                        if (body) {
                            var result = await baseQuery({
                                url: request.data.links.update,
                                method: "PUT",
                                data: removeLinks(body),
                            });

                            if (result.error) {
                                request.status = ProcessStatus.Failed;
                            } else {
                                request.status = ProcessStatus.Completed;
                            }
                        } else {
                            request.status = ProcessStatus.Skipped;
                        }
                        onProgress(request);
                    } catch (e) {
                        console.error(e);
                        request.status = ProcessStatus.Failed;
                        onProgress(request);
                    }
                }
                return { data: requests };
            },
            invalidatesTags: ["IssueArticles"],
        }),
        assignIssueArticle: builder.mutation({
            async queryFn(
                { requests, payload, onProgress },
                _queryApi,
                _extraOptions,
                baseQuery
            ) {
                for (const request of requests) {
                    try {
                        request.status = ProcessStatus.InProcess;
                        onProgress(request);
                        let body =
                            typeof payload === "function"
                                ? payload(request.data)
                                : payload;
                        if (body) {
                            var result = await baseQuery({
                                url: request.data.links.assign,
                                method: "POST",
                                data: removeLinks(body),
                            });

                            if (result.error) {
                                request.status = ProcessStatus.Failed;
                            } else {
                                request.status = ProcessStatus.Completed;
                            }
                        } else {
                            request.status = ProcessStatus.Skipped;
                        }
                        onProgress(request);
                    } catch (e) {
                        console.error(e);
                        request.status = ProcessStatus.Failed;
                        onProgress(request);
                    }
                }
                return { data: requests };
            },
            invalidatesTags: ["IssueArticles"],
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
