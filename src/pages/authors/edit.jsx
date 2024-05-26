import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate, useParams } from "react-router-dom";

// 3rd party libraries

import { Button, Col, Form, Input, Row, App, Space, Spin, Select, Upload } from "antd";
import { FaFeatherAlt } from "/src/icons";
import ImgCrop from "antd-img-crop";

// Local imports
import { useGetAuthorByIdQuery, useAddAuthorMutation, useUpdateAuthorMutation, useUpdateAuthorImageMutation } from "/src/store/slices/authorsSlice";
import ContentsContainer from "/src/components/layout/contentContainer";
import PageHeader from "/src/components/layout/pageHeader";
import Error from "/src/components/common/error";
import Loading from "/src/components/common/loader";
import { authorPlaceholderImage, setDefaultBookImage } from "/src/util";

// ----------------------------------------------
const { Dragger } = Upload;
// ----------------------------------------------

const formItemLayout = { labelCol: { span: 4 }, wrapperCol: { span: 14 } };
const buttonItemLayout = { wrapperCol: { span: 14, offset: 4 } };

const AuthorEditPage = () => {
    const { message } = App.useApp();
    const navigate = useNavigate();
    const { t } = useTranslation();
    const { libraryId, authorId } = useParams();
    const [addAuthor, { isLoading: isAdding }] = useAddAuthorMutation();
    const [updateAuthor, { isLoading: isUpdating }] = useUpdateAuthorMutation();
    const [updateAuthorImage, { isLoading: isUpdatingImage }] = useUpdateAuthorImageMutation();
    const { data: author, error, isFetching } = useGetAuthorByIdQuery({ libraryId, authorId }, { skip: !libraryId || !authorId });
    const [previewImage, setPreviewImage] = useState(null);
    const [fileList, setFileList] = useState([]);

    if (isFetching) return <Loading />;
    if (error) return <Error t={t} />;

    const onSubmit = async (author) => {
        if (authorId) {
            updateAuthor({ libraryId, authorId, payload: author })
                .unwrap()
                .then(() => uploadImage(authorId))
                .then(() => navigate(`/libraries/${libraryId}/authors/${authorId}`))
                .then(() => message.success(t("author.actions.edit.success")))
                .catch(() => message.error(t("author.actions.edit.error")));
        } else {
            let response = null;
            addAuthor({ libraryId, payload: author })
                .unwrap()
                .then((r) => (response = r))
                .then(() => uploadImage(response.id))
                .then(() => navigate(`/libraries/${libraryId}/authors/${response.id}`))
                .then(() => message.success(t("author.actions.add.success")))
                .catch(() => message.error(t("author.actions.add.error")));
        }
    };

    const uploadImage = async (newAuthorId) => {
        if (fileList && fileList.length > 0) {
            await updateAuthorImage({ libraryId, authorId: newAuthorId, payload: fileList[0] }).unwrap();
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
        } else if (author && author.links.image) {
            return author.links.image;
        }

        return authorPlaceholderImage;
    };
    const title = author ? author.name : t("author.actions.add.label");

    return (
        <>
            <PageHeader title={title} icon={<FaFeatherAlt style={{ width: 36, height: 36 }} />} />
            <ContentsContainer>
                <Row gutter={16}>
                    <Col l={4} md={6} xs={24}>
                        <ImgCrop modalTitle={t("actions.resizeImage")}>
                            <Dragger fileList={fileList} beforeUpload={onImageChange} showUploadList={false}>
                                <img src={getCoverSrc()} height="300" alt={author && author.name} onError={setDefaultBookImage} />
                            </Dragger>
                        </ImgCrop>
                    </Col>
                    <Col l={20} md={18} xs={24}>
                        <Spin spinning={isFetching || isAdding || isUpdating || isUpdatingImage}>
                            <Form name="login" onFinish={onSubmit} {...formItemLayout} layout="horizontal" initialValues={author}>
                                <Form.Item
                                    name="name"
                                    label={t("author.name.label")}
                                    rules={[
                                        {
                                            required: true,
                                            message: t("author.name.required"),
                                        },
                                    ]}
                                >
                                    <Input placeholder={t("author.name.placeholder")} />
                                </Form.Item>
                                <Form.Item name="description" label={t("author.description.label")}>
                                    <Input.TextArea rows={4} />
                                </Form.Item>
                                <Form.Item
                                    name="authorType"
                                    label={t("author.type.label")}
                                    rules={[
                                        {
                                            required: true,
                                            message: t("author.type.required"),
                                        },
                                    ]}
                                >
                                    <Select placeholder={t("author.type.placeholder")}>
                                        <Select.Option value="Writer">{t("author.type.writer")}</Select.Option>
                                        <Select.Option value="Poet">{t("author.type.poet")}</Select.Option>
                                    </Select>
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

export default AuthorEditPage;
