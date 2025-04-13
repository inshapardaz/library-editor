import { createApi } from "@reduxjs/toolkit/query/react";

import axiosBaseQuery from "@/utils/axiosBaseQuery";
import { parseResponse, removeLinks } from "@/utils/parseResponse";
// ----------------------------------------------
export const seriesApi = createApi({
  reducerPath: "series",
  baseQuery: axiosBaseQuery(),
  tagTypes: ["Series", "Serie"],
  endpoints: (builder) => ({
    getSeries: builder.query({
      query: ({ libraryId, query, pageNumber, pageSize, sortBy, sortDirection }) => {
        let queryVal = query && query.length > 0 ? `&query=${query}` : "";
        if (sortBy) {
          queryVal += `&sortBy=${sortBy}`;
        }
        if (sortDirection) {
          queryVal += `&sortDirection=${sortDirection}`;
        }
        return {
          url: `/libraries/${libraryId}/series?pageNumber=${pageNumber}&pageSize=${pageSize}${queryVal}`,
          method: "get",
        };
      },
      transformResponse: (response) => parseResponse(response),
      providesTags: ["Series"],
    }),
    getSeriesById: builder.query({
      query: ({ libraryId, seriesId }) => ({
        url: `/libraries/${libraryId}/series/${seriesId}`,
        method: "get",
      }),
      transformResponse: (response) => parseResponse(response),
      providesTags: ["Series"],
    }),
    addSeries: builder.mutation({
      query: ({ libraryId, payload }) => ({
        url: `/libraries/${libraryId}/series`,
        method: "POST",
        data: removeLinks(payload),
      }),
      invalidatesTags: ["Series"],
    }),
    updateSeries: builder.mutation({
      query: ({ libraryId, seriesId, payload }) => ({
        url: `/libraries/${libraryId}/series/${seriesId}`,
        method: "PUT",
        data: removeLinks(payload),
      }),
      invalidatesTags: ["Series"],
    }),
    deleteSeries: builder.mutation({
      query: ({ libraryId, seriesId }) => ({
        url: `/libraries/${libraryId}/series/${seriesId}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Series"],
    }),
    updateSeriesImage: builder.mutation({
      query: ({ libraryId, seriesId, payload }) => {
        const formData = new FormData();
        formData.append("file", payload, payload.fileName);
        return {
          url: `/libraries/${libraryId}/series/${seriesId}/image`,
          method: "PUT",
          data: formData,
          formData: true,
          headers: {
            "content-type": "multipart/form-data",
          },
        };
      },
      invalidatesTags: ["Series"],
    }),
  }),
});

export const {
  useGetSeriesQuery,
  useLazyGetSeriesQuery,
  useGetSeriesByIdQuery,
  useAddSeriesMutation,
  useUpdateSeriesMutation,
  useDeleteSeriesMutation,
  useUpdateSeriesImageMutation,
} = seriesApi;
