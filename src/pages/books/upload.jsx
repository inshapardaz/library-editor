import React, { useCallback, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Link, useParams, useNavigate } from 'react-router-dom';

// 3rd party libraries
import { FaCloudUploadAlt, FaFileUpload, FaHourglass, FaRedo, FaRegCheckCircle, FaRegTimesCircle, FaSave, FaTrash, FaUpload } from '/src/icons';
import { App, Avatar, Button, Card, Col, Form, Input, InputNumber, List, Popover, Row, Space, Spin, Switch, Tooltip, Upload } from 'antd';
import { LoadingOutlined } from '/src/icons';

// Local Imports
import { useGetLibraryQuery } from '/src/store/slices/librariesSlice';
import { useAddBookContentMutation, useAddBookMutation, useUpdateBookImageMutation } from '/src/store/slices/booksSlice';
import { readBinaryFile, loadPdfPage, dataURItoBlob } from '/src/util';
import { pdfjsLib } from '/src/util/pdf'
import PageHeader from '/src/components/layout/pageHeader';
import ContentsContainer from '/src/components/layout/contentContainer';
import AuthorsSelect from '/src/components/author/authorsSelect';
import CategoriesSelect from '/src/components/categories/categoriesSelect';
import LanguageSelect from '/src/components/languageSelect';
import PublishStatusSelect from '/src/components/publishStatusSelect';
import SeriesSelect from '/src/components/series/seriesSelect';
import CopyrightSelect from '/src/components/copyrightSelect';
import { ProcessStatus } from '/src/models';

//--------------------------------------------------------
const { Dragger } = Upload;
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

//------------------------------------------------------

const BookUploadStatus = ({ status, t, libraryId, requests, onRetry, key }) => {
    const navigate = useNavigate();

    const getIcon = (request) => {
        switch (request.status) {
            case ProcessStatus.Pending:
                return <FaHourglass />;
            case ProcessStatus.CreatingBook:
            case ProcessStatus.UploadingContents:
                return <FaFileUpload />
            case ProcessStatus.Completed:
                return <FaRegCheckCircle />;
            case ProcessStatus.Failed:
                return <FaRegTimesCircle style={{ color: 'red' }} />;
            default:
                return null;
        }
    }

    const getDescription = (request) => {
        switch (request.status) {
            case ProcessStatus.Completed:
                return t('books.actions.upload.details.status.completed');
            case ProcessStatus.Failed:
                return (<Popover
                    title={t('books.actions.upload.details.error.title')}
                    content={request.error.message}>
                    {t('books.actions.upload.details.status.failed')}
                </Popover >);
            case ProcessStatus.CreatingBook:
            case ProcessStatus.UploadingContents:
                return (<Space><Spin size="small" indicator={
                    <LoadingOutlined
                        style={{
                            fontSize: 24,
                        }}
                        spin
                    />
                } />{t('books.actions.upload.details.status.inProgress')}</Space>);
            case ProcessStatus.Pending:
                return t('books.actions.upload.details.status.pending');
            default:
                return null;
        }
    }

    const actions = () => {
        if (status === ProcessStatus.Completed) {
            return [<Button key="upload-more" type="text" icon={<FaUpload />}
                onClick={() => navigate(0)}>{t('books.actions.upload.details.uploadMore')}</Button>]
        } else if (status === ProcessStatus.Failed) {
            return [(<Tooltip key="retry-all" title={t('books.actions.upload.details.retryAllFailed')}>
                <Button type="text" icon={<FaRedo />} onClick={() => {
                    onRetry(requests.filter(r => r.status === ProcessStatus.Failed));
                }} />
            </Tooltip>),
            (<Tooltip key="upload-more" title={t('books.actions.upload.details.uploadMore')}>
                <Button type="text" icon={<FaUpload />}
                    onClick={() => navigate(0)} />
            </Tooltip>)]
        }

        return [];
    }

    return <Card title={t('books.actions.upload.title')} extra={actions()} key={key}>
        <List dataSource={requests}
            renderItem={request => (
                <List.Item key={request.id} extra={request.status === ProcessStatus.Failed ?
                    [<Tooltip key={`${request.id}-retry`} title={t('actions.retry')}>
                        <Button icon={<FaRedo size={16} />} onClick={() => onRetry([request])} />
                    </Tooltip>]
                    : null} >
                    <List.Item.Meta
                        avatar={<Avatar size={32} icon={getIcon(request)} />}
                        title={request.status === ProcessStatus.Completed ? (<Link to={`/libraries/${libraryId}/books/${request.newBook.id}`} target="_blank">
                            {request.book.title}</Link>) : request.book.title}
                        description={getDescription(request)} />
                </List.Item>)} />
    </Card>
}

//--------------------------------------------------------
const BooksUpload = () => {
    const { t } = useTranslation();
    const { message } = App.useApp();
    const { libraryId } = useParams();
    const { library, isFetching } = useGetLibraryQuery({ libraryId }, { skip: libraryId === null })
    const [addBook, { isLoading: isAdding }] = useAddBookMutation();
    const [addBookContent] = useAddBookContentMutation();
    const [updateBookImage] = useUpdateBookImageMutation();
    const [saving, setSaving] = useState(false);
    const [status, setStatus] = useState("");
    const [requests, setRequests] = useState([]);
    const initialValue = {
        isPublic: false,
        language: library?.language ?? 'en',
        books: []
    };

    const [form] = Form.useForm();

    const props = {
        name: 'file',
        maxCount: 30,
        multiple: true,
        itemRender: () => null,
        beforeUpload: () => false
    };

    const updateRequest = useCallback(({ id, status, newBook, newContent, error }) => {
        let newRequests = [...requests];
        let index = newRequests.findIndex(x => x.id === id);
        if (index === -1) return;

        if (status) {
            newRequests[index].status = status;
        }

        if (newBook) {
            newRequests[index].newBook = newBook;
        }

        if (newContent) {
            newRequests[index].newContent = newContent;
        }

        if (error) {
            newRequests[index].error = error;
        }

        setRequests(newRequests);
    }, [requests]);

    const saveBook = useCallback(async (request) => {
        try {
            updateRequest({ id: request.id, status: ProcessStatus.CreatingBook })

            if (!request.newBook) {
                const newBook = await addBook({ libraryId, payload: request.book }).unwrap();

                const pdfFile = await readBinaryFile(request.file)
                const pdf = await pdfjsLib.getDocument({ data: pdfFile }).promise;
                const img = await loadPdfPage(pdf, 1);
                await updateBookImage({ libraryId, bookId: newBook.id, payload: dataURItoBlob(img) }).unwrap();
                request.newBook = newBook;
                updateRequest({ id: request.id, newBook: request.newBook });
            }

            if (!request.newContent) {
                updateRequest({ id: request.id, status: ProcessStatus.UploadingContents });
                const newContent = await addBookContent({ book: request.newBook, payload: request.file }).unwrap();
                updateRequest({ id: request.id, status: ProcessStatus.Completed, newContent: newContent });
            }

        }
        catch (e) {
            updateRequest({ id: request.id, status: ProcessStatus.Failed, error: e });
            throw e;
        }
    }, [addBook, addBookContent, libraryId, updateBookImage, updateRequest]);

    var onRetry = useCallback(async (retryRequests) => {
        let success = true;
        for (var i = 0; i < retryRequests.length; i++) {
            try {
                const request = retryRequests[i];
                updateRequest({ id: request.id, status: ProcessStatus.Pending })
                await saveBook(request);
            }
            catch (e) {
                console.error(e);
                success = false;
            }
        }

        if (success) {
            setStatus(ProcessStatus.Completed);
            message.success(t("books.actions.upload.success"));
        } else {
            setStatus(ProcessStatus.Failed);
            message.error(t("books.actions.upload.error"))
        }
    }, [message, saveBook, t, updateRequest]);

    var saveBooks = useCallback(async () => {
        setSaving(true);
        setStatus(ProcessStatus.InProcess);

        let success = true;
        for (var i = 0; i < requests.length; i++) {
            let request = requests[i];
            try {
                updateRequest({ id: request.id, status: ProcessStatus.Pending })
                await saveBook(request);
            }
            catch (e) {
                console.error(e);
                success = false;
                updateRequest({ id: request.id, status: ProcessStatus.Failed, error: e });
            }
        }
        setSaving(false)
        if (success) {
            setStatus(ProcessStatus.Completed);
            message.success(t("books.actions.upload.success"));
        } else {
            setStatus(ProcessStatus.Failed);
            message.error(t("books.actions.upload.error"))
        }
    }, [message, requests, saveBook, t, updateRequest]);

    useEffect(() => {
        if (status === ProcessStatus.Pending && requests.length > 0) {
            saveBooks();
        }
    }, [status, requests, saveBooks]);

    const onFinished = (values) => {
        const books = values.books;
        setRequests(books.map((book) => ({
            id: book.file.uid,
            book: {
                title: book.title,
                libraryId: libraryId,
                isPublic: values.isPublic,
                language: values.language,
                authors: book.authors ?? values.authors?.map(a => ({ id: a.id })),
                categories: values.categories?.map(c => ({ id: c.id })),
                yearPublished: values.yearPublished,
                publisher: values.publisher,
                copyrights: values.copyright,
                seriesId: values.seriesId,
                seriesIndex: book.seriesIndex,
                source: values.source,
                status: values.status
            },
            file: book.file,
            status: ProcessStatus.Pending
        })));
        setStatus(ProcessStatus.Pending);
    }

    const hasUploadCompleted = useCallback(() => status === ProcessStatus.Completed || status === ProcessStatus.Failed, [status]);

    const actions = hasUploadCompleted() ? null : [
        (<Button key="save-button" type="primary" htmlType="submit" size="large" block icon={<FaSave />}
            disabled={isFetching | isAdding | saving}>
            {t("actions.save")}
        </Button>)
    ];

    const renderContents = () => {
        if (saving || hasUploadCompleted()) {
            return <BookUploadStatus t={t} status={status} requests={requests} libraryId={libraryId} onRetry={onRetry} />
        }
        else {
            return (<Spin spinning={isFetching | isAdding | saving}>
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
                                                return add({ id: file.id, title: trimExtension(file.name), file });
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
                                                    <Form.Item {...restField} label={t("book.series.label")}>
                                                        <Space.Compact style={{ width: "100%" }}>
                                                            <Form.Item name={[name, "seriesId"]} noStyle>
                                                                <SeriesSelect placeholder={t("book.series.placeholder")} t={t} libraryId={libraryId} />
                                                            </Form.Item>
                                                            <Form.Item name={[name, "seriesIndex"]} noStyle>
                                                                <InputNumber min={1} />
                                                            </Form.Item>
                                                        </Space.Compact>
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
            </Spin>);
        }
    }

    return (
        <Form name="bookUpload" size="middle" initialValues={initialValue} onFinish={onFinished} form={form}>
            <PageHeader
                title={t("books.actions.upload.title")}
                icon={<FaCloudUploadAlt style={{ width: 36, height: 36 }} />}
                actions={actions}
            />
            <ContentsContainer>
                {renderContents()}
            </ContentsContainer>
        </Form>
    );
};

export default BooksUpload;
