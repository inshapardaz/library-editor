import PropTypes from 'prop-types';
import { useLocation, useNavigate } from 'react-router-dom';
import { useTranslation } from "react-i18next";

// Local imports
import { useGetPeriodicalsQuery } from "@/store/slices/periodicals.api";
import PeriodicalCard from './periodicalCard';
import PeriodicalListItem from './periodicalListItem';
import DataView from '@/components/dataView';
import { updateLinkToPeriodicalsPage } from '@/utils';
//------------------------------

const PeriodicalsList = ({
    libraryId,
    query = null,
    category = null,
    sortBy = null,
    sortDirection = null,
    frequency = null,
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
        data: periodicals,
        isError,
        isFetching,
    } = useGetPeriodicalsQuery({
        libraryId,
        query,
        category,
        frequency,
        sortBy,
        sortDirection,
        pageNumber,
        pageSize,
    });

    return <DataView
        title={showTitle ? t('periodicals.title') : null}
        emptyText={t('periodicals.empty.title')}
        dataSource={periodicals}
        isFetching={isFetching}
        isError={isError}
        errorTitle={t('periodicals.error.loading.title')}
        errorDetail={t('periodicals.error.loading.detail')}
        showViewToggle={true}
        viewToggleKey='periodicals-list-view'
        cardRender={periodical => (<PeriodicalCard libraryId={libraryId} key={periodical.id} periodical={periodical} />)}
        listItemRender={periodical => (<PeriodicalListItem libraryId={libraryId} key={periodical.id} periodical={periodical} />)}
        onReload={refetch}
        onPageChanged={(index) => navigate(updateLinkToPeriodicalsPage(location, {
            pageNumber: index,
            pageSize: pageSize,
        }))}
        onPageSizeChanged={(size) => navigate(updateLinkToPeriodicalsPage(location, {
            pageNumber: 1,
            pageSize: size,
        }))}
        showSearch={showSearch}
        searchValue={query}
        onSearchChanged={search => navigate(updateLinkToPeriodicalsPage(location, {
            pageNumber: 1,
            query: search,
        }))}
        cols={{ base: 1, xs: 2, sm: 3, md: 4, lg: 4, xl: 6 }}
    />;
}

PeriodicalsList.propTypes = {
    libraryId: PropTypes.string,
    query: PropTypes.string,
    category: PropTypes.string,
    sortBy: PropTypes.string,
    sortDirection: PropTypes.string,
    frequency: PropTypes.string,
    pageNumber: PropTypes.number,
    pageSize: PropTypes.number,
    showSearch: PropTypes.bool,
    showTitle: PropTypes.bool,
}

export default PeriodicalsList;