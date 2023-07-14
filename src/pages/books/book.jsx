import { useTranslation } from "react-i18next";
import {
    Link,
    useNavigate,
    useParams,
    useSearchParams,
} from "react-router-dom";

// 3rd party libraries
import { Button, Col, Row, Space, Tabs } from "antd";
import { FiEdit } from "react-icons/fi";
import { FaRegClone, FaRegFileAlt, FaRegFileWord } from "react-icons/fa";
import { ImBooks } from "react-icons/im";

// Local imports
import { useGetBookQuery } from "../../features/api/booksSlice";
import ContentsContainer from "../../components/layout/contentContainer";
import PageHeader from "../../components/layout/pageHeader";
import BookInfo from "../../components/books/bookInfo";
import ChaptersList from "../../components/books/chapters/chaptersList";
import PagesList from "../../components/books/pages/pagesList";
import FilesList from "../../components/books/files/filesList";
import Error from "../../components/common/error";
import Loading from "../../components/common/loader";
import BookDeleteButton from "../../components/books/bookDeleteButton";
import AuthorAvatar from "../../components/author/authorAvatar";
// ----------------------------------------------

const BookPage = () => {
    const { t } = useTranslation();
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const section = searchParams.get("section");
    const { libraryId, bookId } = useParams();
    const {
        data: book,
        error,
        isFetching,
    } = useGetBookQuery({ libraryId, bookId }, { skip: !libraryId || !bookId });

    if (isFetching) return <Loading />;
    if (error) return <Error />;

    const tabs = [
        {
            key: "chapters",
            label: (
                <Space gutter={2}>
                    <FaRegClone />
                    {t("book.chapters.title")}
                </Space>
            ),
            children: (
                <ChaptersList
                    libraryId={libraryId}
                    bookId={bookId}
                    t={t}
                    size="large"
                />
            ),
        },
        {
            key: "pages",
            label: (
                <Space gutter={2}>
                    <FaRegFileAlt />
                    {t("book.pages.title")}
                </Space>
            ),
            children: (
                <PagesList
                    libraryId={libraryId}
                    book={book}
                    t={t}
                    size="large"
                />
            ),
        },
        {
            key: "files",
            label: (
                <Space gutter={2}>
                    <FaRegFileWord />
                    {t("book.files.title")}
                </Space>
            ),
            children: <h1>Book Files</h1>,
        },
    ];

    const onChange = (key) => {
        navigate(`/libraries/${libraryId}/books/${book.id}/?section=${key}`);
    };
    return (
        <>
            <PageHeader
                title={book.title}
                subTitle={
                    <Space>
                        {book &&
                            book.authors.map((author) => (
                                <AuthorAvatar
                                    key={author.id}
                                    libraryId={libraryId}
                                    author={author}
                                    t={t}
                                    showName={true}
                                />
                            ))}
                    </Space>
                }
                icon={<ImBooks style={{ width: 36, height: 36 }} />}
                actions={[
                    <Button.Group>
                        <Button
                            block
                            icon={<FiEdit />}
                            onClick={() =>
                                navigate(
                                    `/libraries/${libraryId}/books/${book.id}/edit`
                                )
                            }
                        >
                            {t("actions.edit")}
                        </Button>
                        <BookDeleteButton
                            block
                            size="large"
                            libraryId={libraryId}
                            book={book}
                            t={t}
                        >
                            {t("actions.delete")}
                        </BookDeleteButton>
                    </Button.Group>,
                ]}
            />
            <ContentsContainer>
                <Row gutter={16}>
                    <Col l={4} md={6} xs={24}>
                        <BookInfo libraryId={libraryId} book={book} t={t} />
                    </Col>
                    <Col l={20} md={18} xs={24}>
                        <Tabs
                            defaultActiveKey={section}
                            items={tabs}
                            onChange={onChange}
                        />
                    </Col>
                </Row>
            </ContentsContainer>
        </>
    );
};

export default BookPage;
