import PropTypes from 'prop-types';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useLocation, useNavigate } from 'react-router-dom';

// UI library imports
import {
    Button,
    Checkbox,
    Group,
    Tooltip,
} from '@mantine/core';

// Local imports
import { useGetBookPagesQuery, useUpdateBookPageSequenceMutation } from '@/store/slices/books.api';
import { IconAdd } from '@/components/icons';
import { updateLinkToBooksPagesPage } from '@/utils'
import DataView from '@/components/dataView';
import PageEditForm from './pageEditForm';
import PageDeleteButton from './pageDeleteButton';
import PageAssignButton from './pageAssignButton';
import PageStatusButton from './pageStatusButton';
import PageChapterButton from './pageChapterButton';
import PageOcrButton from './pageOcrButton';
import EditingStatusFilterMenu from '@/components/editingStatusFilterMenu';
import SortDirectionToggle from '@/components/sortDirectionToggle';
import AssignmentFilterMenu from '@/components/asssignmentFilterMenu';
import PageListItem from './pageListItem';
import PageCard from './pageCard';
import { BookStatus } from '@/models';
import { error, success } from '@/utils/notifications';
import PageAutoChapterUpdate from './pageAutoChapterUpdate';
//------------------------------------------------------

const ReviewBookStatuses = [BookStatus.ReadyForProofRead, BookStatus.ProofRead]
const BookPagesList = ({ libraryId, book, isLoading,
    writerAssignmentFilter = null,
    reviewerAssignmentFilter = null,
    sortDirection = null,
    status,
    pageNumber,
    pageSize,
}) => {
    const { t } = useTranslation();
    const navigate = useNavigate();
    const location = useLocation();
    const [selection, setSelection] = useState([]);
    const [selectedPages, setSelectedPages] = useState([]);

    //--- Data operations -------------------------
    const {
        data: pages,
        error: errorLoadingPages,
        isFetching: loadingPages,
        refetch
    } = useGetBookPagesQuery({
        libraryId,
        bookId: book?.id,
        status: status,
        sortDirection: sortDirection,
        writerAssignmentFilter: writerAssignmentFilter,
        reviewerAssignmentFilter: reviewerAssignmentFilter,
        pageNumber: pageNumber,
        pageSize: pageSize,
    }, { skip: isLoading || !libraryId || book === null || book?.id === null });

    const [updateBookPageSequence, { isLoading: isUpdatingSequence }] =
        useUpdateBookPageSequenceMutation();

    useEffect(() => {
        clearSelection();
    }, [
        book,
        writerAssignmentFilter,
        reviewerAssignmentFilter,
        sortDirection,
        status,
        pageNumber,
        pageSize]);
    const onOrderChanged = ({ destination, source }) => {
        if (!source || !destination) return;
        const fromIndex = source.index;
        const toIndex = destination.index;
        if (fromIndex !== toIndex) {
            const page = pages.data.find((p) => p.sequenceNumber === fromIndex);
            if (page) {
                return updateBookPageSequence({
                    page,
                    payload: { sequenceNumber: toIndex },
                })
                    .unwrap()
                    .then(() => success({ message: t("page.actions.sequence.success") }))
                    .catch((e) => {
                        console.error(e);
                        return error({ message: t("page.actions.sequence.error") });
                    });
            }
        }
    }

    //--- Selection ------------------------------------
    const onSelectChanged = (selectedPage, checked) => {
        const newSelection = [...selection];

        if (checked) {
            newSelection.push(selectedPage.sequenceNumber);
        } else {
            const currentIndex = selection.indexOf(selectedPage.sequenceNumber);
            newSelection.splice(currentIndex, 1);
        }

        setSelection(newSelection);
        setSelectedPages(
            pages.data.filter((p) => newSelection.includes(p.sequenceNumber))
        );
    };

    const clearSelection = () => {
        setSelection([]);
        setSelectedPages([]);
    }

    const onSelectAll = () => {
        if (pages.data.length > 0 && selection.length === pages.data.length) {
            clearSelection();
        } else {
            setSelection(pages.data.map((p) => p.sequenceNumber));
            setSelectedPages(pages.data);
        }
    };

    const hasAllSelected = pages?.data.length > 0 && selection.length === pages?.data.length;
    const hasPartialSelection = selection.length > 0 && selection.length < pages?.data.length;

    return <DataView
        emptyText={t('pages.empty.title')}
        dataSource={pages}
        isFetching={Boolean(isLoading | loadingPages | isUpdatingSequence)}
        isError={errorLoadingPages}
        draggable
        droppableId="draggable-books-pages"
        onOrderChanged={onOrderChanged}
        errorTitle={t('pages.error.loading.title')}
        errorDetail={t('pages.error.loading.detail')}
        showViewToggle={true}
        viewToggleKey="book-page-list"
        cardRender={page => <PageCard t={t}
            libraryId={libraryId}
            book={book}
            key={page.sequenceNumber}
            index={page.sequenceNumber}
            page={page}
            isSelected={selection.indexOf(
                page.sequenceNumber
            ) >= 0}
            onSelectChanged={(checked) => onSelectChanged(page, checked)} />}
        onReload={refetch}
        listItemRender={page => <PageListItem t={t}
            libraryId={libraryId}
            book={book}
            key={page.sequenceNumber}
            index={page.sequenceNumber}
            page={page}
            isSelected={selection.indexOf(
                page.sequenceNumber
            ) >= 0}
            onSelectChanged={(checked) => onSelectChanged(page, checked)} />}
        onPageChanged={(index) => navigate(updateLinkToBooksPagesPage(location, {
            pageNumber: index,
            pageSize: pageSize,
        }))}
        onPageSizeChanged={(size) => navigate(updateLinkToBooksPagesPage(location, {
            pageNumber: 1,
            pageSize: size,
        }))}
        showSearch={false}
        actions={
            <Group wrap='nowrap'>
                <Checkbox
                    onChange={onSelectAll}
                    checked={hasAllSelected}
                    indeterminate={hasPartialSelection} />
                <Button.Group>
                    <PageEditForm libraryId={libraryId} bookId={book.id} >
                        <Tooltip label={t('page.actions.add.label')}>
                            <Button variant='default'>
                                <IconAdd />
                            </Button>
                        </Tooltip>
                    </PageEditForm>
                    <PageDeleteButton pages={selectedPages} t={t} type='default' onDeleted={clearSelection} />
                    <PageChapterButton libraryId={libraryId} bookId={book.id} pages={selectedPages} t={t} type='default' onCompleted={clearSelection} />
                    <PageAutoChapterUpdate libraryId={libraryId} bookId={book.id} pages={selectedPages} t={t} type='default' onCompleted={clearSelection} />
                    <PageAssignButton libraryId={libraryId} pages={selectedPages} t={t} type='default' onCompleted={clearSelection} />
                    <PageStatusButton book={book} pages={selectedPages} t={t} type='default' onCompleted={clearSelection} />
                    <PageOcrButton book={book} pages={selectedPages} t={t} type='default' onCompleted={clearSelection} />
                </Button.Group>
            </Group>
        }
        extraFilters={
            <Group>
                <AssignmentFilterMenu
                    value={ReviewBookStatuses.includes(book?.status) ? reviewerAssignmentFilter : writerAssignmentFilter}
                    onChange={value => navigate(updateLinkToBooksPagesPage(location, {
                        pageNumber: 1,
                        writerAssignmentFilter: ReviewBookStatuses.includes(book?.status) ? null : value,
                        reviewerAssignmentFilter: ReviewBookStatuses.includes(book?.status) ? value : null,
                    }))} />
                <EditingStatusFilterMenu statuses={book?.pageStatus} value={status} onChange={value => navigate(updateLinkToBooksPagesPage(location, {
                    pageNumber: 1,
                    statusFilter: value
                }))} />
                <SortDirectionToggle value={sortDirection} onChange={dir => navigate(updateLinkToBooksPagesPage(location, {
                    pageNumber: 1,
                    sortDirection: dir,
                }))} />
            </Group>
        }
        cols={{ base: 1, xs: 2, sm: 2, md: 3, lg: 3, xl: 4 }}

    />;
}

BookPagesList.propTypes = {
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
        status: PropTypes.string,
        pageStatus: PropTypes.arrayOf(PropTypes.shape({
            status: PropTypes.string,
            count: PropTypes.number,
            percentage: PropTypes.number
        })),
    }),
    isLoading: PropTypes.bool,
    writerAssignmentFilter: PropTypes.string,
    reviewerAssignmentFilter: PropTypes.string,
    sortBy: PropTypes.string,
    sortDirection: PropTypes.string,
    status: PropTypes.string,
    pageNumber: PropTypes.number,
    pageSize: PropTypes.number,
};

export default BookPagesList;