import React from "react";

// Third party libraries
import { Form, Space } from "antd";

// Local imports
import { FaLayerGroup } from "/src/icons";
import { useUpdateIssuePagesMutation } from "/src/store/slices/issuesSlice";
import BatchActionDrawer from "/src/components/batchActionDrawer";
import IssueArticleSelect from "../article/issueArticleSelect";

// ------------------------------------------------------

const IssuePageArticleButton = ({ libraryId, issue, pages, t, type, showIcon = true }) => {
    const [form] = Form.useForm();
    const [updateIssuePages, { isLoading: isUpdating }] = useUpdateIssuePagesMutation();
    const count = pages ? pages.length : 0;

    const onOk = async () => {
        try {
            let values = await form.validateFields();
            return (page) => {
                if (page && page.links && page.links.update) {
                    return { ...page, articleId: values.id };
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

    let data = { chapterId: null };

    return (
        <>
            <BatchActionDrawer t={t}
                tooltip={t("page.actions.setChapter.title_one")}
                buttonType={type}
                disabled={count === 0}
                icon={showIcon && <FaLayerGroup />}
                sliderTitle={t("page.actions.updateStatus.title")}
                onOk={onOk}
                closable={!isUpdating}
                onShow={onShow}
                listTitle={t("page.actions.setChapter.title", { count })}
                items={pages}
                itemTitle={page => page.sequenceNumber}
                mutation={updateIssuePages}
                successMessage={t("page.actions.setChapter.success", { count })}
                errorMessage={t("page.actions.setChapter.error", { count })}
            >
                <Form form={form} layout="vertical" initialValues={data}>
                    <Space>
                        {t("page.actions.setChapter.message", {
                            sequenceNumber: pages
                                ? pages.map((p) => p.sequenceNumber).join(",")
                                : 0,
                        })}
                    </Space>
                    <Form.Item
                        name="id"
                        label={t("page.chapter.label")}
                        rules={[
                            {
                                required: true,
                                message: t("page.chapter.required"),
                            },
                        ]}
                    >
                        <IssueArticleSelect
                            libraryId={libraryId}
                            issue={issue}
                            t={t}
                            placeholder={t("page.chapter.placeholder")}
                            label={data.name}
                            showAdd={true}
                        />
                    </Form.Item>
                </Form>
            </BatchActionDrawer>
        </>
    );
};

export default IssuePageArticleButton;
