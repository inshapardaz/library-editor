import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { useLocalStorage } from "usehooks-ts";

// 3rd party libraries
import { List, Switch } from "antd";

// Local Imports
import DataContainer from "../layout/dataContainer"
import SeriesCard from './seriesCard'
import helpers from '../../helpers';
import SeriesListItem from "./seriesListItem";
import { useGetSeriesQuery } from '../../features/api/seriesSlice'
// ------------------------------------------------------

const grid = {
    gutter: 4,
    xs: 1,
    sm: 2,
    md: 3,
    lg: 3,
    xl: 4,
    xxl: 5,
};

// ------------------------------------------------------

function SeriesList({libraryId, query, pageNumber, pageSize}) {
    const { t } = useTranslation()
    const navigate = useNavigate()
    const [showList, setShowList] = useLocalStorage('series-list-view', false);

    const { data : series, error, isFetching } = useGetSeriesQuery({libraryId, query, pageNumber, pageSize})

    const toggleView = (checked) => {
        setShowList(checked);
    };

    const renderItem = (s) => {
        if (showList) {
            return <SeriesListItem key={s.id} libraryId={libraryId} series={s} t={t} />
        }
        else {
            return <List.Item><SeriesCard key={s.id} libraryId={libraryId} series={s} t={t} /></List.Item>
        }
    }

    const onPageChanged = (newPage, newPageSize) => {
        navigate(helpers.buildLinkToSeriesPage(
            libraryId,
            newPage,
            newPageSize,
            query
            ));
        }

        return (<DataContainer
            busy={isFetching}
            error={error}
            empty={series && series.data && series.data.length < 1}
            actions={(<Switch checkedChildren={t('actions.list')} unCheckedChildren={t('actions.card')} checked={showList} onChange={toggleView} />) }>
            <List
                grid={ showList ? null : grid}
                loading={isFetching}
                size="large"
                itemLayout={ showList ? "vertical": "horizontal" }
                dataSource={series ? series.data : []}
                pagination={{
                    onChange: onPageChanged,
                    pageSize: series ? series.pageSize : 0,
                    current: series ? series.currentPageIndex : 0,
                    total: series ? series.totalCount : 0,
                    showSizeChanger: true,
                    responsive: true,
                    showQuickJumper: true,
                    pageSizeOptions: [12, 24, 48, 96]
                }}
                renderItem={renderItem}
            />
        </DataContainer>);
}

export default SeriesList;
