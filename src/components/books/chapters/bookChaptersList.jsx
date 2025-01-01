import PropTypes from 'prop-types';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';

// UI library imports
import {
    Button,
    Checkbox,
    Group,
    Tooltip,
} from '@mantine/core';
import { notifications } from '@mantine/notifications';

// Local imports
import { useGetBookChaptersQuery, useUpdateChapterSequenceMutation } from '@/store/slices/books.api';
import { IconAdd } from '@/components/icons';
import DataView from '@/components/dataView';
import ChapterEditForm from './chapterEditForm';
import ChapterDeleteButton from './chapterDeleteButton';
import ChapterAssignButton from './chapterAssignButton';
import ChapterStatusButton from './chapterStatusButton';
import BookChapterListItem from './bookChapterListItem';
//------------------------------------------------------


const BookChaptersList = ({ libraryId, book, isLoading }) => {
    const { t } = useTranslation();
    const [selection, setSelection] = useState([]);
    const [selectedChapters, setSelectedChapters] = useState([]);

    //--- Data operations -------------------------
    const {
        data: chapters,
        error: errorLoadingChapters,
        isFetching: loadingChapters,
        refetch
    } = useGetBookChaptersQuery({
        libraryId,
        bookId: book?.id
    }, { skip: isLoading || !libraryId || book === null || book?.id === null });

    const [updateChapterSequence, { isLoading: isUpdatingSequence }] =
        useUpdateChapterSequenceMutation();

    const onOrderChanged = ({ destination, source }) => {
        const fromIndex = source.index;
        const toIndex = destination.index;
        let payload = [...chapters.data];
        if (fromIndex !== toIndex) {
            const element = payload[fromIndex];
            payload.splice(fromIndex, 1);
            payload.splice(toIndex, 0, element);

            payload = payload.map((item, index) => ({
                id: item.id,
                chapterNumber: index + 1,
            }));

            return updateChapterSequence({ libraryId, bookId: book.id, payload })
                .unwrap()
                .then(() =>
                    notifications.show({
                        color: 'green',
                        title: t("chapter.actions.reorder.success")
                    })
                )
                .catch(() =>
                    notifications.show({
                        color: 'red',
                        title: t("chapter.actions.reorder.error")
                    })
                );
        }
    }

    //--- Selection ------------------------------------
    const onSelectChanged = (selectedChapter, checked) => {
        const newSelection = [...selection];

        if (checked) {
            newSelection.push(selectedChapter.chapterNumber);
        } else {
            const currentIndex = selection.indexOf(selectedChapter.chapterNumber);
            newSelection.splice(currentIndex, 1);
        }

        setSelection(newSelection);
        setSelectedChapters(
            chapters.data.filter((p) => newSelection.includes(p.chapterNumber))
        );
    };

    const clearSelection = () => {
        setSelection([]);
        setSelectedChapters([]);
    }

    const onSelectAll = () => {
        if (chapters.data.length > 0 && selection.length === chapters.data.length) {
            clearSelection();
        } else {
            setSelection(chapters.data.map((p) => p.chapterNumber));
            setSelectedChapters(chapters.data);
        }
    };

    const hasAllSelected = selection.length === chapters?.data.length;
    const hasPartialSelection =
        selection.length > 0 && selection.length < chapters?.data.length;
    //------------------------------------------------------

    return <DataView
        emptyText={t('pages.empty.title')}
        dataSource={chapters}
        isFetching={Boolean(isLoading | loadingChapters | isUpdatingSequence)}
        isError={errorLoadingChapters}
        draggable
        droppableId="draggable-books-chapters"
        onOrderChanged={onOrderChanged}
        errorTitle={t('book.error.loading.title')}
        errorDetail={t('book.error.loading.detail')}
        showViewToggle={false}
        defaultViewType="list"
        viewToggleKey="book-chapter-list"
        showPagination={false}
        onReload={refetch}
        listItemRender={(chapter, index) => <BookChapterListItem t={t}
            libraryId={libraryId}
            book={book}
            key={chapter.id}
            index={index}
            chapter={chapter}
            isSelected={selection.indexOf(
                chapter.chapterNumber
            ) >= 0}
            onSelectChanged={(checked) => onSelectChanged(chapter, checked)} />}
        showSearch={false}
        actions={
            <Group>
                <Checkbox
                    onChange={onSelectAll}
                    checked={hasAllSelected}
                    indeterminate={hasPartialSelection} />
                <Button.Group>
                    <ChapterEditForm libraryId={libraryId} bookId={book.id} >
                        <Tooltip label={t('chapter.actions.add.label')}>
                            <Button variant='default'>
                                <IconAdd />
                            </Button>
                        </Tooltip>
                    </ChapterEditForm>
                    <ChapterDeleteButton chapters={selectedChapters} t={t} type='default' onDeleted={clearSelection} />
                    <ChapterAssignButton libraryId={libraryId} chapters={selectedChapters} t={t} type='default' onCompleted={clearSelection} />
                    <ChapterStatusButton chapters={selectedChapters} t={t} type='default' onCompleted={clearSelection} />
                </Button.Group>
            </Group>
        }
        cols={{ base: 1, xs: 2, sm: 2, md: 3, lg: 3, xl: 4 }}

    />;
}

BookChaptersList.propTypes = {
    libraryId: PropTypes.string,
    book: PropTypes.shape({
        id: PropTypes.number,
        title: PropTypes.string,
        description: PropTypes.string,
        authors: PropTypes.arrayOf(PropTypes.shape({
            id: PropTypes.number,
            name: PropTypes.string
        })),
        categories: PropTypes.arrayOf(PropTypes.shape({
            id: PropTypes.number,
            name: PropTypes.string
        })),
        links: PropTypes.shape({
            image: PropTypes.string,
        }),
        publisher: PropTypes.string,
        language: PropTypes.string,
        isPublic: PropTypes.bool,
        copyrights: PropTypes.string,
        pageCount: PropTypes.number,
        chapterCount: PropTypes.number,
    }),
    isLoading: PropTypes.bool
};

export default BookChaptersList;