import PropTypes from 'prop-types';
import { useLocation, useNavigate } from 'react-router-dom';
import { useTranslation } from "react-i18next";

// Local imports
import { useGetCommonWordsQuery } from "@/store/slices/tools.api";
import DataView from '@/components/dataView';
import { updateLinkToCorrectionsPage } from '@/utils';
import CommonWordListItem from './commonWordListItem';
//------------------------------

const CommonWordsList = ({
    language,
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
        data: words,
        isError,
        isFetching,
    } = useGetCommonWordsQuery({
        language,
        query,
        pageNumber,
        pageSize
    });

    return <DataView
        emptyText={t('commonWords.empty.title')}
        dataSource={words}
        isFetching={isFetching}
        isError={isError}
        errorTitle={t('commonWords.error.loading.title')}
        errorDetail={t('commonWords.error.loading.detail')}
        showViewToggle={false}
        viewToggleKey="commonWord-list-view"
        defaultViewType="list"
        listItemRender={w => (<CommonWordListItem key={w.id} t={t} word={w} />)}
        onReload={refetch}
        onPageChanged={(index) => navigate(updateLinkToCorrectionsPage(location, {
            pageNumber: index,
            pageSize: pageSize,
        }))}
        onPageSizeChanged={(size) => navigate(updateLinkToCorrectionsPage(location, {
            pageNumber: 1,
            pageSize: size,
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

CommonWordsList.propTypes = {
    language: PropTypes.string,
    query: PropTypes.string,
    pageNumber: PropTypes.number,
    pageSize: PropTypes.number,
    showSearch: PropTypes.bool,
}

export default CommonWordsList;