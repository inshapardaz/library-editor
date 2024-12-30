import PropTypes from 'prop-types';
import { useLocation, useNavigate } from 'react-router-dom';
import { useTranslation } from "react-i18next";

// Local imports
import { useGetSeriesQuery } from "@/store/slices/series.api";
import SeriesCard from './seriesCard';
import SeriesListItem from './seriesListItem';
import DataView from '@/components/dataView';
import { updateLinkToSeriesPage } from '@/utils';
import SortMenu from '@/components/sortMenu';
import SortDirectionToggle from '@/components/sortDirectionToggle';
import { IconTitle, IconDateCreated } from '@/components/icons';
//------------------------------

const SeriesList = ({
    libraryId,
    query = null,
    sortBy = null,
    sortDirection = null,
    status,
    pageNumber,
    pageSize,
    showSearch = true,
}) => {
    const { t } = useTranslation();
    const navigate = useNavigate();
    const location = useLocation();

    const {
        refetch,
        data: series,
        isError,
        isFetching,
    } = useGetSeriesQuery({
        libraryId,
        query,
        sortBy,
        sortDirection,
        status,
        pageNumber,
        pageSize,
    });

    let seriesSortOptions = [{
        label: t('series.name.label'),
        value: 'title',
        icon: <IconTitle />
    }, {
        label: t('series.noOfBooks'),
        value: 'bookCount',
        icon: <IconDateCreated />
    }];

    return <DataView
        emptyText={t('series.empty')}
        dataSource={series}
        isFetching={isFetching}
        isError={isError}
        errorTitle={t('series.error.loading.title')}
        errorDetail={t('series.error.loading.detail')}
        showViewToggle={true}
        viewToggleKey='series-list-view'
        cardRender={series => (<SeriesCard libraryId={libraryId} key={series.id} series={series} />)}
        listItemRender={series => (<SeriesListItem libraryId={libraryId} key={series.id} series={series} />)}
        onReload={refetch}
        onPageChanged={(index) => navigate(updateLinkToSeriesPage(location, {
            pageNumber: index,
            pageSize: pageSize,
        }))}
        showSearch={showSearch}
        searchValue={query}
        onSearchChanged={search => navigate(updateLinkToSeriesPage(location, {
            pageNumber: 1,
            query: search,
        }))}
        extraFilters={
            <>
                <SortMenu options={seriesSortOptions} value={sortBy} onChange={value => navigate(updateLinkToSeriesPage(location, {
                    pageNumber: 1,
                    sortBy: value,
                }))} />
                <SortDirectionToggle value={sortDirection} onChange={dir => navigate(updateLinkToSeriesPage(location, {
                    pageNumber: 1,
                    sortDirection: dir,
                }))} />
            </>
        }
        cols={{ base: 1, xs: 2, sm: 3, md: 4, lg: 4, xl: 6 }}
    />;
}

SeriesList.propTypes = {

    libraryId: PropTypes.string,
    query: PropTypes.string,
    sortBy: PropTypes.string,
    sortDirection: PropTypes.string,
    status: PropTypes.string,
    pageNumber: PropTypes.number,
    pageSize: PropTypes.number,
    showSearch: PropTypes.bool,
}

export default SeriesList;