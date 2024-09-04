import React from 'react';
import { Link, Navigate, useNavigate } from "react-router-dom";

// 3rd Party Libraries
import { Avatar, Card, Tooltip } from "antd";

// Local Imports
import "./styles.scss";
import { FiEdit } from "/src/icons";
import { setDefaultBookImage, bookPlaceholderImage } from "/src/util";
import AuthorAvatar from "/src/components/author/authorAvatar";
import BookSeriesInfo from "./bookSeriesInfo";
import BookDeleteButton from "./bookDeleteButton";
// --------------------------------------------

const BookCard = ({ libraryId, book, t }) => {
    const navigate = useNavigate();
    const cover = book.links.image ? (
        <img
            src={book.links.image}
            onError={setDefaultBookImage}
            className="book__image"
            alt={book.title}
            onClick={() => navigate(`/libraries/${libraryId}/books/${book.id}`)}
        />
    ) : (
        <img
            src={bookPlaceholderImage}
            className="book__image"
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
    const actions = [];
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
        <Card
            key={book.id}
            cover={cover}
            actions={actions}
        >
            <Card.Meta
                avatar={avatar}
                title={title}
                description={<BookSeriesInfo book={book} t={t} />}
            />
        </Card>
    );
}

export default BookCard;
