import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useLocalStorage } from "usehooks-ts";

// 3rd party libraries
import { Button, Input, List, Space, Switch } from "antd";
import { FaFeatherAlt, FaPlus } from "react-icons/fa";

// Local Imports
import { buildLinkToAuthorsPage } from "/src/util";
import { useGetAuthorsQuery } from "/src/store/slices/authorsSlice";
import DataContainer from "/src/components/layout/dataContainer";
import AuthorCard from "./authorCard";
import AuthorListItem from "./authorListItem";
import AuthorSortButton from "./authorSortButton";
// ------------------------------------------------------

const grid = {
    gutter: 4,
    xs: 1,
    sm: 2,
    md: 2,
    lg: 3,
    xl: 4,
    xxl: 5,
};

// ------------------------------------------------------

const AuthorsList = ({
    libraryId,
    query,
    authorType,
    pageNumber,
    pageSize,
    sortDirection,
    showSearch = true,
}) => {
    const { t } = useTranslation();
    const navigate = useNavigate();
    const location = useLocation();
    const [search, setSearch] = useState(query);
    const [showList, setShowList] = useLocalStorage("author-list-view", false);

    const {
        refetch,
        data: authors,
        error,
        isFetching,
    } = useGetAuthorsQuery({
        libraryId,
        query,
        authorType,
        pageNumber,
        pageSize,
    });

    const toggleView = (checked) => {
        setShowList(checked);
    };

    const renderItem = (author) => {
        if (showList) {
            return (
                <AuthorListItem
                    key={author.id}
                    libraryId={libraryId}
                    author={author}
                    t={t}
                />
            );
        } else {
            return (
                <List.Item>
                    <AuthorCard
                        key={author.id}
                        libraryId={libraryId}
                        author={author}
                        t={t}
                    />
                </List.Item>
            );
        }
    };

    const onPageChanged = (newPage, newPageSize) => {
        navigate(
            buildLinkToAuthorsPage(
                location.pathname,
                newPage,
                newPageSize,
                query,
                authorType
            )
        );
    };

    const onSearch = () => {
        navigate(
            buildLinkToAuthorsPage(
                location.pathname,
                1,
                pageSize,
                search,
                authorType
            )
        );
    };

    return (
        <DataContainer
            busy={isFetching}
            error={error}
            errorTitle={t("authors.errors.loading.title")}
            errorSubTitle={t("authors.errors.loading.subTitle")}
            errorAction={
                <Button type="default" onClick={refetch}>
                    {t("actions.retry")}
                </Button>
            }
            emptyImage={<FaFeatherAlt size="5em" />}
            emptyDescription={t("authors.empty.title")}
            emptyContent={
                <Link to={`/libraries/${libraryId}/authors/add`}>
                    <Button type="dashed" icon={<FaPlus />}>
                        {t("author.actions.add.label")}
                    </Button>
                </Link>
            }
            empty={authors && authors.data && authors.data.length < 1}
            extra={
                <Space>
                    {showSearch && (
                        <Input.Search
                            allowClear
                            size="medium"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            onSearch={onSearch}
                            placeholder={t("authors.search.placeholder")}
                        />
                    )}
                    <AuthorSortButton t={t} sortDirection={sortDirection} />
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
                dataSource={authors ? authors.data : []}
                pagination={{
                    onChange: onPageChanged,
                    pageSize: authors ? authors.pageSize : 0,
                    current: authors ? authors.currentPageIndex : 0,
                    total: authors ? authors.totalCount : 0,
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

export default AuthorsList;
