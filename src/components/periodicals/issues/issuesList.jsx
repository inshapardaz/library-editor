import { useTranslation } from "react-i18next";
import { Link, useNavigate } from "react-router-dom";
import { useLocalStorage } from "usehooks-ts";

// 3rd party libraries
import { Button, List, Switch } from "antd";
import { FaPlus } from "react-icons/fa";
import { GiNewspaper } from "react-icons/gi";

// Local Imports
import { useGetIssuesQuery } from "~/src/store/slices/issuesSlice";
import { buildLinkToIssuesPage } from "~/src/util";
import DataContainer from "~/src/components/layout/dataContainer";
import IssueCard from "./issueCard";
import IssueListItem from "./issueListItem";
// ------------------------------------------------------

const grid = {
    gutter: 4,
    xs: 1,
    sm: 2,
    md: 2,
    lg: 3,
    xl: 3,
    xxl: 4,
};

// ------------------------------------------------------

const IssuesList = ({
    libraryId,
    periodicalId,
    query,
    year,
    categories,
    sortBy,
    sortDirection,
    status,
    pageNumber,
    pageSize,
}) => {
    const { t } = useTranslation();
    const navigate = useNavigate();
    const [showList, setShowList] = useLocalStorage("issues-list-view", false);

    const {
        refetch,
        data: issues,
        error,
        isFetching,
    } = useGetIssuesQuery({
        libraryId,
        periodicalId,
        query,
        year,
        categories,
        sortBy,
        sortDirection,
        status,
        pageNumber,
        pageSize,
    });

    const toggleView = (checked) => {
        setShowList(checked);
    };

    const renderItem = (issue) => {
        if (showList) {
            return (
                <IssueListItem
                    key={issue.id}
                    libraryId={libraryId}
                    periodicalId={periodicalId}
                    issue={issue}
                    t={t}
                />
            );
        } else {
            return (
                <List.Item>
                    <IssueCard
                        key={issue.id}
                        libraryId={libraryId}
                        periodicalId={periodicalId}
                        issue={issue}
                        t={t}
                    />
                </List.Item>
            );
        }
    };

    const onPageChanged = (newPage, newPageSize) => {
        navigate(
            buildLinkToIssuesPage(
                libraryId,
                periodicalId,
                newPage,
                newPageSize,
                query,
                categories,
                sortBy,
                sortDirection
            )
        );
    };

    return (
        <DataContainer
            busy={isFetching}
            error={error}
            errorTitle={t("issues.errors.loading.title")}
            errorSubTitle={t("issues.errors.loading.subTitle")}
            errorAction={
                <Button type="default" onClick={refetch}>
                    {t("actions.retry")}
                </Button>
            }
            empty={issues && issues.data && issues.data.length < 1}
            emptyImage={<GiNewspaper size="5em" />}
            emptyDescription={t("issues.empty.title")}
            emptyContent={
                <Link
                    to={`/libraries/${libraryId}/periodicals/${periodicalId}/issues/add`}
                >
                    <Button type="dashed" icon={<FaPlus />}>
                        {t("issue.actions.add.label")}
                    </Button>
                </Link>
            }
            bordered={false}
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
                dataSource={issues ? issues.data : []}
                pagination={{
                    onChange: onPageChanged,
                    pageSize: issues ? issues.pageSize : 0,
                    current: issues ? issues.currentPageIndex : 0,
                    total: issues ? issues.totalCount : 0,
                    showSizeChanger: true,
                    responsive: true,
                    showQuickJumper: true,
                    position: 'both',
                    pageSizeOptions: [12, 24, 48, 96],
                }}
                renderItem={renderItem}
            />
        </DataContainer>
    );
};

export default IssuesList;
