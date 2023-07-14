import { useState } from "react";

// Third party libraries
import { App, Button, Modal, Form, InputNumber } from "antd";
import { FaSort } from "react-icons/fa";

// Local imports
import { useUpdateBookPageSequenceMutation } from "../../../features/api/booksSlice";

// ------------------------------------------------------

export default function PageSequenceEditor({ page, t, type }) {
    const { message } = App.useApp();
    const [form] = Form.useForm();
    const [open, setOpen] = useState(false);
    const [updateBookPageSequence, { isLoading: isUpdating }] =
        useUpdateBookPageSequenceMutation();

    const onSubmit = (values) => {
        return updateBookPageSequence({
            page,
            payload: { sequenceNumber: values.sequenceNumber },
        })
            .unwrap()
            .then(() => setOpen(false))
            .then(() => message.success(t("page.actions.sequence.success")))
            .catch((_) => message.error(t("page.actions.sequence.error")));
    };
    const onOk = () =>
        form
            .validateFields()
            .then((values) => {
                onSubmit(values);
            })
            .catch((info) => {});

    const onShow = () => {
        form.resetFields();
        setOpen(true);
    };

    const title = t("page.actions.sequence.title", {
        sequenceNumber: page.sequenceNumber,
    });

    return (
        <>
            <Button type={type} onClick={onShow} icon={<FaSort />}></Button>
            <Modal
                open={open}
                title={title}
                onCancel={() => setOpen(false)}
                onOk={onOk}
                closable={false}
                okButtonProps={{ disabled: isUpdating }}
                cancelButtonProps={{ disabled: isUpdating }}
            >
                <Form form={form} layout="vertical" initialValues={page}>
                    <Form.Item
                        name="sequenceNumber"
                        label={t("page.sequenceNumber.title")}
                        rules={[
                            {
                                required: true,
                                message: t("page.sequenceNumber.required"),
                            },
                        ]}
                    >
                        <InputNumber min={1} />
                    </Form.Item>
                </Form>
            </Modal>
        </>
    );
}
