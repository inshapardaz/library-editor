import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useLocalStorage } from "usehooks-ts";

// 3rd party libraries
import { Button, Input, List, Space, Switch } from "antd";
import { FaPlus } from "react-icons/fa";
import { ImBooks } from "react-icons/im";

// Local Imports
import { useGetSeriesQuery } from "/src/store/slices/seriesSlice";
import { updateLinkToSeriesPage } from "/src/util";
import DataContainer from "/src/components/layout/dataContainer";
import SeriesCard from "./seriesCard";
import SeriesListItem from "./seriesListItem";
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

const SeriesList = ({
    libraryId,
    query,
    pageNumber,
    pageSize,
    showSearch = true,
}) => {
    const { t } = useTranslation();
    const navigate = useNavigate();
    const location = useLocation();
    const [search, setSearch] = useState(query);
    const [showList, setShowList] = useLocalStorage("series-list-view", false);

    const {
        refetch,
        data: series,
        error,
        isFetching,
    } = useGetSeriesQuery({ libraryId, query, pageNumber, pageSize });

    const toggleView = (checked) => {
        setShowList(checked);
    };

    const renderItem = (s) => {
        if (showList) {
            return (
                <SeriesListItem
                    key={s.id}
                    libraryId={libraryId}
                    series={s}
                    t={t}
                />
            );
        } else {
            return (
                <List.Item>
                    <SeriesCard
                        key={s.id}
                        libraryId={libraryId}
                        series={s}
                        t={t}
                    />
                </List.Item>
            );
        }
    };

    const onPageChanged = (newPage, newPageSize) => {
        navigate(
            updateLinkToSeriesPage(location, {
                pageNumber: newPage,
                pageSize: newPageSize,
                query,
            })
        );
    };

    const onSearch = () => {
        navigate(
            updateLinkToSeriesPage(location, {
                pageNumber: 1,
                query: search,
            })
        );
    };
    return (
        <DataContainer
            busy={isFetching}
            error={error}
            errorTitle={t("series.errors.loading.title")}
            errorSubTitle={t("series.errors.loading.subTitle")}
            errorAction={
                <Button type="default" onClick={refetch}>
                    {t("actions.retry")}
                </Button>
            }
            emptyImage={<ImBooks size="5em" />}
            emptyDescription={t("series.empty.title")}
            emptyContent={
                <Link to={`/libraries/${libraryId}/series/add`}>
                    <Button type="dashed" icon={<FaPlus />}>
                        {t("series.actions.add.label")}
                    </Button>
                </Link>
            }
            empty={series && series.data && series.data.length < 1}
            extra={
                <Space>
                    {showSearch && (
                        <Input.Search
                            size="medium"
                            value={search}
                            allowClear
                            onChange={(e) => setSearch(e.target.value)}
                            onSearch={onSearch}
                            placeholder={t("authors.search.placeholder")}
                        />
                    )}
                    <Switch
                        checkedChildren={t("actions.list")}
                        unCheckedChildren={t("actions.card")}
                        checked={showList}
                        onChange={toggleView}
                    />
                </Space>
            }
        >
            <List
                grid={showList ? null : grid}
                loading={isFetching}
                size="large"
                itemLayout={showList ? "vertical" : "horizontal"}
                dataSource={series ? series.data : []}
                pagination={{
                    onChange: onPageChanged,
                    pageSize: series ? series.pageSize : 0,
                    current: series ? series.currentPageIndex : 0,
                    total: series ? series.totalCount : 0,
                    showSizeChanger: true,
                    responsive: true,
                    showQuickJumper: true,
                    pageSizeOptions: [12, 24, 48, 96],
                }}
                renderItem={renderItem}
            />
        </DataContainer>
    );
};

export default SeriesList;
