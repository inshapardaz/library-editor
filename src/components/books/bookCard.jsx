import { Link } from "react-router-dom";

// 3rd Party Libraries
import { Avatar, Card } from "antd";
import { FiEdit } from "react-icons/fi";

// Local Imports
import styles from "../../styles/common.module.scss";
import AuthorAvatar from "../author/authorAvatar";
import helpers from "../../helpers/index";
import { BookSeriesInfo } from "./bookSeriesInfo";
import BookDeleteButton from "./bookDeleteButton";
// --------------------------------------------

function BookCard({ libraryId, book, t }) {
    const cover = book.links.image ? (
        <img
            src={book.links.image}
            onError={helpers.setDefaultBookImage}
            className={styles["book__image"]}
            alt={book.title}
        />
    ) : (
        <img
            src={helpers.defaultBookImage}
            className={styles["book__image"]}
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
            hoverable
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
