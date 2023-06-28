import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate, useParams } from "react-router-dom";

// 3rd party libraries

import { Button, Col, Form, Input, InputNumber, Row, App, Space, Spin, Switch, Upload } from "antd";
import { ImBooks } from "react-icons/im";
import ImgCrop from "antd-img-crop";

// Local imports
import { useGetBookQuery, useAddBookMutation, useUpdateBookMutation, useUpdateBookImageMutation } from "../../features/api/booksSlice";
import ContentsContainer from "../../components/layout/contentContainer";
import PageHeader from "../../components/layout/pageHeader";
import Error from "../../components/common/error";
import Loading from "../../components/common/loader";
import AuthorsSelect from "../../components/author/authorsSelect";
import SeriesSelect from "../../components/series/seriesSelect";
import CategoriesSelect from "../../components/categories/categoriesSelect";
import LanguageSelect from "../../components/languageSelect";
import CopyrightSelect from "../../components/copyrightSelect";
import PublishStatusSelect from "../../components/publishStatusSelect";
import helpers from "../../helpers";

// ----------------------------------------------
const { Dragger } = Upload;
// ----------------------------------------------

const formItemLayout = { labelCol: { span: 4 }, wrapperCol: { span: 14 } };
const buttonItemLayout = { wrapperCol: { span: 14, offset: 4 } };

const BookEditPage = () => {
    const { message } = App.useApp();
    const navigate = useNavigate();
    const { t } = useTranslation();
    const { libraryId, bookId } = useParams();
    const [addBook, { isLoading: isAdding }] = useAddBookMutation();
    const [updateBook, { isLoading: isUpdating }] = useUpdateBookMutation();
    const [updateBookImage, { isLoading: isUpdatingImage }] = useUpdateBookImageMutation();

    const { data: book, error, isFetching } = useGetBookQuery({ libraryId, bookId }, { skip: !libraryId || !bookId });
    const [previewImage, setPreviewImage] = useState(null);
    const [fileList, setFileList] = useState([]);

    if (isFetching) return <Loading />;
    if (error) return <Error />;

    const onSubmit = async (book) => {
        if (bookId) {
            updateBook({ libraryId, bookId, payload: book })
                .unwrap()
                .then(() => uploadImage(bookId))
                .then(() => navigate(`/libraries/${libraryId}/books/${bookId}`))
                .then(() => message.success(t("book.save.success")))
                .catch((_) => message.error(t("book.save.error")));
        } else {
            let response = null;
            addBook({ libraryId, payload: book })
                .unwrap()
                .then((r) => (response = r))
                .then(() => uploadImage(response.id))
                .then(() => navigate(`/libraries/${libraryId}/books/${response.id}`))
                .then(() => message.success(t("book.save.success")))
                .catch((_) => message.error(t("book.save.error")));
        }
    };

    const uploadImage = async (newBookId) => {
        console.log(newBookId);
        if (fileList && fileList.length > 0) {
            await updateBookImage({ libraryId, bookId: newBookId, payload: fileList[0] }).unwrap();
        }
    };

    const onImageChange = (file) => {
        const isImage = ["image/png", "image/jpeg"].includes(file.type);
        if (!isImage) {
            message.error(t("errors.imageRequired"));
            return;
        }
        setFileList([file]);
        const fileReader = new FileReader();
        fileReader.addEventListener("load", () => {
            setPreviewImage(fileReader.result);
        });
        fileReader.readAsDataURL(file);
        return false;
    };

    const getCoverSrc = () => {
        if (previewImage) {
            return previewImage;
        } else if (book && book.links.image) {
            return book.links.image;
        }

        return helpers.defaultBookImage;
    };

    const title = book ? book.title : t("books.actions.add");
    return (
        <>
            <PageHeader title={title} icon={<ImBooks style={{ width: 36, height: 36 }} />} />
            <ContentsContainer>
                <Spin spinning={isFetching || isAdding || isUpdating || isUpdatingImage}>
                    <Row gutter={16}>
                        <Col l={4} md={6} xs={24}>
                            <Col l={4} md={6} xs={24}>
                                <ImgCrop aspect={262 / 400} rotationSlider modalTitle={t("actions.resizeImage")}>
                                    <Dragger fileList={fileList} beforeUpload={onImageChange} showUploadList={false}>
                                        <img src={getCoverSrc()} height="300" className="ant-upload-drag-icon" alt={book && book.title} onError={helpers.setDefaultBookImage} />
                                    </Dragger>
                                </ImgCrop>
                            </Col>
                        </Col>
                        <Col l={20} md={18} xs={24}>
                            <Form name="login" onFinish={onSubmit} {...formItemLayout} layout="horizontal" initialValues={book}>
                                <Form.Item
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
                                </Form.Item>
                                <Form.Item name="description" label={t("book.description.label")}>
                                    <Input.TextArea rows={4} />
                                </Form.Item>
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
                                    <AuthorsSelect placeholder={t("book.authors.placeholder")} libraryId={libraryId} />
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
                                <Form.Item label={t("book.series.label")}>
                                    <Space.Compact>
                                        <Form.Item name="seriesId" noStyle>
                                            <SeriesSelect placeholder={t("book.series.placeholder")} libraryId={libraryId} label={book && book.seriesName} />
                                        </Form.Item>
                                        <Form.Item name="seriesIndex" noStyle>
                                            <InputNumber min={1} style={{ width: "50%" }} />
                                        </Form.Item>
                                    </Space.Compact>
                                </Form.Item>
                                <Form.Item name="copyrights" label={t("book.copyrights.label")}>
                                    <CopyrightSelect t={t} />
                                </Form.Item>
                                <Form.Item name="status" label={t("book.status.label")} placeholder={t("book.status.placeholder")}>
                                    <PublishStatusSelect t={t} />
                                </Form.Item>

                                <Form.Item {...buttonItemLayout}>
                                    <Space direction="horizontal" size="middle" style={{ width: "100%" }}>
                                        <Button type="primary" htmlType="submit" size="large" block>
                                            {t("actions.save")}
                                        </Button>
                                        <Button size="large" onClick={() => navigate(-1)} block>
                                            {t("actions.cancel")}
                                        </Button>
                                    </Space>
                                </Form.Item>
                            </Form>
                        </Col>
                    </Row>
                </Spin>
            </ContentsContainer>
        </>
    );
};

export default BookEditPage;
