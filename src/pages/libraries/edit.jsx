import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate, useParams } from "react-router-dom";

// 3rd party libraries

import { Button, Col, Form, Input, Row, App, Space, Spin, Upload, Switch, Select } from "antd";
import { FaFeatherAlt } from "react-icons/fa";
import ImgCrop from "antd-img-crop";

// Local imports
import { useGetLibraryQuery, useAddLibraryMutation, useUpdateLibraryMutation, useUpdateLibraryImageMutation } from "~/src/store/slices/librariesSlice";
import { libraryPlaceholderImage, setDefaultBookImage } from "~/src/util";
import ContentsContainer from "~/src/components/layout/contentContainer";
import PageHeader from "~/src/components/layout/pageHeader";
import LanguageSelect from "~/src/components/languageSelect";
import Error from "~/src/components/common/error";
import Loading from "~/src/components/common/loader";

// ----------------------------------------------
const { Dragger } = Upload;
// ----------------------------------------------

const formItemLayout = { labelCol: { span: 4 }, wrapperCol: { span: 14 } };
const buttonItemLayout = { wrapperCol: { span: 14, offset: 4 } };

const LibraryEditPage = () => {
    const { message } = App.useApp();
    const navigate = useNavigate();
    const { t } = useTranslation();
    const { libraryId } = useParams();
    const [addLibrary, { isLoading: isAdding }] = useAddLibraryMutation();
    const [updateLibrary, { isLoading: isUpdating }] = useUpdateLibraryMutation();
    const [updateLibraryImage, { isLoading: isUpdatingImage }] = useUpdateLibraryImageMutation();
    const { data: library, error, isFetching } = useGetLibraryQuery({ libraryId }, { skip: !libraryId });
    const [previewImage, setPreviewImage] = useState(null);
    const [fileList, setFileList] = useState([]);

    if (isFetching) return <Loading />;
    if (error) return <Error t={t} />;

    const onSubmit = async (library) => {
        if (libraryId) {
            updateLibrary({ library })
                .unwrap()
                .then((res) => library = res)
                .then(() => uploadImage(library))
                .then(() => navigate(`/libraries/${library.id}`))
                .then(() => message.success(t("library.actions.edit.success")))
                .catch(() => message.error(t("library.actions.edit.error")));
        } else {
            addLibrary({ library })
                .unwrap()
                .then((res) => library = res)
                .then(() => uploadImage(library))
                .then(() => navigate(`/libraries/${library.id}`))
                .then(() => message.success(t("library.actions.add.success")))
                .catch(() => message.error(t("library.actions.add.error")));
        }
    };

    const uploadImage = async (library) => {
        if (fileList && fileList.length > 0) {
            await updateLibraryImage({ library, payload: fileList[0] }).unwrap();
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
        } else if (library && library.links.image) {
            return library.links.image;
        }

        return libraryPlaceholderImage;
    };
    const title = library ? library.name : t("library.actions.add.label");

    return (
        <>
            <PageHeader title={title} icon={<FaFeatherAlt style={{ width: 36, height: 36 }} />} />
            <ContentsContainer>
                <Row gutter={16}>
                    <Col l={4} md={6} xs={24}>
                        <ImgCrop modalTitle={t("actions.resizeImage")}>
                            <Dragger fileList={fileList} beforeUpload={onImageChange} showUploadList={false}>
                                <img src={getCoverSrc()} height="300" alt={library && library.name} onError={setDefaultBookImage} />
                            </Dragger>
                        </ImgCrop>
                    </Col>
                    <Col l={20} md={18} xs={24}>
                        <Spin spinning={isFetching || isAdding || isUpdating || isUpdatingImage}>
                            <Form name="library" onFinish={onSubmit} {...formItemLayout} layout="horizontal" initialValues={library}>
                                <Form.Item
                                    name="ownerEmail"
                                    label={t("library.email.label")}
                                    rules={[
                                        {
                                            required: true,
                                            message: t("library.email.required"),
                                        },
                                        {
                                            type: 'email',
                                            message: t('library.email.error'),
                                        },
                                    ]}
                                >
                                    <Input placeholder={t("library.email.placeholder")} />
                                </Form.Item>
                                <Form.Item
                                    name="name"
                                    label={t("library.name.label")}
                                    rules={[
                                        {
                                            required: true,
                                            message: t("library.name.required"),
                                        },
                                    ]}
                                >
                                    <Input placeholder={t("library.name.placeholder")} />
                                </Form.Item>
                                <Form.Item name="description" label={t("library.description.label")}>
                                    <Input.TextArea rows={4} />
                                </Form.Item>
                                <Form.Item
                                    name="language"
                                    label={t("library.language.label")}
                                    rules={[
                                        {
                                            required: true,
                                            message: t("library.language.required"),
                                        },
                                    ]}
                                >
                                    <LanguageSelect placeholder={t("library.language.placeholder")} />
                                </Form.Item>
                                <Form.Item name="public" valuePropName="checked" label={t("library.isPublic.label")}>
                                    <Switch />
                                </Form.Item>
                                <Form.Item name="supportPeriodicals" valuePropName="checked" label={t("library.supportPeriodicals.label")}>
                                    <Switch />
                                </Form.Item>
                                <Form.Item
                                    name="fileStoreType"
                                    label={t("library.fileStoreType.label")}
                                    rules={[
                                        {
                                            required: true,
                                            message: t("library.fileStoreType.required"),
                                        },
                                    ]}
                                >
                                    <Select placeholder={t("library.fileStoreType.placeholder")}>
                                        <Select.Option value="Database">{t("library.fileStoreType.database")}</Select.Option>
                                        <Select.Option value="AzureBlobStorage">{t("library.fileStoreType.azurebolbstorage")}</Select.Option>
                                        <Select.Option value="S3Storage">{t("library.fileStoreType.s3storage")}</Select.Option>
                                        <Select.Option value="FileSystem">{t("library.fileStoreType.filesystem")}</Select.Option>
                                    </Select>
                                </Form.Item>
                                <Form.Item
                                    name="fileStoreSource"
                                    label={t("library.fileStoreSource.label")}
                                    rules={[
                                        {
                                            required: true,
                                            message: t("library.fileStoreSource.required"),
                                        },
                                    ]}
                                >
                                    <Input placeholder={t("library.fileStoreSource.placeholder")} />
                                </Form.Item>
                                <Form.Item
                                    name="databaseConnection"
                                    label={t("library.databaseConnection.label")}
                                >
                                    <Input placeholder={t("library.databaseConnection.placeholder")} />
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

export default LibraryEditPage;
