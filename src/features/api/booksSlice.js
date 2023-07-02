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
            query: ({ libraryId, bookId, chapterNumber, payload }) => ({
                url: `/libraries/${libraryId}/books/${bookId}/chapters/${chapterNumber}`,
                method: 'PUT',
                payload: removeLinks(payload)
            }),
            invalidatesTags: [ 'Chapters' ]
        }),
        deleteChapter: builder.mutation({
            query: ({ libraryId, bookId, chapterNumber }) => ({
                url: `/libraries/${libraryId}/books/${bookId}/chapters/${chapterNumber}`,
                method: 'DELETE'
            }),
            invalidatesTags: [ 'Chapters' ]
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
    useAddBookMutation,
    useUpdateBookMutation,
    useDeleteBookMutation,
    useUpdateBookImageMutation,
    useAddChapterMutation,
    useUpdateChapterMutation,
    useDeleteChapterMutation
 } = booksApi
