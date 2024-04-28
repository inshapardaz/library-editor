import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate, useParams } from "react-router-dom";

// 3rd party libraries

import { Button, Col, Form, Input, Row, App, Space, Spin, Select, Upload, Switch } from "antd";
import { FaPenFancy } from "react-icons/fa";
import ImgCrop from "antd-img-crop";

// Local imports
import {
    useGetArticleQuery,
    useAddArticleMutation,
    useUpdateArticleMutation,
    useUpdateArticleImageMutation
} from "~/src/store/slices/articlesSlice";
import { articlePlaceholderImage, setDefaultBookImage } from "~/src/util";
import ContentsContainer from "~/src/components/layout/contentContainer";
import PageHeader from "~/src/components/layout/pageHeader";
import Error from "~/src/components/common/error";
import Loading from "~/src/components/common/loader";
import AuthorsSelect from "~/src/components/author/authorsSelect";
import CategoriesSelect from "~/src/components/categories/categoriesSelect";
import EditingStatusSelect from "~/src/components/editingStatusSelect";

// ----------------------------------------------
const { Dragger } = Upload;
const formItemLayout = { labelCol: { span: 4 }, wrapperCol: { span: 14 } };
const buttonItemLayout = { wrapperCol: { span: 14, offset: 4 } };
// ----------------------------------------------

const ArticleEditPage = () => {
    const { message } = App.useApp();
    const navigate = useNavigate();
    const { t } = useTranslation();
    const { libraryId, articleId } = useParams();
    const [addArticle, { isLoading: isAdding }] = useAddArticleMutation();
    const [updateArticle, { isLoading: isUpdating }] = useUpdateArticleMutation();
    const [updateArticleImage, { isLoading: isUpdatingImage }] = useUpdateArticleImageMutation();
    const { data: article, error, isFetching } = useGetArticleQuery({ libraryId, articleId }, { skip: !libraryId || !articleId });
    const [previewImage, setPreviewImage] = useState(null);
    const [fileList, setFileList] = useState([]);

    if (isFetching) return <Loading />;
    if (error) return <Error t={t} />;

    const onSubmit = async (article) => {
        if (articleId) {
            updateArticle({ libraryId, articleId, payload: article })
                .unwrap()
                .then(() => uploadImage(articleId))
                .then(() => navigate(`/libraries/${libraryId}/articles/${articleId}`))
                .then(() => message.success(t("article.actions.edit.success")))
                .catch(() => message.error(t("article.actions.edit.error")));
        } else {
            let response = null;
            addArticle({ libraryId, payload: article })
                .unwrap()
                .then((r) => (response = r))
                .then(() => uploadImage(response.id))
                .then(() => navigate(`/libraries/${libraryId}/articles/${response.id}`))
                .then(() => message.success(t("article.actions.add.success")))
                .catch(() => message.error(t("article.actions.add.error")));
        }
    };

    const uploadImage = async (newArticleId) => {
        if (fileList && fileList.length > 0) {
            await updateArticleImage({ libraryId, articleId: newArticleId, payload: fileList[0] }).unwrap();
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
        } else if (article && article.links.image) {
            return article.links.image;
        }

        return articlePlaceholderImage;
    };

    const title = article ? article.title : t("article.actions.add.label");

    return (
        <>
            <PageHeader title={title}
                icon={<FaPenFancy style={{ width: 36, height: 36 }} />}
            />
            <ContentsContainer>
                <Row gutter={16}>
                    <Col l={4} md={6} xs={24}>
                        <ImgCrop modalTitle={t("actions.resizeImage")}>
                            <Dragger fileList={fileList} beforeUpload={onImageChange} showUploadList={false}>
                                <img src={getCoverSrc()} height="300" alt={article && article.name} onError={setDefaultBookImage} />
                            </Dragger>
                        </ImgCrop>
                    </Col>
                    <Col l={20} md={18} xs={24}>
                        <Spin spinning={isFetching || isAdding || isUpdating || isUpdatingImage}>
                            <Form name="article" onFinish={onSubmit} {...formItemLayout} layout="horizontal" initialValues={article}>
                                <Form.Item
                                    name="title"
                                    label={t("article.title.label")}
                                    rules={[
                                        {
                                            required: true,
                                            message: t("article.title.required"),
                                        },
                                    ]}
                                >
                                    <Input placeholder={t("article.title.placeholder")} />
                                </Form.Item>
                                <Form.Item
                                    name="type"
                                    label={t("article.type.label")}
                                    rules={[
                                        {
                                            required: true,
                                            message: t("article.type.required"),
                                        },
                                    ]}
                                >
                                    <Select placeholder={t("article.type.placeholder")}>
                                        <Select.Option value="Writing">{t("article.type.writing")}</Select.Option>
                                        <Select.Option value="Poetry">{t("article.type.poetry")}</Select.Option>
                                    </Select>
                                </Form.Item>
                                <Form.Item name="isPublic" valuePropName="checked" label={t("article.public.label")}>
                                    <Switch />
                                </Form.Item>
                                <Form.Item
                                    name="authors"
                                    label={t("article.authors.label")}
                                    rules={[
                                        {
                                            required: true,
                                            message: t("article.authors.required"),
                                        },
                                    ]}
                                >
                                    <AuthorsSelect placeholder={t("article.authors.placeholder")} t={t} libraryId={libraryId} />
                                </Form.Item>
                                <Form.Item name="categories" label={t("article.categories.label")}>
                                    <CategoriesSelect libraryId={libraryId} placeholder={t("article.categories.placeholder")} />
                                </Form.Item>
                                <Form.Item
                                    name="status"
                                    label={t("article.status.label")}
                                    rules={[
                                        {
                                            required: true,
                                            message: t("article.status.required"),
                                        },
                                    ]}
                                >
                                    <EditingStatusSelect t={t} />
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
                        </Spin>
                    </Col>
                </Row>
            </ContentsContainer>
        </>
    );
};

export default ArticleEditPage;
