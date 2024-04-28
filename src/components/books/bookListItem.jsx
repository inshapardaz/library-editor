import { Link, useNavigate } from "react-router-dom";

// 3rd Party Libraries
import { Avatar, List, Typography } from "antd";
import { FiEdit, FiLayers } from "react-icons/fi";
import { AiOutlineCopy } from "react-icons/ai";

// Local Import
import * as styles from "~/src/styles/common.module.scss";
import { setDefaultBookImage, bookPlaceholderImage } from "~/src/util";
import AuthorAvatar from "~/src/components/author/authorAvatar";
import IconText from "~/src/components/common/iconText";
import BookCategory from "./bookCategory";
import BookSeriesInfo from "./bookSeriesInfo";
import BookDeleteButton from "./bookDeleteButton";
// ------------------------------------------------------

const { Text, Paragraph } = Typography;

// ------------------------------------------------------

function BookListItem({ libraryId, book, t }) {
    const navigate = useNavigate();

    const cover = book.links.image ? (
        <img
            src={book.links.image}
            onError={setDefaultBookImage}
            className={styles["book__image--small"]}
            alt={book.title}
        />
    ) : (
        <img
            src={bookPlaceholderImage}
            className={styles["book__image--small"]}
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
    const title = (
        <Link to={`/libraries/${libraryId}/books/${book.id}`}>
            {book.title}
        </Link>
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
    const chapterCount = (
        <IconText href={`/libraries/${libraryId}/books/${book.id}`}
            icon={FiLayers}
            text={t("book.chapterCount", { count: book.chapterCount })}
            key="book-chapter-count"
        />
    );
    const pageCount = (
        <IconText href={`/libraries/${libraryId}/books/${book.id}/?section=pages`}
            icon={AiOutlineCopy}
            text={t("book.pageCount", { count: book.pageCount })}
            key="book-page-count"
        />
    );

    const fileCount = (
        <IconText href={`/libraries/${libraryId}/books/${book.id}/?section=files`}
            icon={AiOutlineCopy}
            text={t("book.fileCount", { count: book.contents?.length ?? 0 })}
            key="book-file-count"
        />
    );

    return (
        <List.Item
            key={book.id}
            actions={[
                chapterCount,
                pageCount,
                fileCount,
                <BookCategory
                    key={`${book.id}-action-categories`}
                    justList
                    book={book}
                />,
                <IconText href={`/libraries/${libraryId}/books/${book.id}/edit`}
                    icon={FiEdit}
                    key="book-edit"
                />,
                <BookDeleteButton
                    key="delete-button"
                    libraryId={libraryId}
                    book={book}
                    t={t}
                    type="ghost"
                    size="small"
                />,
            ]}
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
