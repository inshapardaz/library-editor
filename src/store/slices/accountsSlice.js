import { createApi } from "@reduxjs/toolkit/query/react";

import axiosBaseQuery from "~/src/util/axiosBaseQuery";

import { parseResponse } from "~/src/util/parseResponse";
// ----------------------------------------------
export const accountsApi = createApi({
  reducerPath: "accounts",
  baseQuery: axiosBaseQuery(),
  endpoints: (builder) => ({
    getAccounts: builder.query({
      query: (query = null, pageNumber = 1, pageSize = 12) => {
        let queryVal = query ? `&query=${query}` : "";
        return {
          url: `/libraries?pageNumber=${pageNumber}&pageSize=${pageSize}${queryVal}`,
          method: "get",
        };
      },
      transformResponse: (response) => parseResponse(response),
    }),
    getWriters: builder.query({
      query: ({ libraryId, query = null, pageNumber = 1, pageSize = 12 }) => {
        let queryVal = query ? `&query=${query}` : "";
        return {
          url: `/libraries/${libraryId}/writers?pageNumber=${pageNumber}&pageSize=${pageSize}${queryVal}`,
          method: "get",
        };
      },
      transformResponse: (response) => parseResponse(response),
    }),
  }),
});

export const { useGetAccountsQuery, useGetWritersQuery } = accountsApi;
