import React from 'react';
import { Link, useNavigate } from "react-router-dom";

// 3rd Party Libraries
import { Avatar, List, Typography } from "antd";

// Local Import
import "./styles.scss";
import { FiEdit, FiLayers, AiOutlineCopy } from "/src/icons";
import { setDefaultBookImage, bookPlaceholderImage } from "/src/util";
import AuthorAvatar from "/src/components/author/authorAvatar";
import IconText from "/src/components/common/iconText";
import BookCategory from "./bookCategory";
import BookSeriesInfo from "./bookSeriesInfo";
import BookDeleteButton from "./bookDeleteButton";
// ------------------------------------------------------

const { Text, Paragraph } = Typography;

// ------------------------------------------------------

const BookListItem = ({ libraryId, book, t }) => {
    const navigate = useNavigate();

    const cover = book.links.image ? (
        <img
            src={book.links.image}
            onError={setDefaultBookImage}
            className="book__image book__image--small"
            alt={book.title}
            onClick={() => navigate(`/libraries/${libraryId}/books/${book.id}`)}
        />
    ) : (
        <img
            src={bookPlaceholderImage}
            className="book__image book__image--small"
            alt={book.title}
            onClick={() => navigate(`/libraries/${libraryId}/books/${book.id}`)}
        />
    );
    const title = (<div className="book__title" onClick={() => navigate(`/libraries/${libraryId}/books/${book.id}`)}>{book.title}</div>)
    const avatar = (
        <Avatar.Group maxCount="2" size="large">
            {book.authors.map((author) => (
                <AuthorAvatar
                    key={author.id}
                    libraryId={libraryId}
                    author={author}
                    t={t}
                />
            ))}
        </Avatar.Group>
    );
    const description = (<>
        {book.description ? (
            <Paragraph type="secondary" ellipsis>
                {book.description}
            </Paragraph>
        ) : (
            <Text type="secondary">{t("book.noDescription")}</Text>
        )}
        {book?.seriesName ? <BookSeriesInfo
            key={`${book.id}-action-series`}
            book={book}
            t={t}
        /> : null}
    </>);

    const actions = [(
        <IconText href={`/libraries/${libraryId}/books/${book.id}`}
            icon={FiLayers}
            text={t("book.chapterCount", { count: book.chapterCount })}
            key="book-chapter-count"
        />
    ), (
        <IconText href={`/libraries/${libraryId}/books/${book.id}/?section=pages`}
            icon={AiOutlineCopy}
            text={t("book.pageCount", { count: book.pageCount })}
            key="book-page-count"
        />
    ), (
        <IconText href={`/libraries/${libraryId}/books/${book.id}/?section=files`}
            icon={AiOutlineCopy}
            text={t("book.fileCount", { count: book.contents?.length ?? 0 })}
            key="book-file-count"
        />
    ), (
        <BookCategory
            key={`${book.id}-action-categories`}
            justList
            book={book}
        />
    )];

    if (book?.link?.update) {
        actions.push(
            <Tooltip title={t("actions.edit")}>
                <Button onClick={() => navigate(`/libraries/${libraryId}/books/${book.id}/edit`)}
                    icon={<FiEdit />}
                    type="ghost"
                    size="small" />
            </Tooltip>
        );
    }

    if (book?.links?.delete) {
        actions.push(
            <BookDeleteButton
                libraryId={libraryId}
                book={book}
                t={t}
                type="ghost"
                size="small"
            />
        );
    }

    return (
        <List.Item
            key={book.id}
            actions={actions}
            extra={cover}
        >
            <List.Item.Meta
                avatar={avatar}
                title={title}
                description={description}
            />
        </List.Item>
    );
}

export default BookListItem;
