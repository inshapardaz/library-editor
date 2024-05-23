import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate, useParams } from "react-router-dom";

// 3rd party libraries

import { Button, Col, Form, Input, Row, App, Space, Spin, Upload } from "antd";
import { ImBooks } from "/src/icons";
import ImgCrop from "antd-img-crop";

// Local imports
import { useGetSeriesByIdQuery, useAddSeriesMutation, useUpdateSeriesMutation, useUpdateSeriesImageMutation } from "/src/store/slices/seriesSlice";
import { seriesPlaceholderImage, setDefaultSeriesImage } from "/src/util";
import ContentsContainer from "/src/components/layout/contentContainer";
import PageHeader from "/src/components/layout/pageHeader";
import Error from "/src/components/common/error";
import Loading from "/src/components/common/loader";

// ----------------------------------------------
const { Dragger } = Upload;
// ----------------------------------------------

const formItemLayout = { labelCol: { span: 4 }, wrapperCol: { span: 14 } };
const buttonItemLayout = { wrapperCol: { span: 14, offset: 4 } };

const SeriesEditPage = () => {
    const { message } = App.useApp();
    const navigate = useNavigate();
    const { t } = useTranslation();
    const { libraryId, seriesId } = useParams();
    const [addSeries, { isLoading: isAdding }] = useAddSeriesMutation();
    const [updateSeries, { isLoading: isUpdating }] = useUpdateSeriesMutation();
    const [updateSeriesImage, { isLoading: isUpdatingImage }] = useUpdateSeriesImageMutation();
    const { data: series, error, isFetching } = useGetSeriesByIdQuery({ libraryId, seriesId }, { skip: !libraryId || !seriesId });
    const [previewImage, setPreviewImage] = useState(null);
    const [fileList, setFileList] = useState([]);

    if (isFetching) return <Loading />;
    if (error) return <Error t={t} />;

    const onSubmit = async (series) => {
        if (seriesId) {
            updateSeries({ libraryId, seriesId, payload: series })
                .unwrap()
                .then(() => uploadImage(seriesId))
                .then(() => navigate(`/libraries/${libraryId}/series/${seriesId}`))
                .then(() => message.success(t("series.actions.edit.success")))
                .catch(() => message.error(t("series.actions.edit.error")));
        } else {
            let response = null;
            addSeries({ libraryId, payload: series })
                .unwrap()
                .then((r) => (response = r))
                .then(() => uploadImage(response.id))
                .then(() => navigate(`/libraries/${libraryId}/series/${response.id}`))
                .then(() => message.success(t("series.actions.add.success")))
                .catch(() => message.error(t("series.actions.add.error")));
        }
    };

    const uploadImage = async (newSeriesId) => {
        if (fileList && fileList.length > 0) {
            await updateSeriesImage({ libraryId, seriesId: newSeriesId, payload: fileList[0] }).unwrap();
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
        } else if (series && series.links.image) {
            return series.links.image;
        }

        return seriesPlaceholderImage;
    };
    const title = series ? series.name : t("series.actions.add.label");

    return (
        <>
            <PageHeader title={title} icon={<ImBooks style={{ width: 36, height: 36 }} />} />
            <ContentsContainer>
                <Row gutter={16}>
                    <Col l={4} md={6} xs={24}>
                        <ImgCrop modalTitle={t("actions.resizeImage")}>
                            <Dragger fileList={fileList} beforeUpload={onImageChange} showUploadList={false}>
                                <img src={getCoverSrc()} height="300" alt={series && series.name} onError={setDefaultSeriesImage} />
                            </Dragger>
                        </ImgCrop>
                    </Col>
                    <Col l={20} md={18} xs={24}>
                        <Spin spinning={isFetching || isAdding || isUpdating || isUpdatingImage}>
                            <Form name="login" onFinish={onSubmit} {...formItemLayout} layout="horizontal" initialValues={series}>
                                <Form.Item
                                    name="name"
                                    label={t("series.name.label")}
                                    rules={[
                                        {
                                            required: true,
                                            message: t("series.name.required"),
                                        },
                                    ]}
                                >
                                    <Input placeholder={t("series.name.placeholder")} />
                                </Form.Item>
                                <Form.Item name="description" label={t("series.description.label")}>
                                    <Input.TextArea rows={4} />
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

export default SeriesEditPage;
