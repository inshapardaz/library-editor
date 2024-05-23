import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

// Third party libraries
import { App, Dropdown, Modal, Form, Input } from "antd";
import { DownOutlined } from "@ant-design/icons";

// Local imports
import { useAddChapterMutation, useUpdateChapterMutation } from "/src/store/slices/booksSlice";
import EditingStatusSelect from "/src/components/editingStatusSelect";

// ------------------------------------------------------

const PageEditor = ({ libraryId, bookId, chapter, t, buttonType = "text" }) => {
    const { message } = App.useApp();
    const navigate = useNavigate();
    const [form] = Form.useForm();
    const [open, setOpen] = useState(false);
    const [addChapter, { isLoading: isAdding }] = useAddChapterMutation();
    const [updateChapter, { isLoading: isUpdating }] = useUpdateChapterMutation();

    const onSubmit = (values) => {
        if (chapter) {
            chapter.title = values.title;
            chapter.status = values.status;
            return updateChapter({ libraryId, bookId, chapterNumber: chapter.chapterNumber, payload: chapter })
                .unwrap()
                .then(() => setOpen(false))
                .then(() => message.success(t("chapter.actions.edit.success")))
                .catch(() => message.error(t("chapter.actions.edit.error")));
        } else {
            return addChapter({ libraryId, bookId, payload: values })
                .unwrap()
                .then(() => setOpen(false))
                .then(() => message.success(t("chapter.actions.add.success")))
                .catch(() => message.error(t("chapter.actions.add.error")));
        }
    };

    const onOk = () =>
        form
            .validateFields()
            .then((values) => {
                onSubmit(values);
            })
            .catch(() => { });

    const onAddNewPage = () => navigate(`/libraries/${libraryId}/books/${bookId}/pages/add`);

    const title = chapter ? t("chapter.actions.edit.title", { title: chapter.title }) : t("chapter.actions.add.title");

    return (
        <>
            <Dropdown.Button type={buttonType} icon={<DownOutlined />} onClick={onAddNewPage}>
                {t("page.actions.add.label")}
            </Dropdown.Button>
            <Modal open={open} title={title} onCancel={() => setOpen(false)} onOk={onOk} closable={false} okButtonProps={{ disabled: isAdding | isUpdating }} cancelButtonProps={{ disabled: isAdding | isUpdating }}>
                <Form form={form} layout="vertical" initialValues={chapter || { status: "Available" }}>
                    <Form.Item
                        name="title"
                        label={t("chapter.title.label")}
                        rules={[
                            {
                                required: true,
                                message: t("chapter.title.required"),
                            },
                        ]}
                    >
                        <Input placeholder={t("chapter.title.placeholder")} autoFocus />
                    </Form.Item>
                    <Form.Item
                        name="status"
                        label={t("chapter.status.label")}
                        rules={[
                            {
                                required: true,
                                message: t("chapter.status.required"),
                            },
                        ]}
                    >
                        <EditingStatusSelect t={t} placeholder={t("chapter.status.placeholder")} />
                    </Form.Item>
                </Form>
            </Modal>
        </>
    );
};

export default PageEditor;
