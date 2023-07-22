import { createApi } from '@reduxjs/toolkit/query/react'

import { axiosBaseQuery } from '../../helpers/axios.helpers'

import { parseResponse, removeLinks } from '../../helpers/parseResponse';
// ----------------------------------------------
export const booksApi = createApi({
    reducerPath: 'books',
    baseQuery: axiosBaseQuery({ baseUrl: process.env.REACT_APP_API_URL }),
    endpoints: (builder) => ({
        getBooks: builder.query({
            query: ({ libraryId,
                query = null,
                author = null,
                categories = null,
                series = null,
                sortBy = null,
                sortDirection = null,
                favorite = null,
                read = null,
                status = null,
                pageNumber = 1,
                pageSize = 12 }) => {
                let queryVal = query ? `&query=${query}` : '';
                if (author) {
                    queryVal += `&authorId=${author}`;
                }
                if (categories) {
                    queryVal += `&categoryId=${categories}`;
                }
                if (series) {
                    queryVal += `&seriesId=${series}`;
                }
                if (sortBy) {
                    queryVal += `&sortBy=${sortBy}`;
                }
                if (favorite) {
                    queryVal += '&favorite=true';
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
                return ({ url: `/libraries/${libraryId}/books?pageNumber=${pageNumber}&pageSize=${pageSize}${queryVal}`, method: 'get' })
            },
            transformResponse: (response) => parseResponse(response),
            providesTags: [ 'Books' ]
        }),
        getMyBooks: builder.query({
            query: ({ libraryId,
                query = null,
                author = null,
                categories = null,
                series = null,
                sortBy = null,
                sortDirection = null,
                favorite = null,
                read = null,
                status = null,
                pageNumber = 1,
                pageSize = 12 }) => {
                let queryVal = query ? `&query=${query}` : '';
                if (author) {
                    queryVal += `&authorId=${author}`;
                }
                if (categories) {
                    queryVal += `&categoryId=${categories}`;
                }
                if (series) {
                    queryVal += `&seriesId=${series}`;
                }
                if (sortBy) {
                    queryVal += `&sortBy=${sortBy}`;
                }
                if (favorite) {
                    queryVal += '&favorite=true';
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
                return ({ url: `/libraries/${libraryId}/my/books?pageNumber=${pageNumber}&pageSize=${pageSize}${queryVal}`, method: 'get' })
            },
            transformResponse: (response) => parseResponse(response),
            providesTags: [ 'Books' ]
        }),
        getBook: builder.query({
            query: ({ libraryId, bookId }) => ({ url: `/libraries/${libraryId}/books/${bookId}`, method: 'get' }),
            transformResponse: (response) => parseResponse(response),
            providesTags: [ 'Books' ]
        }),
        getBookChapters: builder.query({
            query: ({ libraryId, bookId }) => ({ url: `/libraries/${libraryId}/books/${bookId}/chapters`, method: 'get' }),
            transformResponse: (response) => parseResponse(response),
            providesTags: [ 'Chapters' ]
        }),
        getChapter: builder.query({
            query: ({ libraryId, bookId, chapterId }) => ({ url: `/libraries/${libraryId}/books/${bookId}/chapters/${chapterId}`, method: 'get' }),
            transformResponse: (response) => parseResponse(response),
            providesTags: [ 'Chapters' ]
        }),
        getChapterContents: builder.query({
            query: ({ libraryId, bookId, chapterId }) => ({ url: `/libraries/${libraryId}/books/${bookId}/chapters/${chapterId}/contents`, method: 'get' }),
            transformResponse: (response) => parseResponse(response),
            providesTags: [ 'ChapterContents' ]
        }),
        addBook: builder.mutation({
            query: ({ libraryId, payload }) => ({
                url: `/libraries/${libraryId}/books`,
                method: 'POST',
                payload: removeLinks(payload)
            }),
            invalidatesTags: [ 'Books' ]
        }),
        updateBook: builder.mutation({
            query: ({ libraryId, bookId, payload }) => ({
                url: `/libraries/${libraryId}/books/${bookId}`,
                method: 'PUT',
                payload: removeLinks(payload)
            }),
            invalidatesTags: [ 'Books' ]
        }),
        deleteBook: builder.mutation({
            query: ({ libraryId, bookId }) => ({
                url: `/libraries/${libraryId}/books/${bookId}`,
                method: 'DELETE'
            }),
            invalidatesTags: [ 'Books' ]
        }),
        updateBookImage: builder.mutation({
            query: ({ libraryId, bookId, payload }) => {
                const formData = new FormData();
                formData.append('file', payload, payload.fileName);
                return ({
                    url: `/libraries/${libraryId}/books/${bookId}/image`,
                    method: 'PUT',
                    payload: formData,
                    formData: true,
                    headers: {
                        'content-type': 'multipart/form-data'
                    }
                });
            },
            invalidatesTags: [ 'Books' ]
        }),
        addChapter: builder.mutation({
            query: ({ libraryId, bookId, payload }) => ({
                url: `/libraries/${libraryId}/books/${bookId}/chapters`,
                method: 'POST',
                payload: removeLinks(payload)
            }),
            invalidatesTags: [ 'Chapters' ]
        }),
        updateChapter: builder.mutation({
            query: ({ chapter }) => ({
                url: chapter.links.update,
                method: 'PUT',
                payload: removeLinks(chapter)
            }),
            invalidatesTags: [ 'Chapters' ]
        }),
        deleteChapter: builder.mutation({
            query: ({ chapter }) => ({
                url: chapter.links.delete,
                method: 'DELETE'
            }),
            invalidatesTags: [ 'Chapters' ]
        }),
        assignChapter: builder.mutation({
            query: ({ chapter, payload }) => ({
                url: chapter.links.assign,
                method: 'POST',
                payload: removeLinks(payload)
            }),
            invalidatesTags: [ 'Chapters' ]
        }),
        updateChapterSequence: builder.mutation({
            query: ({ libraryId, bookId, payload }) => ({
                url: `/libraries/${libraryId}/books/${bookId}/chapters/sequence`,
                method: 'POST',
                payload: removeLinks(payload)
            }),
            invalidatesTags: [ 'Chapters' ]
        }),
        getBookPages: builder.query({
            query: ({ libraryId, bookId, status = 'Typing', assignment = null, reviewerAssignmentFilter = null, assignmentTo = null, pageNumber = 1, pageSize = 12 }) => {
                let queryVal = `?pageNumber=${pageNumber}&pageSize=${pageSize}${status ? `&status=${status}` : ''}${assignment ? `&assignmentFilter=${assignment}` : ''}${reviewerAssignmentFilter ? `&reviewerAssignmentFilter=${reviewerAssignmentFilter}` : ''}`;
                return ({ url: `/libraries/${libraryId}/books/${bookId}/pages${queryVal}` })
            },
            transformResponse: (response) => parseResponse(response),
            providesTags: [ 'BookPages' ]
        }),
        getBookPage: builder.query({
            query: ({ libraryId, bookId, pageNumber }) => ({
                url: `/libraries/${libraryId}/books/${bookId}/pages/${pageNumber}`,
                method: 'GET',
            }),
            transformResponse: (response) => parseResponse(response),
            providesTags: [ 'BookPages' ]
        }),
        addBookPage: builder.mutation({
            query: ({ libraryId, bookId, payload }) => ({
                url: `/libraries/${libraryId}/books/${bookId}/pages`,
                method: 'POST',
                payload: removeLinks(payload)
            }),
            invalidatesTags: [ 'BookPages' ]
        }),
        updateBookPage: builder.mutation({
            query: ({ page }) => ({
                url: page.links.update,
                method: 'PUT',
                payload: removeLinks(page)
            }),
            invalidatesTags: [ 'BookPages' ]
        }),
        deleteBookPage: builder.mutation({
            query: ({ page }) => ({
                url: page.links.delete,
                method: 'DELETE'
            }),
            invalidatesTags: [ 'BookPages' ]
        }),
        assignBookPage: builder.mutation({
            query: ({ page, payload }) => ({
                url: payload.accountId === "me" ?  page.links.assign_to_me :  page.links.assign,
                method: 'POST',
                payload: removeLinks(payload)
            }),
            invalidatesTags: [ 'BookPages' ]
        }),
        ocrBookPage: builder.mutation({
            query: ({ page, key }) => ({
                url: page.links.ocr,
                method: 'POST',
                payload: removeLinks(key)
            }),
            invalidatesTags: [ 'BookPages' ]
        }),
        updateBookPageImage: builder.mutation({
            query: ({ libraryId, bookId, pageNumber, payload }) => {
                const formData = new FormData();
                formData.append('file', payload, payload.fileName);
                return ({
                    url: `/libraries/${libraryId}/books/${bookId}/pages/${pageNumber}/image`,
                    method: 'PUT',
                    payload: formData,
                    formData: true,
                    headers: {
                        'content-type': 'multipart/form-data'
                    }
                });
            },
            invalidatesTags: [ 'BookPages' ]
        }),
        updateBookPageSequence: builder.mutation({
            query: ({ page, payload }) => ({
                url: page.links.page_sequence,
                method: 'POST',
                payload: removeLinks(payload)
            }),
            invalidatesTags: [ 'BookPages' ]
        }),
    }),
})


export const {
    useGetBooksQuery,
    useGetMyBooksQuery,
    useGetBookQuery,
    useGetBookChaptersQuery,
    useGetChapterQuery,
    useGetChapterContentsQuery,
    useGetBookPagesQuery,
    useAddBookMutation,
    useUpdateBookMutation,
    useDeleteBookMutation,
    useUpdateBookImageMutation,
    useAddChapterMutation,
    useUpdateChapterMutation,
    useDeleteChapterMutation,
    useAssignChapterMutation,
    useUpdateChapterSequenceMutation,
    useGetBookPageQuery,
    useAddBookPageMutation,
    useUpdateBookPageMutation,
    useDeleteBookPageMutation,
    useAssignBookPageMutation,
    useOcrBookPageMutation,
    useUpdateBookPageImageMutation,
    useUpdateBookPageSequenceMutation
 } = booksApi
