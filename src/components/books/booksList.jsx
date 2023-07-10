import { useTranslation } from "react-i18next";
import { Link, useNavigate } from "react-router-dom";
import { useLocalStorage } from "usehooks-ts";

// 3rd party libraries
import { Button, List, Switch } from "antd";
import { FaBook, FaPlus } from "react-icons/fa";

// Local Imports
import helpers from "../../helpers";
import DataContainer from "../layout/dataContainer";
import BookCard from "./bookCard";
import BookListItem from "./bookListItem";
import { useGetBooksQuery } from "../../features/api/booksSlice";
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
}) {
    const { t } = useTranslation();
    const navigate = useNavigate();
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

    const toggleView = (checked) => {
        setShowList(checked);
    };

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
            helpers.buildLinkToBooksPage(
                libraryId,
                newPage,
                newPageSize,
                query,
                author,
                categories,
                series,
                sortBy,
                sortDirection,
                favorite,
                read
            )
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
                <Link to={`/libraries/${libraryId}/books/add`}>
                    <Button type="dashed" icon={<FaPlus />}>
                        {t("book.actions.add.label")}
                    </Button>
                </Link>
            }
            empty={books && books.data && books.data.length < 1}
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
