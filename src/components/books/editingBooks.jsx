import React from 'react';
import { useTranslation } from "react-i18next";
import { useNavigate, useParams } from "react-router-dom";
import { useLocalStorage } from "usehooks-ts";

// 3rd party libraries
import { Button, List, Segmented } from "antd";

// Internal Imports
import DataContainer from "/src/components/layout/dataContainer";
import { useGetMyBooksQuery } from "/src/store/slices/booksSlice";
import BookCard from "./bookCard";
import BookListItem from "./bookListItem";
import { FaRegImage, FaRegListAlt } from '/src/icons';

// ------------------------------------------------------

const ShowMoreButton = ({ libraryId, t, status }) => {
    const navigate = useNavigate();
    return (
        <div
            style={{
                textAlign: "center",
                marginTop: 12,
                height: 32,
                lineHeight: "32px",
            }}
        >
            <Button
                size="small"
                onClick={() =>
                    navigate(`/libraries/${libraryId}/books?status=${status}`)
                }
            >
                {t("actions.seeMore")}
            </Button>
        </div>
    );
}

const grid = {
    gutter: 4,
    xs: 1,
    sm: 2,
    md: 2,
    lg: 3,
    xl: 4,
    xxl: 5,
};

const EditingBooks = ({ status }) => {
    const { t } = useTranslation();
    const { libraryId } = useParams();
    const {
        data: books,
        error,
        isFetching,
    } = useGetMyBooksQuery({
        libraryId,
        sortBy: "DateCreated",
        sortDirection: "descending",
        status: status,
    });
    const [showList, setShowList] = useLocalStorage("books-list-view", false);

    const toggleView = (checked) => {
        setShowList(checked);
    };

    return (
        <DataContainer
            title={t(`books.${status}.title`)}
            busy={isFetching}
            error={error}
            empty={books && books.data && books.data.length < 1}
            extra={<Segmented size="small"
                onChange={toggleView}
                value={showList}
                options={[
                    { value: true, icon: <FaRegListAlt /> },
                    { value: false, icon: <FaRegImage /> },
                ]}
            />}
        >
            <List
                grid={showList ? null : grid}
                loading={isFetching}
                size="large"
                itemLayout={showList ? "vertical" : "horizontal"}
                dataSource={books ? books.data : []}
                loadMore={<ShowMoreButton t={t} libraryId={libraryId} />}
                renderItem={(book) => (
                    <List.Item>
                        {showList ? (
                            <BookListItem
                                key={book.id}
                                libraryId={libraryId}
                                book={book}
                                t={t}
                            />
                        ) : (
                            <BookCard
                                key={book.id}
                                libraryId={libraryId}
                                book={book}
                                t={t}
                            />
                        )}
                    </List.Item>
                )}
            />
        </DataContainer>
    );
};

export default EditingBooks;
