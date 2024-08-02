import React from "react";

// Third party libraries
import { Form, Space, Typography } from "antd";

// Local imports
import { EditOutlined, FileDoneOutlined, FaUserAlt } from "/src/icons";
import { useAssignIssueArticleMutation } from "/src/store/slices/issueArticlesSlice";
import UserSelect from "/src/components/userSelect";
import BatchActionDrawer from "/src/components/batchActionDrawer";

// ------------------------------------------------------

const IssueArticleAssignButton = ({ libraryId, articles, t, type, showDetails = true, showIcon = true }) => {
    const [form] = Form.useForm();
    const [assignIssueArticle, { isLoading: isAdding }] = useAssignIssueArticleMutation();
    const count = articles ? articles.length : 0;

    let assignment = [];

    if (count === 1) {
        if (articles[0].reviewerAccountId) {
            assignment.push(
                <Space.Compact>
                    <FileDoneOutlined />
                    <Typography>{articles[0].reviewerAccountName}</Typography>
                </Space.Compact>
            );
        }
        if (articles[0].writerAccountId) {
            assignment.push(
                <Space.Compact>
                    <EditOutlined />
                    <Typography>{articles[0].writerAccountName}</Typography>
                </Space.Compact>
            );
        }
    }

    const onOk = async () => {
        try {

            let values = await form.validateFields();
            return values.id === "none" ? {
                unassign: true
            } :
                {
                    accountId: values.id === "me" ? null : values.id,
                };
        }
        catch {
            return false;
        }
    };

    const onShow = () => {
        form.resetFields();
    };

    let data = {
        id: "",
        name: "",
    };

    return (
        <>
            <BatchActionDrawer t={t}
                tooltip={t('issueArticle.actions.assign.label')}
                buttonType={type}
                disabled={count === 0}
                title={showDetails && assignment.length > 0 ? assignment : null}
                icon={showIcon && <FaUserAlt />}
                sliderTitle={t("issueArticle.actions.assign.label")}
                onOk={onOk}
                closable={!isAdding}
                onShow={onShow}
                items={articles}
                itemTitle={article => article.title}
                mutation={assignIssueArticle}
                successMessage={t("issueArticle.actions.assign.success", { count })}
                errorMessage={t("issueArticle.actions.assign.error", { count })}
            >
                <Form form={form} layout="vertical" initialValues={data}>
                    <Form.Item
                        name="id"
                        label={t("issueArticle.user.label")}
                        rules={[
                            {
                                required: true,
                                message: t("issueArticle.user.required"),
                            },
                        ]}
                    >
                        <UserSelect
                            libraryId={libraryId}
                            t={t}
                            placeholder={t("issueArticle.user.placeholder")}
                            label={data.name}
                            addMeOption />
                    </Form.Item>
                </Form>
            </BatchActionDrawer >
        </>
    );
};

export default IssueArticleAssignButton;
