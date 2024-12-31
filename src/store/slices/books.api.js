import { createApi } from "@reduxjs/toolkit/query/react";

// Local imports
import axiosBaseQuery from "@/utils/axiosBaseQuery";
import { parseResponse, removeLinks } from "@/utils/parseResponse";
import { processMultipleRequests } from '@/utils';
// ----------------------------------------------
export const booksApi = createApi({
    reducerPath: "books",
    baseQuery: axiosBaseQuery(),
    tagTypes: ["Books", "Book", "Chapters", "Chapter", "BookPages"],
    endpoints: (builder) => ({
        getBooks: builder.query({
            query: ({
                libraryId,
                query = null,
                author = null,
                category = null,
                series = null,
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
                if (category) {
                    queryVal += `&categoryId=${category}`;
                }
                if (series) {
                    queryVal += `&seriesId=${series}`;
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
                    url: `/libraries/${libraryId}/books?pageNumber=${pageNumber}&pageSize=${pageSize}${queryVal}`,
                    method: "get",
                };
            },
            transformResponse: (response) => parseResponse(response),
            providesTags: ["Books"],
        }),
        getBook: builder.query({
            query: ({ libraryId, bookId }) => ({
                url: `/libraries/${libraryId}/books/${bookId}`,
                method: "get",
            }),
            transformResponse: (response) => parseResponse(response),
            providesTags: ["Book"],
        }),
        getBookChapters: builder.query({
            query: ({ libraryId, bookId }) => ({
                url: `/libraries/${libraryId}/books/${bookId}/chapters`,
                method: "get",
            }),
            transformResponse: (response) => parseResponse(response),
            providesTags: ["Chapters"],
        }),
        getChapter: builder.query({
            query: ({ libraryId, bookId, chapterNumber }) => ({
                url: `/libraries/${libraryId}/books/${bookId}/chapters/${chapterNumber}`,
                method: "get",
            }),
            transformResponse: (response) => parseResponse(response),
            providesTags: ["Chapters"],
        }),
        getChapterContents: builder.query({
            query: ({ libraryId, bookId, chapterNumber, language }) => ({
                url: `/libraries/${libraryId}/books/${bookId}/chapters/${chapterNumber}/contents?language=${language}`,
                method: "get",
                headers: {
                    "Accept-Language": language || "en-US",
                },
            }),
            transformResponse: (response) => parseResponse(response),
            providesTags: ["ChapterContents"],
        }),
        getBookPages: builder.query({
            query: ({
                libraryId,
                bookId,
                status = "Typing",
                writerAssignmentFilter = null,
                reviewerAssignmentFilter = null,
                pageNumber = 1,
                pageSize = 12,
                sortDirection
            }) => {
                let queryVal = status ? `&status=${status}` : "";
                if (writerAssignmentFilter) {
                    queryVal += `&assignmentFilter=${writerAssignmentFilter}`;
                }
                if (reviewerAssignmentFilter) {
                    queryVal += `&reviewerAssignmentFilter=${reviewerAssignmentFilter}`;
                }
                if (sortDirection) {
                    queryVal += `&sortDirection=${sortDirection}`;
                }

                return {
                    url: `/libraries/${libraryId}/books/${bookId}/pages?pageNumber=${pageNumber}&pageSize=${pageSize}${queryVal}`,
                };
            },
            transformResponse: (response) => parseResponse(response),
            providesTags: ["BookPages"],
        }),
        getBookPage: builder.query({
            query: ({ libraryId, bookId, pageNumber }) => ({
                url: `/libraries/${libraryId}/books/${bookId}/pages/${pageNumber}`,
                method: "GET",
            }),
            transformResponse: (response) => parseResponse(response),
            providesTags: ["BookPages"],
        }),
        getBookPageContents: builder.query({
            query: ({ libraryId, bookId, pageNumber }) => ({
                url: `/libraries/${libraryId}/books/${bookId}/pages/${pageNumber}`,
                method: "GET",
            }),
            transformResponse: (response) => parseResponse(response),
            providesTags: ["BookPages"],
        }),
        addBookToFavorite: builder.mutation({
            query: ({ book }) => {
                return {
                    url: book.links.create_favorite,
                    method: "POST"
                };
            },
            invalidatesTags: ["Books", "Book"],
        }),
        removeBookFromFavorite: builder.mutation({
            query: ({ book }) => {
                return {
                    url: book.links.remove_favorite,
                    method: "DELETE"
                };
            },
            invalidatesTags: ["Books", "Book"],
        }),

        ///////////////////////////////////////////
        addBook: builder.mutation({
            query: ({ libraryId, payload }) => ({
                url: `/libraries/${libraryId}/books`,
                method: "POST",
                data: removeLinks(payload),
            }),
            transformResponse: (response) => parseResponse(response),
            invalidatesTags: ["Books"],
        }),
        updateBook: builder.mutation({
            query: ({ libraryId, bookId, payload }) => ({
                url: `/libraries/${libraryId}/books/${bookId}`,
                method: "PUT",
                data: removeLinks(payload),
            }),
            transformResponse: (response) => parseResponse(response),
            invalidatesTags: ["Books", "Book"],
        }),
        deleteBook: builder.mutation({
            query: ({ book }) => ({
                url: book.links.delete,
                method: "DELETE",
            }),
            invalidatesTags: ["Books", "Book"],
        }),
        publishBook: builder.mutation({
            query: ({ book }) => ({
                url: book.links.publish,
                method: "POST",
            }),
            invalidatesTags: ["Books", "Book"],
        }),
        updateBookImage: builder.mutation({
            query: ({ libraryId, bookId, payload }) => {
                const formData = new FormData();
                formData.append("file", payload, payload.fileName);
                return {
                    url: `/libraries/${libraryId}/books/${bookId}/image`,
                    method: "PUT",
                    data: formData,
                    formData: true,
                    headers: {
                        "content-type": "multipart/form-data",
                    },
                };
            },
            invalidatesTags: ["Book"],
        }),
        addChapter: builder.mutation({
            query: ({ libraryId, bookId, payload }) => ({
                url: `/libraries/${libraryId}/books/${bookId}/chapters`,
                method: "POST",
                data: removeLinks(payload),
            }),
            transformResponse: (response) => parseResponse(response),
            invalidatesTags: ["Chapters"],
        }),
        updateChapter: builder.mutation({
            query: ({ chapter }) => ({
                url: chapter.links.update,
                method: "PUT",
                data: removeLinks(chapter),
            }),
            transformResponse: (response) => parseResponse(response),
            invalidatesTags: ["Chapters"],
        }),
        updateChapters: builder.mutation({
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
            invalidatesTags: (result, error) => (error ? [] : ["Chapters"]),
        }),
        deleteChapters: builder.mutation({
            async queryFn(
                { requests, onProgress },
                _queryApi,
                _extraOptions,
                baseQuery
            ) {
                return processMultipleRequests({
                    baseQuery,
                    method: "DELETE",
                    url: (request) => request.data.links.delete,
                    requests,
                    payload: {},
                    onProgress,
                });
            },
            invalidatesTags: (result, error) => (error ? [] : ["Chapters"]),
        }),
        assignChapter: builder.mutation({
            query: ({ chapter, payload }) => ({
                url: chapter.links.assign,
                method: "POST",
                data: removeLinks(payload),
            }),
            invalidatesTags: (result, error) => (error ? [] : ["Chapters"]),
        }),
        assignChapters: builder.mutation({
            async queryFn(
                { requests, payload, onProgress },
                _queryApi,
                _extraOptions,
                baseQuery
            ) {
                return processMultipleRequests({
                    baseQuery,
                    method: "POST",
                    url: (request) => request.data.links.assign,
                    requests,
                    payload,
                    onProgress,
                });
            },
            invalidatesTags: (result, error) => (error ? [] : ["Chapters"]),
        }),
        updateChapterSequence: builder.mutation({
            query: ({ libraryId, bookId, payload }) => ({
                url: `/libraries/${libraryId}/books/${bookId}/chapters/sequence`,
                method: "POST",
                data: removeLinks(payload),
            }),
            invalidatesTags: ["Chapters"],
        }),
        addBookPage: builder.mutation({
            query: ({ libraryId, bookId, payload }) => ({
                url: `/libraries/${libraryId}/books/${bookId}/pages`,
                method: "POST",
                data: removeLinks(payload),
            }),
            transformResponse: (response) => parseResponse(response),
            invalidatesTags: ["BookPages"],
        }),
        updateBookPage: builder.mutation({
            query: ({ page }) => ({
                url: page.links.update,
                method: "PUT",
                data: removeLinks(page),
            }),
            transformResponse: (response) => parseResponse(response),
            invalidatesTags: ["BookPages"],
        }),
        updateBookPages: builder.mutation({
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
            invalidatesTags: (result, error) => (error ? [] : ["BookPages"]),
        }),
        deleteBookPage: builder.mutation({
            query: ({ page }) => ({
                url: page.links.delete,
                method: "DELETE",
            }),
            invalidatesTags: ["BookPages"],
        }),
        deleteBookPages: builder.mutation({
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
            invalidatesTags: (result, error) => (error ? [] : ["BookPages"]),
        }),
        assignBookPage: builder.mutation({
            query: ({ page, payload }) => ({
                url:
                    payload.accountId === "me"
                        ? page.links.assign_to_me
                        : page.links.assign,
                method: "POST",
                data: removeLinks(payload),
            }),
            invalidatesTags: ["BookPages"],
        }),
        assignBookPages: builder.mutation({
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
            invalidatesTags: (result, error) => (error ? [] : ["BookPages"]),
        }),
        ocrBookPage: builder.mutation({
            query: ({ page, key }) => ({
                url: page.links.ocr,
                method: "POST",
                data: { key: key },
            }),
            invalidatesTags: ["BookPages"],
        }),
        ocrBookPages: builder.mutation({
            async queryFn(
                { requests, payload, onProgress },
                _queryApi,
                _extraOptions,
                baseQuery
            ) {
                return processMultipleRequests({
                    baseQuery,
                    method: "POST",
                    url: (request) => {
                        return request.data.links.ocr;
                    },
                    requests,
                    payload,
                    onProgress,
                });
            },
            invalidatesTags: (result, error) => (error ? [] : ["BookPages"]),
        }),
        updateBookPageImage: builder.mutation({
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
            invalidatesTags: ["BookPages"],
        }),
        updateBookPageSequence: builder.mutation({
            query: ({ page, payload }) => ({
                url: page.links.page_sequence,
                method: "POST",
                data: removeLinks(payload),
            }),
            invalidatesTags: ["BookPages"],
        }),
        createBookPageWithImage: builder.mutation({
            query: ({ book, fileList }) => {
                const formData = new FormData();
                fileList.forEach((file, index) => {
                    formData.append(index, file, `${index}.jpg`);
                });
                return {
                    url: book.links.create_multiple,
                    method: "POST",
                    data: formData,
                    formData: true,
                    headers: {
                        "content-type": "multipart/form-data",
                    },
                };
            },
            invalidatesTags: ["Book", "BookPages"],
        }),
        addBookContent: builder.mutation({
            query: ({ book, payload, language }) => {
                const formData = new FormData();
                formData.append("file", payload, payload.fileName);
                const url = new URL(book.links.add_file);
                url.searchParams.set("language", language);
                return {
                    url: url.href,
                    method: "POST",
                    data: formData,
                    formData: true,
                    headers: {
                        "Content-Type": "multipart/form-data",
                    },
                };
            },
            transformResponse: (response) => parseResponse(response),
            invalidatesTags: ["Book"],
        }),
        updateBookContent: builder.mutation({
            query: ({ content, payload }) => {
                const formData = new FormData();
                formData.append("file", payload, payload.fileName);
                return {
                    url: content.links.update,
                    method: "PUT",
                    data: formData,
                    formData: true,
                    headers: {
                        "Content-Type": "multipart/form-data",
                    },
                };
            },
            transformResponse: (response) => parseResponse(response),
            invalidatesTags: ["Book"],
        }),
        deleteBookContent: builder.mutation({
            query: ({ content }) => ({
                url: content.links.delete,
                method: "DELETE",
            }),
            invalidatesTags: ["Book"],
        }),
    }),
});

export const {
    useGetBooksQuery,
    useGetBookQuery,
    useAddBookToFavoriteMutation,
    useRemoveBookFromFavoriteMutation,
    useAddBookMutation,
    useUpdateBookMutation,
    useDeleteBookMutation,
    usePublishBookMutation,
    useUpdateBookImageMutation,
    // Book Chapter
    useGetBookChaptersQuery,
    useGetChapterQuery,
    useGetChapterContentsQuery,
    useAddChapterMutation,
    useUpdateChapterMutation,
    useUpdateChaptersMutation,
    useDeleteChaptersMutation,
    useAssignChapterMutation,
    useAssignChaptersMutation,
    useUpdateChapterSequenceMutation,
    // Book Page
    useGetBookPagesQuery,
    useGetBookPageQuery,
    useAddBookPageMutation,
    useUpdateBookPageMutation,
    useUpdateBookPagesMutation,
    useDeleteBookPageMutation,
    useDeleteBookPagesMutation,
    useAssignBookPageMutation,
    useAssignBookPagesMutation,
    useOcrBookPageMutation,
    useOcrBookPagesMutation,
    useUpdateBookPageImageMutation,
    useUpdateBookPageSequenceMutation,
    useCreateBookPageWithImageMutation,
    // Book Contents
    useAddBookContentMutation,
    useUpdateBookContentMutation,
    useDeleteBookContentMutation,
} = booksApi;
