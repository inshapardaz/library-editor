import { useState } from "react";

// Third party libraries
import { App, Button, Modal, Form, Input, Tooltip } from "antd";
import { FaEdit, FaPlus } from "react-icons/fa";

// Local imports
import {
    useAddChapterMutation,
    useUpdateChapterMutation,
} from "~/src/store/slices/booksSlice";
import EditingStatusSelect from "~/src/components/editingStatusSelect";
// ------------------------------------------------------

export default function ChapterEditor({ libraryId, bookId, chapter, t, type }) {
    const { message } = App.useApp();
    const [form] = Form.useForm();
    const [open, setOpen] = useState(false);
    const [addChapter, { isLoading: isAdding }] = useAddChapterMutation();
    const [updateChapter, { isLoading: isUpdating }] =
        useUpdateChapterMutation();

    const onSubmit = (values) => {
        if (chapter) {
            const payload = {
                ...chapter,
                title: values.title,
                status: values.status,
            };
            return updateChapter({ chapter: payload })
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
            .catch((info) => {
                console.log(info);
            });

    const onShow = () => {
        form.resetFields();
        setOpen(true);
    };

    const title = chapter
        ? t("chapter.actions.edit.title", { title: chapter.title })
        : t("chapter.actions.add.title");
    const buttonIcon = chapter ? <FaEdit /> : <FaPlus />;

    return (
        <>
            <Tooltip title={t('actions.edit')}>
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
                    initialValues={chapter || { status: "Available" }}
                >
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
                        <Input placeholder={t("chapter.title.placeholder")} />
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
                        <EditingStatusSelect
                            t={t}
                            placeholder={t("chapter.status.placeholder")}
                        />
                    </Form.Item>
                </Form>
            </Modal>
        </>
    );
}
