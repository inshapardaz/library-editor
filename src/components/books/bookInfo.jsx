import React from 'react';

// 3rd party imports
import { Divider, Progress, Space, Typography } from "antd";

// Local imports
import "./styles.scss";
import { FiLayers, AiOutlineCopy } from "/src/icons";
import { setDefaultBookImage, bookPlaceholderImage } from "/src/util";
import IconText from "/src/components/common/iconText";
import EditingStatusIcon from "/src/components/editingStatusIcon";
import BookCategory from "./bookCategory";
import BookSeriesInfo from "./bookSeriesInfo";
import BookStatusIcon from './bookStatusIcon';
// -----------------------------------------
const { Paragraph } = Typography;
// ---------------------------------------------

const BookInfo = ({ libraryId, book, t }) => {
    const cover = book.links.image ? (
        <img
            className="book__image--thumbnail"
            src={book.links.image}
            onError={setDefaultBookImage}
            alt={book.title}
        />
    ) : (
        <img
            className="book__image--thumbnail"
            src={bookPlaceholderImage}
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
                <IconText icon={FiLayers} text={t("book.chapterCount", { count: book.chapterCount })} />
                <IconText icon={AiOutlineCopy} text={t("book.pageCount", { count: book.pageCount })} />
                <IconText icon={BookStatusIcon({ status: book.status, render: false })} text={t(`bookStatus.${book.status}`)} />
                {book?.pageStatus && <Divider />}
                {book?.pageStatus?.map(s => (
                    <Space direction="vertical" key={`status-${s.status}`} style={{ width: "100%" }}>
                        <IconText
                            icon={EditingStatusIcon({ status: s.status, render: false })}
                            text={t(`editingStatus.${s.status}`)}
                            secondaryText={s.count} />
                        <Progress percent={s.percentage} size="small" />
                    </Space>
                ))}
            </Space>
        </>
    );
};

export default BookInfo;
