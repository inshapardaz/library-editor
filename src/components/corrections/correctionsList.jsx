import PropTypes from 'prop-types';
import { useLocation, useNavigate } from 'react-router-dom';
import { useTranslation } from "react-i18next";

// Local imports
import { useGetCorrectionsQuery } from "@/store/slices/tools.api";
import CorrectionListItem from './correctionListItem';
import DataView from '@/components/dataView';
import { updateLinkToCorrectionsPage } from '@/utils';
//------------------------------

const CorrectionsList = ({
    language,
    profile,
    query = null,
    pageNumber,
    pageSize,
    showSearch = true,
}) => {
    const { t } = useTranslation();
    const navigate = useNavigate();
    const location = useLocation();

    const {
        refetch,
        data: corrections,
        isError,
        isFetching,
    } = useGetCorrectionsQuery({
        language,
        profile,
        query,
        pageNumber,
        pageSize
    });

    return <DataView
        emptyText={t('corrections.empty.title')}
        dataSource={corrections}
        isFetching={isFetching}
        isError={isError}
        errorTitle={t('corrections.error.loading.title')}
        errorDetail={t('corrections.error.loading.detail')}
        showViewToggle={false}
        viewToggleKey="correction-list-view"
        defaultViewType="list"
        listItemRender={correction => (<CorrectionListItem key={correction.id} t={t} correction={correction} />)}
        onReload={refetch}
        onPageChanged={(index) => navigate(updateLinkToCorrectionsPage(location, {
            pageNumber: index,
            pageSize: pageSize,
        }))}
        showSearch={showSearch}
        searchValue={query}
        onSearchChanged={search => navigate(updateLinkToCorrectionsPage(location, {
            pageNumber: 1,
            query: search,
        }))}
        cols={{ base: 1, xs: 2, sm: 3, md: 4, lg: 4, xl: 6 }}
    />;
}

CorrectionsList.propTypes = {
    profile: PropTypes.string,
    language: PropTypes.string,
    query: PropTypes.string,
    pageNumber: PropTypes.number,
    pageSize: PropTypes.number,
    showSearch: PropTypes.bool,
}

export default CorrectionsList;