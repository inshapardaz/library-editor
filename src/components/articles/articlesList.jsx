import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useLocalStorage } from "usehooks-ts";

// 3rd party libraries
import { Button, Input, List, Space, Switch } from "antd";
import { FaPenFancy, FaPlus } from "react-icons/fa";

// Local Imports
import { useGetArticlesQuery } from "/src/store/slices/articlesSlice";
import { updateLinkToArticlesPage } from "/src/util";
import DataContainer from "/src/components/layout/dataContainer";
import ArticleSortButton from "./articleSortButton";
import ArticleStatusFilterButton from "./articleStatusFilterButton";
import ArticleListItem from "./articleListItem";
import ArticleCard from "./articleCard";
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

const ArticlesList = ({
    libraryId,
    query,
    author,
    categories,
    type,
    sortBy,
    sortDirection,
    favorite,
    read,
    status,
    pageNumber,
    pageSize,
    showSearch = true,
}) => {
    const { t } = useTranslation();
    const navigate = useNavigate();
    const location = useLocation();
    const [search, setSearch] = useState(query);
    const [showList, setShowList] = useLocalStorage("articles-list-view", true);

    const {
        refetch,
        data: articles,
        error,
        isFetching,
    } = useGetArticlesQuery({
        libraryId,
        query,
        author,
        categories,
        type,
        sortBy,
        sortDirection,
        favorite,
        read,
        status,
        pageNumber,
        pageSize,
    });

    const renderItem = (article) => {
        if (showList) {
            return (
                <ArticleListItem
                    key={article.id}
                    libraryId={libraryId}
                    article={article}
                    t={t}
                />
            );
        } else {
            return (
                <List.Item>
                    <ArticleCard
                        key={article.id}
                        libraryId={libraryId}
                        article={article}
                        t={t}
                    />
                </List.Item>
            );
        }
    };

    const onPageChanged = (newPage, newPageSize) => {
        navigate(
            updateLinkToArticlesPage(location, {
                pageNumber: newPage,
                pageSize: newPageSize,
            })
        );
    };

    const onSearch = () => {
        navigate(
            updateLinkToArticlesPage(location, {
                pageNumber: 1,
                query: search,
            })
        );
    };

    return (
        <DataContainer
            busy={isFetching}
            error={error}
            errorTitle={t("articles.errors.loading.title")}
            errorSubTitle={t("article.errors.loading.subTitle")}
            errorAction={
                <Button type="default" onClick={refetch}>
                    {t("actions.retry")}
                </Button>
            }
            emptyImage={<FaPenFancy size="5em" />}
            emptyDescription={t("articles.empty.title")}
            emptyContent={
                <Link to={`/libraries/${libraryId}/articles/add`}>
                    <Button type="dashed" icon={<FaPlus />}>
                        {t("article.actions.add.label")}
                    </Button>
                </Link>
            }
            empty={articles && articles.data && articles.data.length < 1}
            bordered={false}
            extra={
                <Space>
                    {showSearch && (
                        <Input.Search
                            size="medium"
                            value={search}
                            allowClear
                            onChange={(e) => setSearch(e.target.value)}
                            onSearch={onSearch}
                            placeholder={t("articles.search.placeholder")}
                        />
                    )}
                    <Button.Group>
                        <ArticleStatusFilterButton t={t} status={status} />
                        <ArticleSortButton
                            sortBy={sortBy}
                            sortDirection={sortDirection}
                            t={t}
                        />
                    </Button.Group>
                    <Switch
                        checkedChildren={t("actions.list")}
                        unCheckedChildren={t("actions.card")}
                        checked={showList}
                        onChange={(checked) => setShowList(checked)}
                    />
                </Space>
            }
        >
            <List
                grid={showList ? null : grid}
                loading={isFetching}
                size="large"
                itemLayout={showList ? "vertical" : "horizontal"}
                dataSource={articles ? articles.data : []}
                pagination={{
                    onChange: onPageChanged,
                    pageSize: articles ? articles.pageSize : 0,
                    current: articles ? articles.currentPageIndex : 0,
                    total: articles ? articles.totalCount : 0,
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

export default ArticlesList;
