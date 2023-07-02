// 3rd party libraries
import { Col, List, Row, Skeleton, Typography } from "antd";

// Internal Imports
import { useGetBookChaptersQuery } from "../../../features/api/booksSlice";
import Error from "../../common/error";
import ChapterListItem from "./chapterListItem";
import ChapterEditor from "./chapterEditor";

// ------------------------------------------------------

const ChaptersList = ({ libraryId, bookId, t, selectedChapterNumber = null, size = "default", hideTitle = false }) => {
    const { data: chapters, error, isFetching } = useGetBookChaptersQuery({ libraryId, bookId }, { skip: !libraryId || !bookId });

    if (error) return <Error t={t} />;

    const title = hideTitle ? null : <div>{t("book.chapters.title")}</div>;

    if (isFetching) return <Skeleton />;

    const header = (<Row>
        <Col flex="auto">
            <Typography level={3}>{title}</Typography>
        </Col>
        <Col>
            <ChapterEditor libraryId={libraryId} bookId={bookId} t={t} buttonType="dashed" />
        </Col>
    </Row>)
    return <List size={size} itemLayout="horizontal" dataSource={chapters ? chapters.data : []} header={header} renderItem={(chapter) => <ChapterListItem key={chapter.id} t={t} selected={selectedChapterNumber === chapter.chapterNumber} libraryId={libraryId} bookId={bookId} chapter={chapter} />} />;
};

export default ChaptersList;
