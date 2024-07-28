import React, { useState } from "react";

// Third party libraries
import { App, Button, Modal, Form, Input, Tooltip } from "antd";

// Local imports
import { FaEdit, FaPlus } from "/src/icons";
import {
    useAddIssueArticleMutation,
    useUpdateIssueArticleMutation
} from "/src/store/slices/issueArticlesSlice";
import EditingStatusSelect from "/src/components/editingStatusSelect";
import AuthorsSelect from "/src/components/author/authorsSelect";
// ------------------------------------------------------

const IssueArticleEditor = ({ libraryId,
    periodicalId,
    volumeNumber,
    issueNumber,
    article,
    t,
    type }) => {
    const { message } = App.useApp();
    const [form] = Form.useForm();
    const [open, setOpen] = useState(false);
    const [addIssueArticle, { isLoading: isAdding }] = useAddIssueArticleMutation();
    const [updateIssueArticle, { isLoading: isUpdating }] = useUpdateIssueArticleMutation();

    const onSubmit = (values) => {
        if (article) {
            const payload = {
                ...article,
                title: values.title,
                status: values.status,
                authors: values.authors,
            };
            return updateIssueArticle({ url: article.links.update, payload })
                .unwrap()
                .then(() => setOpen(false))
                .then(() => message.success(t("issueArticle.actions.edit.success")))
                .catch(() => message.error(t("issueArticle.actions.edit.error")));
        } else {
            return addIssueArticle({
                libraryId,
                periodicalId,
                volumeNumber,
                issueNumber,
                payload: values
            })
                .unwrap()
                .then(() => setOpen(false))
                .then(() => message.success(t("issueArticle.actions.add.success")))
                .catch(() => message.error(t("issueArticle.actions.add.error")));
        }
    };
    const onOk = () =>
        form
            .validateFields()
            .then((values) => {
                onSubmit(values);
            })
            .catch((info) => {
                console.log(info);
            });

    const onShow = () => {
        form.resetFields();
        setOpen(true);
    };

    const title = article
        ? t("issueArticle.actions.edit.title", { name: article.title })
        : t("issueArticle.actions.add.title");
    const buttonIcon = article ? <FaEdit /> : <FaPlus />;

    return (
        <>
            <Tooltip title={title}>
                <Button type={type} onClick={onShow} icon={buttonIcon} />
            </Tooltip>
            <Modal
                open={open}
                title={title}
                onCancel={() => setOpen(false)}
                onOk={onOk}
                closable={false}
                okButtonProps={{ disabled: isAdding | isUpdating }}
                cancelButtonProps={{ disabled: isAdding | isUpdating }}
            >
                <Form
                    form={form}
                    layout="vertical"
                    initialValues={article || { status: "Available" }}
                >
                    <Form.Item
                        name="title"
                        label={t("issueArticle.title.label")}
                        rules={[
                            {
                                required: true,
                                message: t("issueArticle.title.required"),
                            },
                        ]}
                    >
                        <Input placeholder={t("issueArticle.title.placeholder")} />
                    </Form.Item>
                    <Form.Item
                        name="authors"
                        label={t("issueArticle.authors.label")}
                        rules={[
                            {
                                required: true,
                                message: t("issueArticle.authors.required"),
                            },
                        ]}
                    >
                        <AuthorsSelect
                            placeholder={t("issueArticle.authors.placeholder")}
                            t={t}
                            libraryId={libraryId}
                            showAdd />
                    </Form.Item>
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
            </Modal>
        </>
    );
};

export default IssueArticleEditor;
