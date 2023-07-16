import { useState } from "react";

// Third party libraries
import { App, Button, Modal, Form, Space } from "antd";
import { MdOutlineAssignmentInd } from "react-icons/md";

// Local imports
import { useAssignChapterMutation } from "../../../features/api/booksSlice";
import UserSelect from "../../userSelect";

// ------------------------------------------------------

export default function ChapterAssignButton({ libraryId, chapters, t, type }) {
    const { message } = App.useApp();
    const [form] = Form.useForm();
    const [open, setOpen] = useState(false);
    const [assignChapter, { isLoading: isAdding }] = useAssignChapterMutation();
    const count = chapters ? chapters.length : 0;

    const onSubmit = (values) => {
        const payload = {
            accountId: values.id === "none" ? null : values.id,
        };

        const promises = [];
        chapters
            .slice(0)
            .reverse()
            .map((chapter) => {
                if (chapter && chapter.links && chapter.links.assign) {
                    return promises.push(
                        assignChapter({ chapter, payload }).unwrap()
                    );
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
            <Button
                type={type}
                onClick={onShow}
                disabled={count === 0}
                icon={<MdOutlineAssignmentInd />}
            />
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
