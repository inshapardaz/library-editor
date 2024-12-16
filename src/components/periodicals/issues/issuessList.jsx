import PropTypes from 'prop-types';
import { useLocation, useNavigate, useSearchParams } from 'react-router-dom';
import { useTranslation } from "react-i18next";

// Local imports
import { useGetIssuesQuery } from '@/store/slices/issues.api';
import { updateLinkToIssuePage } from '@/utils';
import { SortDirection } from "@/models";
import DataView from '@/components/dataView';
import IssueCard from './issueCard';
import IssueListItem from './issueListItem';
import SortDirectionToggle from '@/components/sortDirectionToggle';
//------------------------------

const IssuesList = ({
    libraryId,
    periodicalId = null,
    volumeNumber = null,
    frequency,
    showTitle = true
}) => {
    const { t } = useTranslation();
    const navigate = useNavigate();
    const location = useLocation();
    const [searchParams] = useSearchParams();

    const query = searchParams.get("query");
    const year = searchParams.get("year") ?? "title";
    const sortBy = searchParams.get("sortBy") ?? "issueDate";
    const sortDirection = searchParams.get("sortDirection") ?? SortDirection.Ascending;
    const pageNumber = searchParams.get("pageNumber") ?? 1;
    const pageSize = searchParams.get("pageSize") ?? 12;

    const {
        refetch,
        data: issues,
        isError,
        isFetching,
    } = useGetIssuesQuery({
        libraryId,
        periodicalId,
        query,
        year,
        volumeNumber,
        sortBy,
        sortDirection,
        pageNumber,
        pageSize,
    });

    return <DataView
        title={showTitle ? t('issues.title') : null}
        emptyText={t('issues.empty.title')}
        dataSource={issues}
        isFetching={isFetching}
        isError={isError}
        errorTitle={t('issues.error.loading.title')}
        errorDetail={t('issues.error.loading.detail')}
        showViewToggle={true}
        viewToggleKey='issues-list-view'
        cardRender={issue => (<IssueCard libraryId={libraryId} key={issue.id} issue={issue} frequency={frequency} />)}
        listItemRender={issue => (<IssueListItem libraryId={libraryId} key={issue.id} issue={issue} frequency={frequency} />)}
        onReload={refetch}
        onPageChanged={(index) => navigate(updateLinkToIssuePage(location, {
            pageNumber: index,
            pageSize: pageSize,
        }))}
        showSearch={false}
        searchValue={query}
        onSearchChanged={search => navigate(updateLinkToIssuePage(location, {
            pageNumber: 1,
            query: search,
        }))}
        extraFilters={
            <SortDirectionToggle value={sortDirection} onChange={dir => navigate(updateLinkToIssuePage(location, {
                pageNumber: 1,
                sortDirection: dir,
            }))} />
        }
        cols={{ base: 1, xs: 2, sm: 2, md: 3, lg: 3, xl: 4 }}
    />;
}

IssuesList.propTypes = {
    libraryId: PropTypes.string,
    periodicalId: PropTypes.string,
    volumeNumber: PropTypes.string,
    frequency: PropTypes.string,
    showTitle: PropTypes.bool,
}

export default IssuesList;