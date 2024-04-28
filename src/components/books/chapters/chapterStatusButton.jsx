import { useEffect, useState } from "react";

// Third party libraries
import { App, Button, Modal, Form, Tooltip } from "antd";
import { FaTasks } from "react-icons/fa";

// Local imports
import { useUpdateChapterMutation } from "~/src/store/slices/booksSlice";
import EditingStatusSelect from "~/src/components/editingStatusSelect";
// ------------------------------------------------------

const ChapterStatusButton = ({ chapters, t, type }) => {
    const { message } = App.useApp();
    const [form] = Form.useForm();
    const [open, setOpen] = useState(false);
    const [updateChapter, { isLoading: isUpdating }] = useUpdateChapterMutation();
    const [selectedStatus, setSelectedStatus] = useState(null);

    const onSubmit = (values) => {
        const promises = chapters
            .map((chapter) => {
                if (chapter && chapter.links && chapter.links.update) {
                    const payload = { ...chapter, status: values.status };
                    return updateChapter({ chapter: payload }).unwrap();
                }
                return Promise.resolve();
            });

        Promise.all(promises)
            .then(() =>
                message.success(t("chapter.actions.updateStatus.success"))
            )
            .catch(() =>
                message.error(t("chapter.actions.updateStatus.error"))
            );
    };
    const onOk = () =>
        form
            .validateFields()
            .then((values) => {
                onSubmit(values);
            })
            .catch(() => { });

    const onShow = () => {
        form.resetFields();
        setOpen(true);
    };

    const title = t("chapter.actions.updateStatus.title");

    useEffect(() => {
        if (chapters && chapters.length === 1) {
            setSelectedStatus(chapters[0]?.status);
        }
    }, [chapters]);

    return (
        <>
            <Tooltip title={t('chapter.actions.updateStatus.title')}>
                <Button
                    type={type}
                    onClick={onShow}
                    disabled={!chapters || chapters.length < 0}
                    icon={<FaTasks />}
                />
            </Tooltip>
            <Modal
                open={open}
                title={title}
                onCancel={() => setOpen(false)}
                onOk={onOk}
                closable={false}
                okButtonProps={{ disabled: isUpdating }}
                cancelButtonProps={{ disabled: isUpdating }}
            >
                <Form
                    form={form}
                    layout="vertical"
                    initialValues={{ status: selectedStatus }}
                >
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
};

export default ChapterStatusButton;
