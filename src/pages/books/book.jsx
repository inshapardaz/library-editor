import React from 'react';
import { useTranslation } from "react-i18next";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";

// 3rd party libraries
import { Button, Col, Row, Space, Tabs } from "antd";
import { FiEdit } from "/src/icons";
import { FaRegClone, FaRegFileAlt, FaRegFileWord } from "/src/icons";
import { ImBooks } from "/src/icons";

// Local imports
import { useGetBookQuery } from "/src/store/slices/booksSlice";
import ContentsContainer from "/src/components/layout/contentContainer";
import PageHeader from "/src/components/layout/pageHeader";
import BookInfo from "/src/components/books/bookInfo";
import ChaptersList from "/src/components/books/chapters/chaptersList";
import PagesList from "/src/components/books/pages/pagesList";
import FilesList from "/src/components/books/files/filesList";
import Error from "/src/components/common/error";
import Loading from "/src/components/common/loader";
import BookDeleteButton from "/src/components/books/bookDeleteButton";
import AuthorAvatar from "/src/components/author/authorAvatar";
import BookPublishButton from "/src/components/books/bookPublishButton";
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
    if (error) return <Error t={t} />;

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
                    {t("pages.title")}
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
            children: (
                <FilesList
                    libraryId={libraryId}
                    book={book}
                    t={t}
                    size="large"
                />
            ),
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
                    <Button.Group key="button-group">
                        <Button
                            key="edit-button"
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
                        <BookPublishButton
                            key="publish-button"
                            block
                            size="large"
                            book={book}
                            icon={<FiEdit />}
                            t={t}
                        >
                            {t("book.actions.publish.title")}
                        </BookPublishButton>
                        <BookDeleteButton
                            key="delete-button"
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
                            activeKey={section}
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
