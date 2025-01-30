import PropTypes from 'prop-types';
import { useLocation, useNavigate } from 'react-router-dom';
import { useTranslation } from "react-i18next";

// Local imports
import { useGetArticlesQuery } from "@/store/slices/articles.api";
import PoetryCard from './poetryCard';
import PoetryListItem from './poetryListItem';
import DataView from '@/components/dataView';
import { updateLinkToWritingsPage } from '@/utils';
import SortMenu from '@/components/sortMenu';
import SortDirectionToggle from '@/components/sortDirectionToggle';
import { IconTitle, IconDateCreated } from '@/components/icons';
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
        cardRender={poetry => (<PoetryCard libraryId={libraryId} key={poetry.id} poetry={poetry} t={t} />)}
        listItemRender={poetry => (<PoetryListItem libraryId={libraryId} key={poetry.id} poetry={poetry} t={t} />)}
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