import { useState } from "react";

// Third party libraries
import { App, Button, Modal, Form, Space, Tooltip, Tag } from "antd";
import { FaUserAlt } from "react-icons/fa";
import { useAssignChapterMutation } from "../../../features/api/booksSlice";

// Local imports
import UserSelect from "../../userSelect";
import { EditOutlined, FileDoneOutlined } from "@ant-design/icons";

// ------------------------------------------------------

export default function ChapterAssignButton({ libraryId, chapters, t, type }) {
    const { message } = App.useApp();
    const [form] = Form.useForm();
    const [open, setOpen] = useState(false);
    const [assignChapter, { isLoading: isAdding }] = useAssignChapterMutation();
    const count = chapters ? chapters.length : 0;

    let assignment = [];

    if (chapters.length === 1) {
        if (chapters[0].reviewerAccountId) {
            assignment.push(
                <Tag icon={<FileDoneOutlined />} closable={false}>
                    {chapters[0].reviewerAccountName}
                </Tag>
            );
        }
        if (chapters[0].writerAccountId) {
            assignment.push(
                <Tag icon={<EditOutlined />} closable={false}>
                    {chapters[0].writerAccountName}
                </Tag>
            );
        }
    }

    const onSubmit = (values) => {
        const payload = values.id === "none"  ? {
            unassign : true
        } :
        {
            accountId: values.id === "me" ? null : values.id,
        };

        const promises = chapters
            .map((chapter) => {
                if (chapter && chapter.links && chapter.links.assign) {
                    return assignChapter({ chapter, payload }).unwrap();
                }
                return Promise.resolve();
            });

        Promise.all(promises)
            .then(() =>
                message.success(t("chapter.actions.assign.success", { count }))
            )
            .catch((_) =>
                message.error(t("chapter.actions.assign.error", { count }))
            );
    };

    const onOk = () =>
        form
            .validateFields()
            .then((values) => {
                onSubmit(values);
            })
            .catch((info) => {
                console.error(info);
            });

    const onShow = () => {
        form.resetFields();
        setOpen(true);
    };

    let data = {
        id: "",
        name: "",
    };

    return (
        <>
            <Tooltip title={t('chapter.actions.assign.label')}>
                <Button
                    type={type}
                    onClick={onShow}
                    disabled={count === 0}
                >
                    {assignment.length > 0 ? assignment : <FaUserAlt />}
                </Button>
            </Tooltip>
            <Modal
                open={open}
                title={t("chapter.actions.assign.title", { count })}
                onOk={onOk}
                onCancel={() => setOpen(false)}
                closable={false}
                okButtonProps={{ disabled: isAdding }}
                cancelButtonProps={{ disabled: isAdding }}
            >
                <Form form={form} layout="vertical" initialValues={data}>
                    <Space>
                        {t("chapter.actions.assign.message", {
                            chapterNumber: chapters
                                ? chapters.map((p) => p.title).join(",")
                                : 0,
                        })}
                    </Space>
                    <Form.Item
                        name="id"
                        label={t("chapter.user.label")}
                        rules={[
                            {
                                required: true,
                                message: t("chapter.user.required"),
                            },
                        ]}
                    >
                        <UserSelect
                            libraryId={libraryId}
                            t={t}
                            placeholder={t("chapter.user.placeholder")}
                            label={data.name}
                            addMeOption
                        />
                    </Form.Item>
                </Form>
            </Modal>
        </>
    );
}
