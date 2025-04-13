import PropTypes from 'prop-types';
import { useLocation, useNavigate } from 'react-router-dom';
import { useTranslation } from "react-i18next";

// Ui library Imports
import { Button, Checkbox, Group } from '@mantine/core';

// Local imports
import { useGetArticlesQuery } from "@/store/slices/articles.api";
import WritingCard from './writingCard';
import WritingListItem from './writingListItem';
import DataView from '@/components/dataView';
import { updateLinkToWritingsPage } from '@/utils';
import SortMenu from '@/components/sortMenu';
import SortDirectionToggle from '@/components/sortDirectionToggle';
import { IconTitle, IconDateCreated } from '@/components/icons';
// import WritingDeleteButton from './writingDeleteButton';
import WritingAssignButton from './writingAssignButton';
import WritingStatusButton from './writingStatusButton';
import { useState } from 'react';
//------------------------------

const WritingsList = ({
    libraryId,
    query = null,
    author = null,
    category = null,
    sortBy = null,
    sortDirection = null,
    favorite = null,
    read = null,
    status,
    pageNumber,
    pageSize,
    showSearch = true,
    showTitle = true
}) => {
    const { t } = useTranslation();
    const navigate = useNavigate();
    const location = useLocation();
    const [selection, setSelection] = useState([]);
    const [selectedWritings, setSelectedWritings] = useState([]);

    const {
        refetch,
        data: articles,
        isError,
        isFetching,
    } = useGetArticlesQuery({
        libraryId,
        query,
        author,
        category,
        type: 'writing',
        sortBy,
        sortDirection,
        favorite,
        read,
        status,
        pageNumber,
        pageSize,
    });

    let writingSortOptions = [{
        label: t('writing.title.label'),
        value: 'title',
        icon: <IconTitle />
    }, {
        label: t('writing.lastModified'),
        value: 'lastModified',
        icon: <IconDateCreated />
    }];

    //--- Selection ------------------------------------
    const onSelectChanged = (selectedWriting, checked) => {
        const newSelection = [...selection];

        if (checked) {
            newSelection.push(selectedWriting.id);
        } else {
            const currentIndex = selection.indexOf(selectedWriting.id);
            newSelection.splice(currentIndex, 1);
        }

        setSelection(newSelection);
        setSelectedWritings(
            articles.data.filter((p) => newSelection.includes(p.id))
        );
    };

    const clearSelection = () => {
        setSelection([]);
        setSelectedWritings([]);
    }

    const onSelectAll = () => {
        if (articles.data.length > 0 && selection.length === articles.data.length) {
            clearSelection();
        } else {
            setSelection(articles.data.map((p) => p.id));
            setSelectedWritings(articles.data);
        }
    };

    const hasAllSelected = articles?.data.length > 0 && selection.length === articles?.data.length;
    const hasPartialSelection = selection.length > 0 && selection.length < articles?.data.length;


    return <DataView
        title={showTitle ? t('header.writings') : null}
        emptyText={t('writings.empty')}
        dataSource={articles}
        isFetching={isFetching}
        isError={isError}
        errorTitle={t('writings.error.loading.title')}
        errorDetail={t('writings.error.loading.detail')}
        showViewToggle={true}
        viewToggleKey='writings-list-view'
        cardRender={writing => (<WritingCard
            libraryId={libraryId} key={writing.id} writing={writing} t={t}
            isSelected={selection.indexOf(
                writing.id
            ) >= 0}
            onSelectChanged={(checked) => onSelectChanged(writing, checked)} />)}
        listItemRender={writing => (<WritingListItem
            libraryId={libraryId} key={writing.id} writing={writing} t={t}
            isSelected={selection.indexOf(
                writing.id
            ) >= 0}
            onSelectChanged={(checked) => onSelectChanged(writing, checked)} />)}
        onReload={refetch}
        onPageChanged={(index) => navigate(updateLinkToWritingsPage(location, {
            pageNumber: index,
            pageSize: pageSize,
        }))}
        onPageSizeChanged={(size) => navigate(updateLinkToWritingsPage(location, {
            pageNumber: 1,
            pageSize: size,
        }))}
        showSearch={showSearch}
        searchValue={query}
        onSearchChanged={search => navigate(updateLinkToWritingsPage(location, {
            pageNumber: 1,
            query: search,
        }))}
        actions={
            <Group wrap='nowrap'>
                <Checkbox
                    onChange={onSelectAll}
                    checked={hasAllSelected}
                    indeterminate={hasPartialSelection} />
                <Button.Group>
                    {/* <WritingDeleteButton articles={selectedWritings} t={t} type='default' onDeleted={clearSelection} /> */}
                    <WritingAssignButton libraryId={libraryId} articles={selectedWritings} t={t} type='default' onCompleted={clearSelection} />
                    <WritingStatusButton libraryId={libraryId} articles={selectedWritings} t={t} type='default' onCompleted={clearSelection} />
                </Button.Group>
            </Group>
        }
        extraFilters={
            <>
                <SortMenu options={writingSortOptions} value={sortBy} onChange={value => navigate(updateLinkToWritingsPage(location, {
                    pageNumber: 1,
                    sortBy: value,
                }))} />
                <SortDirectionToggle value={sortDirection} onChange={dir => navigate(updateLinkToWritingsPage(location, {
                    pageNumber: 1,
                    sortDirection: dir,
                }))} />
            </>
        }
    />;
}

WritingsList.propTypes = {
    libraryId: PropTypes.string,
    query: PropTypes.string,
    author: PropTypes.number,
    category: PropTypes.string,
    sortBy: PropTypes.string,
    sortDirection: PropTypes.string,
    favorite: PropTypes.string,
    read: PropTypes.string,
    status: PropTypes.string,
    pageNumber: PropTypes.number,
    pageSize: PropTypes.number,
    showSearch: PropTypes.bool,
    showTitle: PropTypes.bool,
}

export default WritingsList;