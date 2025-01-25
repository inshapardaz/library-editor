import { createApi } from "@reduxjs/toolkit/query/react";

// local Imports
import axiosBaseQuery from "@/utils/axiosBaseQuery";
import { parseResponse, removeLinks } from "@/utils/parseResponse";

// ----------------------------------------------
export const librariesApi = createApi({
    reducerPath: "libraries",
    baseQuery: axiosBaseQuery(),
    tagTypes: ["Libraries", "Library"],
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
            query: ({ payload }) => ({
                url: `/libraries`,
                method: "POST",
                data: removeLinks(payload),
            }),
            transformResponse: (response) => parseResponse(response),
            invalidatesTags: ["Libraries"],
        }),
        updateLibrary: builder.mutation({
            query: ({ libraryId, payload }) => ({
                url: `/libraries/${libraryId}`,
                method: "PUT",
                data: removeLinks(payload),
            }),
            transformResponse: (response) => parseResponse(response),
            invalidatesTags: ["Library", "Libraries"],
        }),
        deleteLibrary: builder.mutation({
            query: ({ library }) => ({
                url: library.links.delete,
                method: "DELETE",
            }),
            invalidatesTags: ["Library", "Libraries"],
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
            invalidatesTags: ["Library", "Libraries"],
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
