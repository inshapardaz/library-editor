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
            providesTags: [ 'Book' ]
        }),
        getBookChapters: builder.query({
            query: ({ libraryId, bookId }) => ({ url: `/libraries/${libraryId}/books/${bookId}/chapters`, method: 'get' }),
            transformResponse: (response) => parseResponse(response),
            providesTags: [ 'Chapters' ]
        }),
        getChapter: builder.query({
            query: ({ libraryId, bookId, chapterNumber }) => ({ url: `/libraries/${libraryId}/books/${bookId}/chapters/${chapterNumber}`, method: 'get' }),
            transformResponse: (response) => parseResponse(response),
            providesTags: [ 'Chapters' ]
        }),
        getChapterContents: builder.query({
            query: ({ libraryId, bookId, chapterNumber }) => ({ url: `/libraries/${libraryId}/books/${bookId}/chapters/${chapterNumber}/contents`, method: 'get' }),
            transformResponse: (response) => parseResponse(response),
            providesTags: [ 'ChapterContents' ]
        }),
        addChapterContents: builder.mutation({
            query: ({ chapter, payload }) => ({
                url: chapter.links.add_content,
                method: 'POST',
                data: removeLinks(payload)
            }),
            invalidatesTags: [ 'ChapterContents' ]
        }),
        updateChapterContents: builder.mutation({
            query: ({ chapterContent, payload }) => ({
                url: chapterContent.links.update,
                method: 'PUT',
                data: removeLinks(payload)
            }),
            invalidatesTags: [ 'ChapterContents' ]
        }),
        addBook: builder.mutation({
            query: ({ libraryId, payload }) => ({
                url: `/libraries/${libraryId}/books`,
                method: 'POST',
                data: removeLinks(payload)
            }),
            invalidatesTags: [ 'Books' ]
        }),
        updateBook: builder.mutation({
            query: ({ libraryId, bookId, payload }) => ({
                url: `/libraries/${libraryId}/books/${bookId}`,
                method: 'PUT',
                data: removeLinks(payload)
            }),
            invalidatesTags: [ 'Books', 'Book' ]
        }),
        deleteBook: builder.mutation({
            query: ({ libraryId, bookId }) => ({
                url: `/libraries/${libraryId}/books/${bookId}`,
                method: 'DELETE'
            }),
            invalidatesTags: [ 'Books', 'Book' ]
        }),
        updateBookImage: builder.mutation({
            query: ({ libraryId, bookId, payload }) => {
                const formData = new FormData();
                formData.append('file', payload, payload.fileName);
                return ({
                    url: `/libraries/${libraryId}/books/${bookId}/image`,
                    method: 'PUT',
                    data: formData,
                    formData: true,
                    headers: {
                        'content-type': 'multipart/form-data'
                    }
                });
            },
            invalidatesTags: [ 'Book' ]
        }),
        addChapter: builder.mutation({
            query: ({ libraryId, bookId, payload }) => ({
                url: `/libraries/${libraryId}/books/${bookId}/chapters`,
                method: 'POST',
                data: removeLinks(payload)
            }),
            invalidatesTags: [ 'Chapters' ]
        }),
        updateChapter: builder.mutation({
            query: ({ chapter }) => ({
                url: chapter.links.update,
                method: 'PUT',
                data: removeLinks(chapter)
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
                data: removeLinks(payload)
            }),
            invalidatesTags: [ 'Chapters' ]
        }),
        updateChapterSequence: builder.mutation({
            query: ({ libraryId, bookId, payload }) => ({
                url: `/libraries/${libraryId}/books/${bookId}/chapters/sequence`,
                method: 'POST',
                data: removeLinks(payload)
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
                data: removeLinks(payload)
            }),
            invalidatesTags: [ 'BookPages' ]
        }),
        updateBookPage: builder.mutation({
            query: ({ page }) => ({
                url: page.links.update,
                method: 'PUT',
                data: removeLinks(page)
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
                data: removeLinks(payload)
            }),
            invalidatesTags: [ 'BookPages' ]
        }),
        ocrBookPage: builder.mutation({
            query: ({ page, key }) => ({
                url: page.links.ocr,
                method: 'POST',
                data: ({ key: key })
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
                    data: formData,
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
                data: removeLinks(payload)
            }),
            invalidatesTags: [ 'BookPages' ]
        }),
        createBookPageWithImage: builder.mutation({
            query: ({ book, fileList }) => {
                const formData = new FormData();
                fileList.forEach((file, index) => {
                    formData.append(index, file, `${index}.jpg`);
                });
                return ({
                    url: book.links.create_multiple,
                    method: 'POST',
                    data: formData,
                    formData: true,
                    headers: {
                        'content-type': 'multipart/form-data'
                    }
                });
            },
            invalidatesTags: [ 'Book', 'BookPages' ]
        }),
        addBookContent: builder.mutation({
            query: ({ book, payload }) => {
                const formData = new FormData();
                formData.append('file', payload, payload.fileName);
                return ({
                    url: book.links.add_file,
                    method: 'POST',
                    data: formData,
                    formData: true,
                    headers: {
                        'content-type': 'multipart/form-data'
                    }
                });
            },
            invalidatesTags: [ 'Book' ]
        }),
        updateBookContent: builder.mutation({
            query: ({ content, payload }) => {
                const formData = new FormData();
                formData.append('file', payload, payload.fileName);
                return ({
                    url: content.links.update,
                    method: 'PUT',
                    data: formData,
                    formData: true,
                    headers: {
                        'content-type': 'multipart/form-data'
                    }
                });
            },
            invalidatesTags: [ 'Book' ]
        }),
        deleteBookContent: builder.mutation({
            query: ({ content }) => ({
                url: content.links.delete,
                method: 'DELETE',
            }),
            invalidatesTags: [ 'Book' ]
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
    useAddChapterContentsMutation,
    useUpdateChapterContentsMutation,
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
    useUpdateBookPageSequenceMutation,
    useCreateBookPageWithImageMutation,
    useAddBookContentMutation,
    useUpdateBookContentMutation,
    useDeleteBookContentMutation,
 } = booksApi
