import PropTypes from 'prop-types';
import { useState } from 'react';
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
import { useGetIssuePagesQuery, useUpdateIssuePageSequenceMutation } from '@/store/slices/issues.api';
import { updateLinkToIssuePagesPage } from '@/utils'
import { IconAdd } from '@/components/icons'
import DataView from '@/components/dataView';
import PageListItem from './pageListItem';
import PageCard from './pageCard';
import { BookStatus } from '@/models';
import { error, success } from '@/utils/notifications';
import PageDeleteButton from './pageDeleteButton';
import PageEditForm from './pageEditForm';
import IssuePageStatusButton from './pageStatusButton';
import IssuePageAssignButton from './pageAssignButton';
import IssuePageOcrButton from './pageOcrButton';
import IssuePageArticleButton from './pageArticleButton';
import IssuePageAutoArticleUpdate from './pageAutoArticleUpdate';
import AssignmentFilterMenu from '@/components/asssignmentFilterMenu';
import EditingStatusFilterMenu from '@/components/editingStatusFilterMenu';
//------------------------------------------------------

const ReviewBookStatuses = [BookStatus.ReadyForProofRead, BookStatus.ProofRead]
const IssuePagesList = ({ libraryId, issue, isLoading,
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
    } = useGetIssuePagesQuery({
        url: issue?.links?.pages,
        status: status,
        sortDirection: sortDirection,
        writerAssignmentFilter: writerAssignmentFilter,
        reviewerAssignmentFilter: reviewerAssignmentFilter,
        pageNumber: pageNumber,
        pageSize: pageSize,
    }, { skip: isLoading || !libraryId || issue === null || issue?.id === null });

    const [updatePageSequence, { isLoading: isUpdatingSequence }] =
        useUpdateIssuePageSequenceMutation();

    const onOrderChanged = ({ destination, source }) => {
        if (!source || !destination) return;
        const fromIndex = source.index + 1;
        const toIndex = destination.index + 1;
        if (fromIndex !== toIndex) {
            const page = pages.data.find((p) => p.sequenceNumber === fromIndex);
            if (page) {
                return updatePageSequence({
                    page,
                    payload: { sequenceNumber: toIndex },
                })
                    .unwrap()
                    .then(() => success({ message: t("page.actions.sequence.success") }))
                    .catch(() => error({ message: t("page.actions.sequence.error") }));
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
        emptyText={t('page.empty.title')}
        dataSource={pages}
        isFetching={Boolean(isLoading | loadingPages | isUpdatingSequence)}
        isError={errorLoadingPages}
        draggable
        droppableId="draggable-books-pages"
        onOrderChanged={onOrderChanged}
        errorTitle={t('page.error.loading.title')}
        errorDetail={t('page.error.loading.detail')}
        showViewToggle={true}
        viewToggleKey="book-page-list"
        cardRender={(page, index) => <PageCard t={t}
            libraryId={libraryId}
            issue={issue}
            key={page.sequenceNumber}
            index={index}
            page={page}
            isSelected={selection.indexOf(
                page.sequenceNumber
            ) >= 0}
            onSelectChanged={(checked) => onSelectChanged(page, checked)} />}
        onReload={refetch}
        listItemRender={(page, index) => <PageListItem t={t}
            libraryId={libraryId}
            issue={issue}
            key={page.sequenceNumber}
            index={index}
            page={page}
            isSelected={selection.indexOf(
                page.sequenceNumber
            ) >= 0}
            onSelectChanged={(checked) => onSelectChanged(page, checked)} />}
        onPageChanged={(index) => navigate(updateLinkToIssuePagesPage(location, {
            pageNumber: index,
            pageSize: pageSize,
        }))}
        onPageSizeChanged={(size) => navigate(updateLinkToIssuePagesPage(location, {
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
                    <PageEditForm libraryId={libraryId} issue={issue} >
                        <Tooltip label={t('page.actions.add.label')}>
                            <Button variant='default'>
                                <IconAdd />
                            </Button>
                        </Tooltip>
                    </PageEditForm>
                    <PageDeleteButton pages={selectedPages} t={t} type='default' onDeleted={clearSelection} />
                    <IssuePageArticleButton libraryId={libraryId} issue={issue} pages={selectedPages} t={t} type='default' onCompleted={clearSelection} />
                    <IssuePageAutoArticleUpdate pages={selectedPages} t={t} type='default' onCompleted={clearSelection} />
                    <IssuePageAssignButton libraryId={libraryId} pages={selectedPages} t={t} type='default' onCompleted={clearSelection} />
                    <IssuePageStatusButton pages={selectedPages} t={t} type='default' onCompleted={clearSelection} />
                    <IssuePageOcrButton pages={selectedPages} t={t} type='default' onCompleted={clearSelection} />
                </Button.Group>
            </Group>
        }
        extraFilters={
            <Group>
                <AssignmentFilterMenu
                    value={ReviewBookStatuses.includes(issue?.status) ? reviewerAssignmentFilter : writerAssignmentFilter}
                    onChange={value => navigate(updateLinkToIssuePagesPage(location, {
                        pageNumber: 1,
                        writerAssignmentFilter: ReviewBookStatuses.includes(issue?.status) ? null : value,
                        reviewerAssignmentFilter: ReviewBookStatuses.includes(issue?.status) ? value : null,
                    }))} />
                <EditingStatusFilterMenu
                    // statuses={issue?.pageStatus} 
                    value={status}
                    onChange={value => navigate(updateLinkToIssuePagesPage(location, {
                        pageNumber: 1,
                        statusFilter: value
                    }))} />
                {/* <SortDirectionToggle value={sortDirection} onChange={dir => navigate(updateLinkToIssuePagesPage(location, {
                    pageNumber: 1,
                    sortDirection: dir,
                }))} /> */}
            </Group>
        }
        cols={{ base: 1, xs: 2, sm: 2, md: 3, lg: 3, xl: 4 }}

    />;
}

IssuePagesList.propTypes = {
    libraryId: PropTypes.string,
    issue: PropTypes.shape({
        id: PropTypes.number,
        issueNumber: PropTypes.number,
        volumeNumber: PropTypes.number,
        issueDate: PropTypes.string,
        periodicalId: PropTypes.number,
        periodicalName: PropTypes.string,
        pageCount: PropTypes.number,
        articleCount: PropTypes.number,
        status: PropTypes.string,
        links: PropTypes.shape({
            image: PropTypes.string,
            update: PropTypes.string,
            delete: PropTypes.string,
            pages: PropTypes.string,
        }),
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

export default IssuePagesList;