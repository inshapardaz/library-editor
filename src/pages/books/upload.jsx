import React, { useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { useParams } from 'react-router-dom';

// 3rd party libraries
import { FaCloudUploadAlt, FaFileUpload, FaTrash } from 'react-icons/fa';
import { App, Button, Col, Form, Input, InputNumber, Layout, List, Row, Space, Spin, Switch, Typography, Upload, theme } from 'antd';

// Local Imports
import { useGetLibraryQuery } from '../../features/api/librariesSlice';
import { useAddBookContentMutation, useAddBookMutation } from '../../features/api/booksSlice';
import PageHeader from '../../components/layout/pageHeader';
import ContentsContainer from '../../components/layout/contentContainer';
import AuthorsSelect from '../../components/author/authorsSelect';
import CategoriesSelect from '../../components/categories/categoriesSelect';
import LanguageSelect from '../../components/languageSelect';
import PublishStatusSelect from '../../components/publishStatusSelect';
import SeriesSelect from '../../components/series/seriesSelect';
import CopyrightSelect from '../../components/copyrightSelect';

//--------------------------------------------------------
const { Dragger } = Upload;
const { Content, Sider } = Layout;
//--------------------------------------------------------
const trimExtension = (fileName) => fileName.replace(/\.[^/.]+$/, "");
//--------------------------------------------------------
const BooksUpload = () => {
    const { t } = useTranslation();
    const { message } = App.useApp();
    const {
        token: { colorBgContainer },
    } = theme.useToken();
    const { libraryId } = useParams();
    const { library, isFetching } = useGetLibraryQuery({ libraryId }, { skip: libraryId === null })
    const [addBook, { isLoading: isAdding }] = useAddBookMutation();
    const [addBookContent, { isLoading: isUploading }] = useAddBookContentMutation();
    const [books, setBooks] = React.useState([]);
    const initialUpload = {
        isPublic: false,
        language: library?.language ?? 'en',
    };

    const props = {
        name: 'file',
        multiple: true,
        onChange: ({ file }) => {
            if (file.type !== "application/pdf") {
                message.error(t("errors.imageRequired"));
                return;
            }
            return setBooks(e => [...e, { id: file.uid, title: trimExtension(file.name), file }]);
        },
        itemRender: () => null,
        beforeUpload: () => false
    };

    const saveBook = async (bookSpecs, book) => {
        var payload = {
            title: book.title,
            libraryId: libraryId,
            isPublic: bookSpecs.isPublic,
            language: bookSpecs.language,
            authors: book.authors ?? bookSpecs.authors?.map(a => ({ id: a.id })),
            categories: bookSpecs.categories?.map(c => ({ id: c.id })),
            yearPublished: bookSpecs.yearPublished,
            publisher: bookSpecs.publisher,
            copyrights: bookSpecs.copyright,
            seriesId: bookSpecs.seriesId,
            seriesIndex: book.seriesIndex,
            source: bookSpecs.source,
            status: bookSpecs.status
        }
        return addBook({ libraryId, payload })
            .unwrap()
            .then(newBook => addBookContent({ book: newBook, payload: book.file }).unwrap());
    }
    const onSubmit = async (bookSpecs) => {
        const promises = books.map((book) => {
            return saveBook(bookSpecs, book);
        });
        Promise.all(promises)
            .then(() => setBooks([]))
            .then(() =>
                message.success(t("books.actions.upload.success"))
            )
            .catch((e) => {
                console.error(e);
                message.error(t("books.actions.upload.error"))
            });
    };

    const removeBook = useCallback((book) => {
        setBooks(l => l.filter(b => b.id !== book.id))
    }, []);

    const changeBookTitle = useCallback((book, title) => {
        let newBooks = [...books];
        newBooks.find(b => b.id === book.id).title = title;
        setBooks(newBooks);
    }, [books]);

    const changeBookSeriesIndex = useCallback((book, value) => {
        let newBooks = [...books];
        newBooks.find(b => b.id === book.id).seriesIndex = value;
        setBooks(newBooks);
    }, [books]);

    const changeBookAuthor = useCallback((book, value) => {
        let newBooks = [...books];
        newBooks.find(b => b.id === book.id).authors = value;
        setBooks(newBooks);
    }, [books]);
    return (
        <>
            <PageHeader
                title={t("books.actions.upload.title")}
                icon={<FaCloudUploadAlt style={{ width: 36, height: 36 }} />}
            />
            <ContentsContainer>
                <Spin spinning={isFetching | isAdding | isUploading}>
                    <Form name="bookUpload" onFinish={onSubmit} size="middle" layout="vertical" initialValues={initialUpload}>
                        <Layout
                            style={{ padding: "24px 0", background: colorBgContainer }}
                        >
                            <Sider
                                style={{ background: colorBgContainer }}
                                width={200}
                                breakpoint="lg"
                                collapsedWidth={0}
                            >
                                <Form.Item name="isPublic" valuePropName="checked" label={t("book.public.label")}>
                                    <Switch />
                                </Form.Item>
                                <Form.Item
                                    name="authors"
                                    label={t("book.authors.label")}
                                    rules={[
                                        {
                                            required: true,
                                            message: t("book.authors.required"),
                                        },
                                    ]}
                                >
                                    <AuthorsSelect placeholder={t("book.authors.placeholder")} t={t} libraryId={libraryId} />
                                </Form.Item>
                                <Form.Item name="categories" label={t("book.categories.label")}>
                                    <CategoriesSelect libraryId={libraryId} placeholder={t("book.categories.placeholder")} />
                                </Form.Item>
                                <Form.Item
                                    name="language"
                                    label={t("book.language.label")}
                                    rules={[
                                        {
                                            required: true,
                                            message: t("book.language.required"),
                                        },
                                    ]}
                                >
                                    <LanguageSelect placeholder={t("book.language.placeholder")} />
                                </Form.Item>
                                <Form.Item name="yearPublished" label={t("book.yearPublished.label")}>
                                    <InputNumber min={1} />
                                </Form.Item>
                                <Form.Item name="publisher" label={t("book.publisher.label")}>
                                    <Input placeholder={t("book.publisher.placeholder")} />
                                </Form.Item>
                                <Form.Item name="copyrights" label={t("book.copyrights.label")}>
                                    <CopyrightSelect t={t} />
                                </Form.Item>
                                <Form.Item name="seriesId" label={t("book.series.label")}>
                                    <SeriesSelect placeholder={t("book.series.placeholder")} t={t} libraryId={libraryId} label={initialUpload && initialUpload.seriesName} />
                                </Form.Item>
                                <Form.Item name="source" label={t("book.source.label")}>
                                    <Input placeholder={t("book.source.placeholder")} />
                                </Form.Item>
                                <Form.Item name="status" label={t("book.status.label")} placeholder={t("book.status.placeholder")}>
                                    <PublishStatusSelect t={t} />
                                </Form.Item>
                                <Form.Item >
                                    <Button type="primary" htmlType="submit" size="large" block>
                                        {t("books.actions.upload.label")}
                                    </Button>
                                </Form.Item>
                            </Sider>
                            <Content style={{
                                marginRight: 8,
                            }}>
                                <Space direction='vertical' style={{ width: "100%" }}>
                                    <Dragger {...props}>
                                        <p className="ant-upload-drag-icon">
                                            <FaFileUpload />
                                        </p>
                                        <p className="ant-upload-text">{t('books.actions.upload.message')}</p>
                                    </Dragger>
                                    <List
                                        dataSource={books}
                                        renderItem={book => (
                                            <List.Item actions={[<Button type='text' icon={<FaTrash />} onClick={() => removeBook(book)} />]}
                                                locale={{ emptyText: t('books.actions.upload.empty') }}>
                                                <List.Item.Meta
                                                    title={<Row gutter={8} justify="space-between">
                                                        <Col>
                                                            <Typography.Text>{t('book.title.label')}</Typography.Text>
                                                        </Col>
                                                        <Col flex={4}>
                                                            <Input value={book.title} onChange={e => changeBookTitle(book, e.currentTarget.value)} />
                                                        </Col>
                                                        <Col>
                                                            <Typography.Text>{t('book.authors.label')}</Typography.Text>
                                                        </Col>
                                                        <Col flex={2}>
                                                            <AuthorsSelect placeholder={t("book.authors.placeholder")} t={t} value={book.authors ?? []}
                                                                onChange={value => changeBookAuthor(book, value)} libraryId={libraryId} />
                                                        </Col>
                                                        <Col>
                                                            <Typography.Text>{t('book.seriesIndex.label')}</Typography.Text>
                                                        </Col>
                                                        <Col flex={2}>
                                                            <InputNumber value={book.seriesIndex} onChange={value => changeBookSeriesIndex(book, value)} />
                                                        </Col>
                                                        <Col>
                                                            <Typography.Text>
                                                                {book.file.name}
                                                            </Typography.Text>
                                                        </Col>
                                                    </Row>}
                                                />
                                            </List.Item>
                                        )}
                                    />
                                </Space>
                            </Content>
                        </Layout>
                    </Form>
                </Spin>
            </ContentsContainer>
        </>
    );
};

export default BooksUpload;
