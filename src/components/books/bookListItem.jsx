import { Link, useNavigate } from "react-router-dom";

// 3rd Party Libraries
import { Avatar, List, Typography } from "antd";
import { FiEdit, FiLayers } from "react-icons/fi";
import { AiOutlineCopy } from "react-icons/ai";

// Local Import
import styles from "../../styles/common.module.scss";
import AuthorAvatar from "../author/authorAvatar";
import { BookCategory } from "./bookCategory";
import { BookSeriesInfo } from "./bookSeriesInfo";
import helpers from "../../helpers/index";
import { IconText } from "../common/iconText";
import BookDeleteButton from "./bookDeleteButton";
// ------------------------------------------------------

const { Text, Paragraph } = Typography;

// ------------------------------------------------------

function BookListItem({ libraryId, book, t }) {
    const navigate = useNavigate();

    const cover = book.links.image ? (
        <img
            src={book.links.image}
            onError={helpers.setDefaultBookImage}
            className={styles["book__image--small"]}
            alt={book.title}
        />
    ) : (
        <img
            src={helpers.defaultBookImage}
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
                />:null}
    </>);
    const chapterCount = (
        <IconText
            onClick={() => navigate(`/libraries/${libraryId}/books/${book.id}`)}
            icon={FiLayers}
            text={t("book.chapterCount", { count: book.chapterCount })}
            key="book-chapter-count"
        />
    );
    const pageCount = (
        <IconText
            onClick={() => navigate(`/libraries/${libraryId}/books/${book.id}/?section=pages`)}
            icon={AiOutlineCopy}
            text={t("book.pageCount", { count: book.pageCount })}
            key="book-page-count"
        />
    );

    const fileCount = (
        <IconText
            onClick={() => navigate(`/libraries/${libraryId}/books/${book.id}/?section=files`)}
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
                <IconText
                    onClick={() => navigate(`/libraries/${libraryId}/books/${book.id}/edit`)}
                    icon={FiEdit}
                    key="book-edit"
                />,
                <BookDeleteButton
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
