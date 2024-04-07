import { createApi } from "@reduxjs/toolkit/query/react";

import { axiosBaseQuery } from "../../helpers/axios.helpers";

import { parseResponse, removeLinks } from "../../helpers/parseResponse";

// ----------------------------------------------
export const librariesApi = createApi({
    reducerPath: "libraries",
    baseQuery: axiosBaseQuery({ baseUrl: process.env.REACT_APP_API_URL }),
    endpoints: (builder) => ({
        getLibraries: builder.query({
            query: ({
                query = null,
                pageNumber = 1,
                pageSize = 12,
                sortBy = null,
                sortDirection = null,
            }) => {
                let queryVal = query ? `&query=${query}` : "";
                if (sortBy) {
                    queryVal += `&sortBy=${sortBy}`;
                }
                if (sortDirection) {
                    queryVal += `&sortDirection=${sortDirection}`;
                }
                return {
                    url: `/libraries?pageNumber=${pageNumber}&pageSize=${pageSize}${queryVal}`,
                    method: "get",
                };
            },
            transformResponse: (response) => parseResponse(response),
            providesTags: ["Libraries"],
        }),
        getLibrary: builder.query({
            query: ({ libraryId }) => ({
                url: `/libraries/${libraryId}`,
                method: "get",
            }),
            transformResponse: (response) => parseResponse(response),
            providesTags: ["Libraries"],
        }),
        addLibrary: builder.mutation({
            query: ({ library }) => ({
                url: `/libraries`,
                method: "POST",
                data: removeLinks(library),
            }),
            invalidatesTags: ["Libraries"],
        }),
        updateLibrary: builder.mutation({
            query: ({ library }) => ({
                url: library.links.update,
                method: "PUT",
                data: removeLinks(library),
            }),
            invalidatesTags: ["Libraries"],
        }),
        deleteLibrary: builder.mutation({
            query: ({ library }) => ({
                url: library.links.delete,
                method: "DELETE",
            }),
            invalidatesTags: ["Libraries"],
        }),
        updateLibraryImage: builder.mutation({
            query: ({ library, payload }) => {
                const formData = new FormData();
                formData.append("file", payload, payload.fileName);
                return {
                    url: library.links.image_upload,
                    method: "PUT",
                    data: formData,
                    formData: true,
                    headers: {
                        "content-type": "multipart/form-data",
                    },
                };
            },
            invalidatesTags: ["Libraries"],
        }),
    }),
});

export const {
    useGetLibrariesQuery,
    useGetLibraryQuery,
    useAddLibraryMutation,
    useUpdateLibraryMutation,
    useDeleteLibraryMutation,
    useUpdateLibraryImageMutation,
} = librariesApi;
