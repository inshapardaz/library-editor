import { createApi } from "@reduxjs/toolkit/query/react";

import axiosBaseQuery from "/src/util/axiosBaseQuery";

import { parseResponse, removeLinks } from "/src/util/parseResponse";
// ----------------------------------------------
export const periodicalsApi = createApi({
    reducerPath: "periodicals",
    baseQuery: axiosBaseQuery(),
    tagTypes: ["Periodicals", "Periodical"],
    endpoints: (builder) => ({
        getPeriodicals: builder.query({
            query: ({
                libraryId,
                query,
                sortDirection = null,
                categories = null,
                status = null,
                pageNumber = 1,
                pageSize = 12,
            }) => {
                let queryVal = query ? `&query=${query}` : "";
                if (status) {
                    queryVal += `&status=${status}`;
                }
                if (categories) {
                    queryVal += `&categoryId=${categories}`;
                }
                if (sortDirection) {
                    queryVal += `&sortDirection=${sortDirection}`;
                }
                return {
                    url: `/libraries/${libraryId}/periodicals?pageNumber=${pageNumber}&pageSize=${pageSize}${queryVal}`,
                    method: "get",
                };
            },
            transformResponse: (response) => parseResponse(response),
            providesTags: ["Periodicals"],
        }),
        getPeriodicalById: builder.query({
            query: ({ libraryId, periodicalId }) => ({
                url: `/libraries/${libraryId}/periodicals/${periodicalId}`,
                method: "get",
            }),
            transformResponse: (response) => parseResponse(response),
            providesTags: ["Periodicals"],
        }),
        addPeriodical: builder.mutation({
            query: ({ libraryId, payload }) => ({
                url: `/libraries/${libraryId}/periodicals`,
                method: "POST",
                data: removeLinks(payload),
            }),
            invalidatesTags: ["Periodicals"],
        }),
        updatePeriodical: builder.mutation({
            query: ({ libraryId, periodicalId, payload }) => ({
                url: `/libraries/${libraryId}/periodicals/${periodicalId}`,
                method: "PUT",
                data: removeLinks(payload),
            }),
            invalidatesTags: ["Periodicals"],
        }),
        deletePeriodical: builder.mutation({
            query: ({ libraryId, periodicalId }) => ({
                url: `/libraries/${libraryId}/periodicals/${periodicalId}`,
                method: "DELETE",
            }),
            invalidatesTags: ["Periodicals"],
        }),
        updatePeriodicalImage: builder.mutation({
            query: ({ libraryId, periodicalId, payload }) => {
                const formData = new FormData();
                formData.append("file", payload, payload.fileName);
                return {
                    url: `/libraries/${libraryId}/periodicals/${periodicalId}/image`,
                    method: "PUT",
                    data: formData,
                    formData: true,
                    headers: {
                        "content-type": "multipart/form-data",
                    },
                };
            },
            invalidatesTags: ["Periodicals"],
        }),
    }),
});

export const {
    useGetPeriodicalsQuery,
    useGetPeriodicalByIdQuery,
    useAddPeriodicalMutation,
    useUpdatePeriodicalMutation,
    useDeletePeriodicalMutation,
    useUpdatePeriodicalImageMutation,
} = periodicalsApi;
