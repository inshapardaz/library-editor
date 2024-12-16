import { createApi } from "@reduxjs/toolkit/query/react";

import axiosBaseQuery from "@/utils/axiosBaseQuery";

import { parseResponse } from "@/utils/parseResponse";
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
                sortBy = null,
                sortDirection = null,
                categories = null,
                status = null,
                frequency = null,
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
                if (frequency) {
                    queryVal += `&frequency=${frequency}`;
                }
                if (sortBy) {
                    queryVal += `&sortBy=${sortBy}`;
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
    }),
});

export const {
    useGetPeriodicalsQuery,
    useGetPeriodicalByIdQuery,
    useAddPeriodicalMutation,
} = periodicalsApi;
