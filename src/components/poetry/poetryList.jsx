import PropTypes from 'prop-types';
import { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useTranslation } from "react-i18next";

// Ui library Imports
import { Button, Checkbox, Group } from '@mantine/core';

// Local imports
import { useGetArticlesQuery } from "@/store/slices/articles.api";
import PoetryCard from './poetryCard';
import PoetryListItem from './poetryListItem';
import DataView from '@/components/dataView';
import { updateLinkToWritingsPage } from '@/utils';
import SortMenu from '@/components/sortMenu';
import SortDirectionToggle from '@/components/sortDirectionToggle';
import { IconTitle, IconDateCreated } from '@/components/icons';
// import WritingDeleteButton from './writingDeleteButton';
import PoetryAssignButton from './poetryAssignButton';
import PoetryStatusButton from './poetryStatusButton';
//------------------------------

const PoetryList = ({
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
    const [selectedPoetry, setSelectedPoetry] = useState([]);

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
        type: 'poetry',
        sortBy,
        sortDirection,
        favorite,
        read,
        status,
        pageNumber,
        pageSize,
    });

    let poetrySortOptions = [{
        label: t('poetry.title.label'),
        value: 'title',
        icon: <IconTitle />
    }, {
        label: t('poetry.lastModified'),
        value: 'lastModified',
        icon: <IconDateCreated />
    }];


    //--- Selection ------------------------------------
    const onSelectChanged = (selectedPoetry, checked) => {
        const newSelection = [...selection];

        if (checked) {
            newSelection.push(selectedPoetry.id);
        } else {
            const currentIndex = selection.indexOf(selectedPoetry.id);
            newSelection.splice(currentIndex, 1);
        }

        setSelection(newSelection);
        setSelectedPoetry(
            articles.data.filter((p) => newSelection.includes(p.id))
        );
    };

    const clearSelection = () => {
        setSelection([]);
        setSelectedPoetry([]);
    }

    const onSelectAll = () => {
        if (articles.data.length > 0 && selection.length === articles.data.length) {
            clearSelection();
        } else {
            setSelection(articles.data.map((p) => p.id));
            setSelectedPoetry(articles.data);
        }
    };

    const hasAllSelected = articles?.data.length > 0 && selection.length === articles?.data.length;
    const hasPartialSelection = selection.length > 0 && selection.length < articles?.data.length;


    return <DataView
        title={showTitle ? t('header.poetry') : null}
        emptyText={t('poetries.empty')}
        dataSource={articles}
        isFetching={isFetching}
        isError={isError}
        errorTitle={t('poetries.error.loading.title')}
        errorDetail={t('poetries.error.loading.detail')}
        showViewToggle={true}
        viewToggleKey='poetries-list-view'
        cardRender={poetry => (<PoetryCard
            libraryId={libraryId} key={poetry.id} poetry={poetry} t={t}
            isSelected={selection.indexOf(
                poetry.id
            ) >= 0}
            onSelectChanged={(checked) => onSelectChanged(poetry, checked)} />)}
        listItemRender={poetry => (<PoetryListItem libraryId={libraryId} key={poetry.id} poetry={poetry} t={t}
            isSelected={selection.indexOf(
                poetry.id
            ) >= 0}
            onSelectChanged={(checked) => onSelectChanged(poetry, checked)} />)}
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
                    <PoetryAssignButton libraryId={libraryId} articles={selectedPoetry} t={t} type='default' onCompleted={clearSelection} />
                    <PoetryStatusButton libraryId={libraryId} articles={selectedPoetry} t={t} type='default' onCompleted={clearSelection} />
                </Button.Group>
            </Group>
        }
        extraFilters={
            <>
                <SortMenu options={poetrySortOptions} value={sortBy} onChange={value => navigate(updateLinkToWritingsPage(location, {
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

PoetryList.propTypes = {
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

export default PoetryList;