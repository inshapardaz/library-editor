import { useTranslation } from "react-i18next";
import { Link, useNavigate } from "react-router-dom";
import { useLocalStorage } from "usehooks-ts";

// 3rd party libraries
import { Button, List, Switch } from "antd";
import { FaPlus } from "react-icons/fa";
import { ImNewspaper } from "react-icons/im";

// Local Imports
import helpers from "../../helpers";
import DataContainer from "../layout/dataContainer";
import PeriodicalCard from "./periodicalCard";
import PeriodicalListItem from "./periodicalListItem";
import { useGetPeriodicalsQuery } from "../../features/api/periodicalsSlice";
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

function PeriodicalsList({
    libraryId,
    query,
    sortBy,
    sortDirection,
    pageNumber,
    pageSize,
}) {
    const { t } = useTranslation();
    const navigate = useNavigate();
    const [showList, setShowList] = useLocalStorage(
        "periodicals-list-view",
        false
    );

    const {
        refetch,
        data: periodicals,
        error,
        isFetching,
    } = useGetPeriodicalsQuery({
        libraryId,
        query,
        sortBy,
        sortDirection,
        pageNumber,
        pageSize,
    });

    const toggleView = (checked) => {
        setShowList(checked);
    };

    const renderItem = (periodical) => {
        if (showList) {
            return (
                <PeriodicalListItem
                    key={periodical.id}
                    libraryId={libraryId}
                    periodical={periodical}
                    t={t}
                />
            );
        } else {
            return (
                <List.Item>
                    <PeriodicalCard
                        key={periodical.id}
                        libraryId={libraryId}
                        periodical={periodical}
                        t={t}
                    />
                </List.Item>
            );
        }
    };

    const onPageChanged = (newPage, newPageSize) => {
        navigate(
            helpers.buildLinkToPeriodicalsPage(
                libraryId,
                newPage,
                newPageSize,
                query,
                sortBy,
                sortDirection
            )
        );
    };

    return (
        <DataContainer
            busy={isFetching}
            error={error}
            errorTitle={t("periodicals.errors.loading.title")}
            errorSubTitle={t("periodicals.errors.loading.subTitle")}
            errorAction={
                <Button type="default" onClick={refetch}>
                    {t("actions.retry")}
                </Button>
            }
            emptyImage={<ImNewspaper size="5em" />}
            emptyDescription={t("periodicals.empty.title")}
            emptyContent={
                <Link to={`/libraries/${libraryId}/periodicals/add`}>
                    <Button type="dashed" icon={<FaPlus />}>
                        {t("periodical.actions.add.label")}
                    </Button>
                </Link>
            }
            empty={
                periodicals && periodicals.data && periodicals.data.length < 1
            }
            extra={
                <Switch
                    checkedChildren={t("actions.list")}
                    unCheckedChildren={t("actions.card")}
                    checked={showList}
                    onChange={toggleView}
                />
            }
        >
            <List
                grid={showList ? null : grid}
                loading={isFetching}
                size="large"
                itemLayout={showList ? "vertical" : "horizontal"}
                dataSource={periodicals ? periodicals.data : []}
                pagination={{
                    onChange: onPageChanged,
                    pageSize: periodicals ? periodicals.pageSize : 0,
                    current: periodicals ? periodicals.currentPageIndex : 0,
                    total: periodicals ? periodicals.totalCount : 0,
                    showSizeChanger: true,
                    responsive: true,
                    showQuickJumper: true,
                    pageSizeOptions: [12, 24, 48, 96],
                }}
                renderItem={renderItem}
            />
        </DataContainer>
    );
}

export default PeriodicalsList;
