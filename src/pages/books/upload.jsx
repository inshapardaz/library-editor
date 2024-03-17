import React, { } from 'react';
import { useTranslation } from 'react-i18next';
import { useParams } from 'react-router-dom';

// 3rd party libraries
import { FaCloudUploadAlt, FaFileUpload, FaSave, FaTrash } from 'react-icons/fa';
import { App, Button, Card, Col, Form, Input, InputNumber, Row, Spin, Switch, Upload } from 'antd';

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
//--------------------------------------------------------
const trimExtension = (fileName) => fileName.replace(/\.[^/.]+$/, "");
//--------------------------------------------------------

const BookUploadForm = ({ t, libraryId, showTitle = false }) => {
    return (<>
        <Row gutter={16}>
            <Col span={8}>
                {showTitle && (<Form.Item
                    name="title"
                    label={t("book.title.label")}
                    rules={[
                        {
                            required: true,
                            message: t("book.title.required"),
                        },
                    ]}
                >
                    <Input placeholder={t("book.title.placeholder")} />
                </Form.Item>)}
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
                <Form.Item name="copyrights" label={t("book.copyrights.label")}>
                    <CopyrightSelect t={t} />
                </Form.Item>
                <Form.Item name="isPublic" valuePropName="checked" label={t("book.public.label")}>
                    <Switch />
                </Form.Item>
            </Col>
            <Col span={8}>
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
                <Form.Item name="yearPublished" label={t("book.yearPublished.label")}>
                    <InputNumber min={1} max={new Date().getFullYear()} />
                </Form.Item>
                <Form.Item name="status" label={t("book.status.label")} placeholder={t("book.status.placeholder")}>
                    <PublishStatusSelect t={t} />
                </Form.Item>
            </Col>
            <Col span={8}>
                <Form.Item name="categories" label={t("book.categories.label")}>
                    <CategoriesSelect libraryId={libraryId} placeholder={t("book.categories.placeholder")} />
                </Form.Item>
                <Form.Item name="publisher" label={t("book.publisher.label")}>
                    <Input placeholder={t("book.publisher.placeholder")} />
                </Form.Item>
                <Form.Item name="seriesId" label={t("book.series.label")}>
                    <SeriesSelect placeholder={t("book.series.placeholder")} t={t} libraryId={libraryId} />
                </Form.Item>
            </Col>
        </Row>
    </>)
}

//--------------------------------------------------------
const BooksUpload = () => {
    const { t } = useTranslation();
    const { message } = App.useApp();
    const { libraryId } = useParams();
    const { library, isFetching } = useGetLibraryQuery({ libraryId }, { skip: libraryId === null })
    const [addBook, { isLoading: isAdding }] = useAddBookMutation();
    const [addBookContent, { isLoading: isUploading }] = useAddBookContentMutation();
    const initialValue = {
        isPublic: false,
        language: library?.language ?? 'en',
        books: []
    };
    const [form] = Form.useForm();

    const props = {
        name: 'file',
        multiple: true,
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

    const onFinished = (values) => {
        const books = values.books;
        const promises = books.map((book) => {
            return saveBook(values, book);
        });
        Promise.all(promises)
            .then(() =>
                message.success(t("books.actions.upload.success"))
            )
            .catch((e) => {
                console.error(e);
                message.error(t("books.actions.upload.error"))
            });
    }

    const saveButton = (
        <Button type="primary" htmlType="submit" size="large" block icon={<FaSave />} >
            {t("actions.save")}
        </Button>
    );

    return (
        <Form name="bookUpload" size="middle" initialValues={initialValue} onFinish={onFinished} form={form} onFieldsChange={(e) => console.log(e)}>
            <PageHeader
                title={t("books.actions.upload.title")}
                icon={<FaCloudUploadAlt style={{ width: 36, height: 36 }} />}
                actions={[saveButton]}
            />
            <ContentsContainer>
                <Spin spinning={isFetching | isAdding | isUploading}>
                    <Card title={t('books.actions.upload.defaultProperties')} >
                        <BookUploadForm t={t} libraryId={libraryId} />
                    </Card>
                    <Row style={{ paddingTop: 16, paddingBottom: 16 }}>

                    </Row>
                    <Row>
                        <Col span={24}>
                            <Form.List name="books">
                                {(fields, { add, remove }) => (
                                    <>
                                        <Form.Item key='form-uploader'>
                                            <Dragger {...props}
                                                style={{ padding: 16, display: 'block' }}
                                                onChange={({ file }) => {
                                                    if (file.type !== "application/pdf") {
                                                        message.error(t("errors.imageRequired"));
                                                        return;
                                                    }
                                                    return add({ title: trimExtension(file.name), file });
                                                }}>
                                                <p className="ant-upload-drag-icon">
                                                    <FaFileUpload />
                                                </p>
                                                <p className="ant-upload-text">{t('books.actions.upload.message')}</p>
                                            </Dragger>
                                        </Form.Item>
                                        {fields.map(({ key, name, ...restField }) => (
                                            <Card key={key} title={form.getFieldValue(["books", name, "file"])?.name} extra={<Button type='text' icon={<FaTrash />} onClick={() => remove(name)} />} >
                                                <Row gutter={16} >
                                                    <Col span={8}>
                                                        <Form.Item
                                                            {...restField}
                                                            name={[name, 'title']}
                                                            label={t("book.title.label")}
                                                            rules={[{ required: true, message: t("book.title.required") }]}>
                                                            <Input placeholder={t("book.title.placeholder")} />
                                                        </Form.Item>
                                                        <Form.Item
                                                            {...restField}
                                                            name={[name, 'language']}
                                                            label={t("book.language.label")}>
                                                            <LanguageSelect placeholder={t("book.language.placeholder")} />
                                                        </Form.Item>
                                                        <Form.Item  {...restField} name={[name, "copyrights"]} label={t("book.copyrights.label")}>
                                                            <CopyrightSelect t={t} />
                                                        </Form.Item>
                                                        <Form.Item  {...restField} name={[name, "isPublic"]} valuePropName="checked" label={t("book.public.label")}>
                                                            <Switch />
                                                        </Form.Item>
                                                    </Col>
                                                    <Col span={8}>
                                                        <Form.Item
                                                            {...restField}
                                                            name={[name, "authors"]}
                                                            label={t("book.authors.label")} >
                                                            <AuthorsSelect placeholder={t("book.authors.placeholder")} t={t} libraryId={libraryId} />
                                                        </Form.Item>
                                                        <Form.Item  {...restField} name={[name, "yearPublished"]} label={t("book.yearPublished.label")}>
                                                            <InputNumber min={1} max={new Date().getFullYear()} />
                                                        </Form.Item>
                                                        <Form.Item  {...restField} name={[name, "status"]} label={t("book.status.label")} placeholder={t("book.status.placeholder")}>
                                                            <PublishStatusSelect t={t} />
                                                        </Form.Item>
                                                    </Col>
                                                    <Col span={8}>
                                                        <Form.Item  {...restField} name={[name, "categories"]} label={t("book.categories.label")}>
                                                            <CategoriesSelect libraryId={libraryId} placeholder={t("book.categories.placeholder")} />
                                                        </Form.Item>
                                                        <Form.Item  {...restField} name={[name, "publisher"]} label={t("book.publisher.label")}>
                                                            <Input placeholder={t("book.publisher.placeholder")} />
                                                        </Form.Item>
                                                        <Form.Item  {...restField} name={[name, "seriesId"]} label={t("book.series.label")}>
                                                            <SeriesSelect placeholder={t("book.series.placeholder")} t={t} libraryId={libraryId} />
                                                        </Form.Item>
                                                    </Col>
                                                </Row >
                                            </Card>
                                        ))}
                                    </>
                                )
                                }
                            </Form.List >
                        </Col>
                    </Row>
                </Spin>
            </ContentsContainer >
        </Form>
    );
};

export default BooksUpload;
