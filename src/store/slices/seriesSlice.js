import { createApi } from "@reduxjs/toolkit/query/react";

import axiosBaseQuery from "~/src/util/axiosBaseQuery";

import { parseResponse, removeLinks } from "~/src/util/parseResponse";
// ----------------------------------------------
export const seriesApi = createApi({
  reducerPath: "series",
  baseQuery: axiosBaseQuery(),
  tagTypes: ["Series", "Serie"],
  endpoints: (builder) => ({
    getSeries: builder.query({
      query: ({ libraryId, query, pageNumber, pageSize }) => {
        let queryVal = query ? `&query=${query}` : "";
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
  useGetSeriesByIdQuery,
  useAddSeriesMutation,
  useUpdateSeriesMutation,
  useDeleteSeriesMutation,
  useUpdateSeriesImageMutation,
} = seriesApi;
