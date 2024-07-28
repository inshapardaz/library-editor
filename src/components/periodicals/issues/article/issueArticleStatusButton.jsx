import React, { useEffect, useState } from "react";

// Third party libraries
import { Form } from "antd";

// Local imports
import { FaTasks } from "/src/icons";
import { useUpdateIssueArticlesMutation } from "/src/store/slices/issueArticlesSlice";
import EditingStatusSelect from "/src/components/editingStatusSelect";
import BatchActionDrawer from "/src/components/batchActionDrawer";
// ------------------------------------------------------

const IssueArticleStatusButton = ({ articles, t, type, showIcon = true }) => {
    const [form] = Form.useForm();
    const [updateIssueArticles, { isLoading: isUpdating }] = useUpdateIssueArticlesMutation();
    const [selectedStatus, setSelectedStatus] = useState(null);
    const count = articles ? articles.length : 0;

    const onOk = async () => {
        try {
            let values = await form.validateFields();
            return (article) => {
                if (article && article.links && article.links.update) {
                    return { ...article, status: values.status };
                }
                return null;
            }
        }
        catch {
            return false;
        }
    };

    const onShow = () => {
        form.resetFields();
    };

    useEffect(() => {
        if (count === 1) {
            setSelectedStatus(articles[0]?.status);
        }
    }, [articles]);

    return (
        <>
            <BatchActionDrawer t={t}
                tooltip={t('issueArticle.actions.updateStatus.title')}
                buttonType={type}
                disabled={count === 0}
                icon={showIcon && <FaTasks />}
                sliderTitle={t("issueArticle.actions.updateStatus.title")}
                onOk={onOk}
                closable={!isUpdating}
                onShow={onShow}
                listTitle={t("issueArticle.title")}
                items={articles}
                itemTitle={article => article.title}
                mutation={updateIssueArticles}
                successMessage={t("issueArticle.actions.updateStatus.success")}
                errorMessage={t("issueArticle.actions.updateStatus.error")}
            >
                <Form
                    form={form}
                    layout="vertical"
                    initialValues={{ status: selectedStatus }}
                >
                    <Form.Item
                        name="status"
                        label={t("issueArticle.status.label")}
                        rules={[
                            {
                                required: true,
                                message: t("issueArticle.status.required"),
                            },
                        ]}
                    >
                        <EditingStatusSelect
                            t={t}
                            placeholder={t("issueArticle.status.placeholder")}
                        />
                    </Form.Item>
                </Form>
            </BatchActionDrawer>
        </>
    );
};

export default IssueArticleStatusButton;
