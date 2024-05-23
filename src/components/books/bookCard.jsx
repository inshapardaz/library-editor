import React from 'react';
import { Link } from "react-router-dom";

// 3rd Party Libraries
import { Avatar, Card } from "antd";
import { FiEdit } from "react-icons/fi";

// Local Imports
import "./styles.scss";
import { setDefaultBookImage, bookPlaceholderImage } from "/src/util";
import AuthorAvatar from "/src/components/author/authorAvatar";
import BookSeriesInfo from "./bookSeriesInfo";
import BookDeleteButton from "./bookDeleteButton";
// --------------------------------------------

const BookCard = ({ libraryId, book, t }) => {
    const cover = book.links.image ? (
        <img
            src={book.links.image}
            onError={setDefaultBookImage}
            className="book__image"
            alt={book.title}
        />
    ) : (
        <img
            src={bookPlaceholderImage}
            className="book__image"
            alt={book.title}
        />
    );
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
    const edit = (
        <Link to={`/libraries/${libraryId}/books/${book.id}/edit`}>
            <FiEdit />
        </Link>
    );
    const deleteAction = (
        <BookDeleteButton
            libraryId={libraryId}
            book={book}
            t={t}
            type="ghost"
            size="small"
        />
    );
    return (
        <Card
            key={book.id}
            cover={cover}
            actions={[edit, deleteAction]}
        >
            <Link to={`/libraries/${libraryId}/books/${book.id}`}>
                <Card.Meta
                    avatar={avatar}
                    title={book.title}
                    description={<BookSeriesInfo book={book} t={t} />}
                />
            </Link>
        </Card>
    );
}

export default BookCard;
