import { useTranslation } from "react-i18next";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useLocalStorage } from "usehooks-ts";

// 3rd party libraries
import { Button, Input, List, Space, Switch } from "antd";
import { FaBook, FaCloudUploadAlt, FaPlus } from "react-icons/fa";

// Local Imports
import helpers from "../../helpers";
import DataContainer from "../layout/dataContainer";
import BookCard from "./bookCard";
import BookListItem from "./bookListItem";
import { useGetBooksQuery } from "../../features/api/booksSlice";
import { useState } from "react";
import BookStatusFilterButton from "./bookStatusFilterButton";
import BookSortButton from "./bookSortButton";
// ------------------------------------------------------

const grid = {
    gutter: 4,
    xs: 1,
    sm: 1,
    md: 2,
    lg: 2,
    xl: 3,
    xxl: 5,
};

// ------------------------------------------------------

function BooksList({
    libraryId,
    query,
    author,
    categories,
    series,
    sortBy,
    sortDirection,
    favorite,
    read,
    status,
    pageNumber,
    pageSize,
    showSearch = true,
}) {
    const { t } = useTranslation();
    const navigate = useNavigate();
    const location = useLocation();
    const [search, setSearch] = useState(query);
    const [showList, setShowList] = useLocalStorage("books-list-view", false);

    const {
        refetch,
        data: books,
        error,
        isFetching,
    } = useGetBooksQuery({
        libraryId,
        query,
        author,
        categories,
        series,
        sortBy,
        sortDirection,
        favorite,
        read,
        status,
        pageNumber,
        pageSize,
    });

    const renderItem = (book) => {
        if (showList) {
            return (
                <BookListItem
                    key={book.id}
                    libraryId={libraryId}
                    book={book}
                    t={t}
                />
            );
        } else {
            return (
                <List.Item>
                    <BookCard
                        key={book.id}
                        libraryId={libraryId}
                        book={book}
                        t={t}
                    />
                </List.Item>
            );
        }
    };

    const onPageChanged = (newPage, newPageSize) => {
        navigate(
            helpers.updateLinkToBooksPage(location, {
                pageNumber: newPage,
                pageSize: newPageSize,
            })
        );
    };

    const onSearch = () => {
        navigate(
            helpers.updateLinkToBooksPage(location, {
                pageNumber: 1,
                query: search,
            })
        );
    };

    return (
        <DataContainer
            busy={isFetching}
            error={error}
            errorTitle={t("books.errors.loading.title")}
            errorSubTitle={t("books.errors.loading.subTitle")}
            errorAction={
                <Button type="default" onClick={refetch}>
                    {t("actions.retry")}
                </Button>
            }
            emptyImage={<FaBook size="5em" />}
            emptyDescription={t("books.empty.title")}
            emptyContent={
                <Space>
                    <Link to={`/libraries/${libraryId}/books/add`}>
                        <Button type="dashed" icon={<FaPlus />}>
                            {t("book.actions.add.label")}
                        </Button>
                    </Link>
                    <Link to={`/libraries/${libraryId}/books/upload`}>
                        <Button type="dashed" icon={<FaCloudUploadAlt />}>
                            {t("books.actions.upload.label")}
                        </Button>
                    </Link>
                </Space>
            }
            empty={books && books.data && books.data.length < 1}
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
                            placeholder={t("books.search.placeholder")}
                        />
                    )}
                    <Button.Group>
                        <BookStatusFilterButton t={t} status={status} />
                        <BookSortButton
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
                dataSource={books ? books.data : []}
                pagination={{
                    onChange: onPageChanged,
                    pageSize: books ? books.pageSize : 0,
                    current: books ? books.currentPageIndex : 0,
                    total: books ? books.totalCount : 0,
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

export default BooksList;
