import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { Link, useNavigate, useParams } from "react-router-dom";

// 3rd party libraries
import moment from "moment/moment";
import { Button, Col, Form, InputNumber, Row, App, Space, Spin, Upload, Breadcrumb } from "antd";
import { FaHome, FiLayers, ImNewspaper, FaEdit, FaFileImage } from "/src/icons";
import ImgCrop from "antd-img-crop";

// Local imports
import {
    useGetIssueQuery,
    useAddIssueMutation,
    useUpdateIssueMutation,
    useUpdateIssueImageMutation
} from "/src/store/slices/issuesSlice";
import { useGetPeriodicalByIdQuery } from "/src/store/slices/periodicalsSlice";
import { issuePlaceholderImage, setDefaultIssueImage, getDateFormatFromFrequency } from "/src/util";
import ContentsContainer from "/src/components/layout/contentContainer";
import PageHeader from "/src/components/layout/pageHeader";
import Error from "/src/components/common/error";
import Loading from "/src/components/common/loader";
import DateInput from "/src/components/dateInput";
import PublishStatusSelect from "/src/components/publishStatusSelect";

// ----------------------------------------------
const { Dragger } = Upload;
// ----------------------------------------------

const formItemLayout = { labelCol: { span: 4 }, wrapperCol: { span: 14 } };
const buttonItemLayout = { wrapperCol: { span: 14, offset: 4 } };

const IssueEditPage = () => {
    const { message } = App.useApp();
    const navigate = useNavigate();
    const { t } = useTranslation();
    const { libraryId, periodicalId, volumeNumber, issueNumber } = useParams();
    const [addIssue, { isLoading: isAdding }] = useAddIssueMutation();
    const [updateIssue, { isLoading: isUpdating }] = useUpdateIssueMutation();
    const [updateIssueImage, { isLoading: isUpdatingImage }] = useUpdateIssueImageMutation();
    const { data: issue, error, isFetching } = useGetIssueQuery({ libraryId, periodicalId, volumeNumber, issueNumber }, { skip: !libraryId || !periodicalId || !volumeNumber || !issueNumber });
    const { data: periodical, error: periodicalError, isFetching: isFetchingPeriodical } = useGetPeriodicalByIdQuery({ libraryId, periodicalId }, { skip: !libraryId || !periodicalId || volumeNumber & issueNumber });
    const [previewImage, setPreviewImage] = useState(null);
    const [fileList, setFileList] = useState([]);

    if (isFetching || isFetchingPeriodical) return <Loading />;
    if (error || periodicalError) return <Error t={t} />;

    const onSubmit = async (issue) => {
        let response = null;
        if (issue) {
            updateIssue({ libraryId, periodicalId, volumeNumber: issue.volumeNumber, issueNumber: issue.issueNumber, payload: issue })
                .unwrap()
                .then((r) => (response = r))
                .then(() => uploadImage(response))
                .then(() => navigate(`/libraries/${libraryId}/periodicals/${periodicalId}/volumes/${issue.volumeNumber}/issues/${issue.issueNumber}`))
                .then(() => message.success(t("issue.actions.edit.success")))
                .catch((e) => {
                    console.log(e);
                    message.error(t("issue.actions.edit.error"))
                });
        } else {
            addIssue({ libraryId, periodicalId, volumeNumber: issue.volumeNumber, issueNumber: issue.issueNumber, payload: issue })
                .unwrap()
                .then((r) => (response = r))
                .then(() => uploadImage(response))
                .then(() => navigate(`/libraries/${libraryId}/periodicals/${periodicalId}/issues/${response.id}`))
                .then(() => message.success(t("issue.actions.add.success")))
                .catch((e) => {
                    console.log(e);
                    message.error(t("issue.actions.add.error"))
                });
        }
    };

    const uploadImage = async (savedIssue) => {
        if (fileList && fileList.length > 0) {
            await updateIssueImage({ issue: savedIssue, payload: fileList[0] }).unwrap();
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
        } else if (issue && issue.links.image) {
            return issue.links.image;
        }

        return issuePlaceholderImage;
    };
    const title = issue ? moment(issue.issueDate).format(getDateFormatFromFrequency(issue.frequency)) : t("issue.actions.add.label");

    return (
        <>
            <PageHeader title={title} icon={<FiLayers style={{ width: 36, height: 36 }} />}
                breadcrumb={<Breadcrumb
                    items={[
                        {
                            title: <Link to={`/libraries/${libraryId}`}><FaHome /></Link>,
                        },
                        {
                            title: <Link to={`/libraries/${libraryId}/periodicals`}><Space><ImNewspaper />{t("header.periodicals")}</Space></Link>,
                        },
                        {
                            title: <Link to={`/libraries/${libraryId}/periodicals/${periodicalId}/volumes/${volumeNumber}`}><Space><ImNewspaper />{t("issue.volumeNumber.label")} {volumeNumber}</Space></Link>,
                        },
                        {
                            title: <Link to={`/libraries/${libraryId}/periodicals/${periodicalId}/volumes/${volumeNumber}/issues/${issueNumber}`}><Space><ImNewspaper />{t("issue.issueNumber.label")} {issueNumber}</Space></Link>,
                        }
                        ,
                        {
                            title: issue ? <Space><FaEdit />{t("actions.edit")}</Space> : <Space><FaFileImage />{t("actions.")}</Space>,
                        }
                    ]} />} />
            <ContentsContainer>
                <Row gutter={16}>
                    <Col l={4} md={6} xs={24}>
                        <ImgCrop aspect={262 / 400} rotationSlider modalTitle={t("actions.resizeImage")}>
                            <Dragger fileList={fileList} beforeUpload={onImageChange} showUploadList={false}>
                                <img src={getCoverSrc()} height="300" alt={issue && issue.name} onError={setDefaultIssueImage} />
                            </Dragger>
                        </ImgCrop>
                    </Col>
                    <Col l={20} md={18} xs={24}>
                        <Spin spinning={isFetching || isFetchingPeriodical || isAdding || isUpdating || isUpdatingImage}>
                            <Form name="login" onFinish={onSubmit} {...formItemLayout} layout="horizontal" initialValues={issue}>
                                <Form.Item
                                    name="volumeNumber"
                                    label={t("issue.volumeNumber.label")}
                                    rules={[
                                        {
                                            required: true,
                                            message: t("issue.volumeNumber.required"),
                                        },
                                    ]}
                                >
                                    <InputNumber placeholder={t("issue.volumeNumber.placeholder")} />
                                </Form.Item>
                                <Form.Item
                                    name="issueNumber"
                                    label={t("issue.issueNumber.label")}
                                    rules={[
                                        {
                                            required: true,
                                            message: t("issue.issueNumber.required"),
                                        },
                                    ]}
                                >
                                    <InputNumber />
                                </Form.Item>
                                <Form.Item
                                    name="issueDate"
                                    label={t("issue.issueDate.label")}
                                    rules={[
                                        {
                                            required: true,
                                            message: t("issue.issueDate.required"),
                                        },
                                    ]}
                                >
                                    <DateInput frequency={volumeNumber & issueNumber ? issue?.frequency : periodical?.frequency} allowFutureValues={false} />
                                </Form.Item>
                                <Form.Item name="status" label={t("issue.status.label")} placeholder={t("issue.status.placeholder")}>
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
                        </Spin>
                    </Col>
                </Row>
            </ContentsContainer>
        </>
    );
};

export default IssueEditPage;
