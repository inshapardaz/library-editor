import PropTypes from 'prop-types';
import { useLocation, useNavigate } from 'react-router-dom';
import { useTranslation } from "react-i18next";

// Local imports
import { useGetLibrariesQuery } from "@/store/slices/libraries.api";
import LibraryCard from './libraryCard';
import LibraryListItem from './libraryListItem';
import DataView from '@/components/dataView';
import { updateLinkToLibrariesPage } from '@/utils';
//------------------------------

const LibrariesList = ({
    query,
    sortBy,
    sortDirection,
    pageNumber,
    pageSize,
    showSearch
}) => {
    const { t } = useTranslation();
    const navigate = useNavigate();
    const location = useLocation();

    const { refetch, data: libraries, isError, isFetching } = useGetLibrariesQuery({
        query,
        pageNumber,
        pageSize,
        sortBy,
        sortDirection
    });

    return <DataView
        title={t('header.libraries')}
        emptyText={t('libraries.empty')}
        dataSource={libraries}
        isFetching={isFetching}
        isError={isError}
        showViewToggle={true}
        viewToggleKey='library-list-view'
        cardRender={library => (<LibraryCard library={library} key={library.id} />)}
        listItemRender={library => (<LibraryListItem library={library} key={library.id} />)}
        onReload={refetch}
        onPageChanged={(index) => navigate(updateLinkToLibrariesPage(location, {
            pageNumber: index,
            pageSize: pageSize,
        }))}
        showSearch={showSearch}
        searchValue={query}
        onSearchChanged={search => navigate(updateLinkToLibrariesPage(location, {
            pageNumber: 1,
            query: search,
        }))}
    />;
}

LibrariesList.propTypes = {
    query: PropTypes.string,
    sortBy: PropTypes.string,
    sortDirection: PropTypes.string,
    pageNumber: PropTypes.number,
    pageSize: PropTypes.number,
    showSearch: PropTypes.bool,
    showMore: PropTypes.bool
}

export default LibrariesList;