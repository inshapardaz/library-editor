import { useState } from "react";

// Third party libraries
import { App, Button, Modal, Form } from "antd";
import { FaTasks } from "react-icons/fa";

// Local imports
import { useUpdateBookPageMutation } from "../../../features/api/booksSlice";
import EditingStatusSelect from "../../editingStatusSelect";

// ------------------------------------------------------

export default function PageStatusButton({ pages, t, type }) {
    const { message } = App.useApp();
    const [form] = Form.useForm();
    const [open, setOpen] = useState(false);
    const [updateBookPage, { isLoading: isUpdating }] =
        useUpdateBookPageMutation();
    const count = pages ? pages.length : 0;

    const onSubmit = (values) => {
        const promises = pages
            .map((page) => {
                if (page && page.links && page.links.update) {
                    const payload = { ...page, status: values.status };
                    return updateBookPage({ page: payload }).unwrap();
                }
                return Promise.resolve();
            });

        Promise.all(promises)
            .then(() => message.success(t("page.actions.updateStatus.success")))
            .catch((_) => message.error(t("page.actions.updateStatus.error")));
    };
    const onOk = () =>
        form
            .validateFields()
            .then((values) => {
                onSubmit(values);
            })
            .catch(() => {});

    const onShow = () => {
        form.resetFields();
        setOpen(true);
    };

    const title = t("page.actions.updateStatus.title");

    return (
        <>
            <Button
                type={type}
                onClick={onShow}
                disabled={count === 0}
                icon={<FaTasks />}
            ></Button>
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
                    initialValues={{ status: "" }}
                >
                    <Form.Item
                        name="status"
                        label={t("page.status.title")}
                        rules={[
                            {
                                required: true,
                                message: t("page.status.required"),
                            },
                        ]}
                    >
                        <EditingStatusSelect
                            t={t}
                            placeholder={t("page.status.placeholder")}
                        />
                    </Form.Item>
                </Form>
            </Modal>
        </>
    );
}
