import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate, useParams } from "react-router-dom";

// 3rd party libraries

import { Button, Col, Form, Input, Row, App, Space, Select, Spin, Upload } from "antd";
import { ImNewspaper } from "react-icons/im";
import ImgCrop from "antd-img-crop";

// Local imports
import {
    useGetPeriodicalByIdQuery,
    useAddPeriodicalMutation,
    useUpdatePeriodicalMutation,
    useUpdatePeriodicalImageMutation
} from "~/src/store/slices/periodicalsSlice";
import { periodicalPlaceholderImage, setDefaultPeriodicalImage } from "~/src/util";
import ContentsContainer from "~/src/components/layout/contentContainer";
import PageHeader from "~/src/components/layout/pageHeader";
import LanguageSelect from "~/src/components/languageSelect";
import CategoriesSelect from "~/src/components/categories/categoriesSelect";
import Error from "~/src/components/common/error";
import Loading from "~/src/components/common/loader";

// ----------------------------------------------
const { Dragger } = Upload;
// ----------------------------------------------

const formItemLayout = { labelCol: { span: 4 }, wrapperCol: { span: 14 } };
const buttonItemLayout = { wrapperCol: { span: 14, offset: 4 } };

const PeriodicalEditPage = () => {
    const { message } = App.useApp();
    const navigate = useNavigate();
    const { t } = useTranslation();
    const { libraryId, periodicalId } = useParams();
    const [addPeriodical, { isLoading: isAdding }] = useAddPeriodicalMutation();
    const [updatePeriodical, { isLoading: isUpdating }] = useUpdatePeriodicalMutation();
    const [updatePeriodicalImage, { isLoading: isUpdatingImage }] = useUpdatePeriodicalImageMutation();
    const { data: periodical, error, isFetching } = useGetPeriodicalByIdQuery({ libraryId, periodicalId }, { skip: !libraryId || !periodicalId });
    const [previewImage, setPreviewImage] = useState(null);
    const [fileList, setFileList] = useState([]);

    if (isFetching) return <Loading />;
    if (error) return <Error t={t} />;

    const onSubmit = async (periodical) => {
        if (periodicalId) {
            updatePeriodical({ libraryId, periodicalId, payload: periodical })
                .unwrap()
                .then(() => uploadImage(periodicalId))
                .then(() => navigate(`/libraries/${libraryId}/periodicals/${periodicalId}`))
                .then(() => message.success(t("periodical.actions.edit.success")))
                .catch(() => message.error(t("periodical.actions.edit.error")));
        } else {
            let response = null;
            addPeriodical({ libraryId, payload: periodical })
                .unwrap()
                .then((r) => (response = r))
                .then(() => uploadImage(response.id))
                .then(() => navigate(`/libraries/${libraryId}/periodicals/${response.id}`))
                .then(() => message.success(t("periodical.actions.add.success")))
                .catch(() => message.error(t("periodical.actions.add.error")));
        }
    };

    const uploadImage = async (newPeriodicalId) => {
        if (fileList && fileList.length > 0) {
            await updatePeriodicalImage({ libraryId, periodicalId: newPeriodicalId, payload: fileList[0] }).unwrap();
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
        } else if (periodical && periodical.links.image) {
            return periodical.links.image;
        }

        return periodicalPlaceholderImage;
    };
    const title = periodical ? periodical.title : t("periodical.actions.add.label");

    return (
        <>
            <PageHeader title={title} icon={<ImNewspaper style={{ width: 36, height: 36 }} />} />
            <ContentsContainer>
                <Row gutter={16}>
                    <Col l={4} md={6} xs={24}>
                        <ImgCrop modalTitle={t("actions.resizeImage")}>
                            <Dragger fileList={fileList} beforeUpload={onImageChange} showUploadList={false}>
                                <img src={getCoverSrc()} height="300" alt={periodical && periodical.title} onError={setDefaultPeriodicalImage} />
                            </Dragger>
                        </ImgCrop>
                    </Col>
                    <Col l={20} md={18} xs={24}>
                        <Spin spinning={isFetching || isAdding || isUpdating || isUpdatingImage}>
                            <Form name="login" onFinish={onSubmit} {...formItemLayout} layout="horizontal" initialValues={periodical}>
                                <Form.Item
                                    name="title"
                                    label={t("periodical.title.label")}
                                    rules={[
                                        {
                                            required: true,
                                            message: t("periodical.title.required"),
                                        },
                                    ]}
                                >
                                    <Input placeholder={t("periodical.title.placeholder")} />
                                </Form.Item>
                                <Form.Item name="description" label={t("periodical.description.label")}>
                                    <Input.TextArea rows={4} />
                                </Form.Item>
                                <Form.Item
                                    name="frequency"
                                    label={t("periodical.frequency.label")}
                                    rules={[
                                        {
                                            required: true,
                                            message: t("periodical.frequency.required"),
                                        },
                                    ]}
                                >
                                    <Select placeholder={t("periodical.frequency.placeholder")}>
                                        <Select.Option value="Annually">{t("periodical.frequency.annually")}</Select.Option>
                                        <Select.Option value="Quarterly">{t("periodical.frequency.quarterly")}</Select.Option>
                                        <Select.Option value="Monthly">{t("periodical.frequency.monthly")}</Select.Option>
                                        <Select.Option value="Fortnightly">{t("periodical.frequency.fortnightly")}</Select.Option>
                                        <Select.Option value="Weekly">{t("periodical.frequency.weekly")}</Select.Option>
                                        <Select.Option value="Daily">{t("periodical.frequency.daily")}</Select.Option>
                                    </Select>
                                </Form.Item>
                                <Form.Item
                                    name="language"
                                    label={t("periodical.language.label")}
                                    rules={[
                                        {
                                            required: true,
                                            message: t("periodical.language.required"),
                                        },
                                    ]}
                                >
                                    <LanguageSelect placeholder={t("periodical.language.placeholder")} />
                                </Form.Item>
                                <Form.Item name="categories" label={t("periodical.categories.label")}>
                                    <CategoriesSelect libraryId={libraryId} placeholder={t("periodical.categories.placeholder")} />
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

export default PeriodicalEditPage;
