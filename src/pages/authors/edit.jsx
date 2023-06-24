import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate, useParams } from "react-router-dom";

// 3rd party libraries

import { Button, Col, Form, Input, Row, App, Space, Spin, Select, Upload } from "antd";
import { FaFeatherAlt } from "react-icons/fa";
import ImgCrop from "antd-img-crop";

// Local imports
import { useGetAuthorByIdQuery, useAddAuthorMutation, useUpdateAuthorMutation, useUpdateAuthorImageMutation } from "../../features/api/authorsSlice";
import ContentsContainer from "../../components/layout/contentContainer";
import PageHeader from "../../components/layout/pageHeader";
import Error from "../../components/common/error";
import Loading from "../../components/common/loader";
import helpers from "../../helpers";

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
    if (error) return <Error />;

    const onSubmit = async (author) => {
        if (authorId) {
            updateAuthor({ libraryId, authorId, payload: author })
                .unwrap()
                .then(() => uploadImage())
                .then(() => message.success(t("author.save.success")))
                .then(() => navigate(`/libraries/${libraryId}/authors/${authorId}`))
                .catch((_) => message.error(t("author.save.error")));
        } else {
            let response = null;
            addAuthor({ libraryId, payload: author })
                .unwrap()
                .then((r) => (response = r))
                .then(() => uploadImage())
                .then(() => message.success(t("author.save.success")))
                .then(() => navigate(`/libraries/${libraryId}/authors/${response.id}`))
                .catch((_) => message.error(t("author.save.error")));
            await uploadImage();
            message.success(t("author.save.success"));
            navigate(`/libraries/${libraryId}/authors/${response.id}`);
        }
    };

    const uploadImage = async () => {
        if (fileList && fileList.length > 0) {
            await updateAuthorImage({ libraryId, authorId, payload: fileList[0] }).unwrap();
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

        return helpers.defaultAuthorImage;
    };
    const title = author ? author.name : t("authors.actions.add");

    return (
        <>
            <PageHeader title={title} icon={<FaFeatherAlt style={{ width: 36, height: 36 }} />} />
            <ContentsContainer>
                <Row gutter={16}>
                    <Col l={4} md={6} xs={24}>
                        <ImgCrop rotationSlider modalTitle={t("actions.resizeImage")}>
                            <Dragger fileList={fileList} beforeUpload={onImageChange} showUploadList={false}>
                                <img src={getCoverSrc()} height="300" alt={author.name} />
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
