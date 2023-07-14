// 3rd party imports
import { Space, Typography } from "antd";

// Local imports
import helpers from "../../helpers";
import { BookCategory } from "./bookCategory";
import { BookSeriesInfo } from "./bookSeriesInfo";
import styles from "../../styles/common.module.scss";

// -----------------------------------------

// -----------------------------------------
const { Paragraph } = Typography;
// ---------------------------------------------

const BookInfo = ({ libraryId, book, t }) => {
    const cover = book.links.image ? (
        <img
            className={styles["book__image--thumbnail"]}
            src={book.links.image}
            onError={helpers.setDefaultBookImage}
            alt={book.title}
        />
    ) : (
        <img
            className={styles["book__image--thumbnail"]}
            src={helpers.defaultBookImage}
            alt={book.title}
        />
    );

    return (
        <>
            <Space direction="vertical" style={{ width: "100%" }}>
                {cover}
                <Paragraph ellipsis={{ rows: 4, tooltip: book.description }}>
                    {book.description}
                </Paragraph>
                {book.yearPublished &&
                    t("book.publishLabel", { year: book.yearPublished })}
                <BookCategory libraryId={libraryId} book={book} />
                <BookSeriesInfo book={book} t={t} />
            </Space>
        </>
    );
};

export default BookInfo;
