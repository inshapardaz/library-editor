import { useState } from "react";

// Third party libraries
import { App, Button, Modal, Form, Space } from "antd";
import { FaUserAlt } from "react-icons/fa";

// Local imports
import { useAssignBookPageMutation } from "../../../features/api/booksSlice";
import UserSelect from "../../userSelect";

// ------------------------------------------------------

export default function PageAssignButton({ libraryId, pages, t, type }) {
    const { message } = App.useApp();
    const [form] = Form.useForm();
    const [open, setOpen] = useState(false);
    const [assignBookPage, { isLoading: isAssigning }] =
        useAssignBookPageMutation();
    const count = pages ? pages.length : 0;
    const onSubmit = (values) => {
        const payload = {
            accountId: values.id === "none" ? null : values.id,
        };

        const promises = [];
        pages
            .slice(0)
            .reverse()
            .map((page) => {
                if (page && page.links && page.links.assign) {
                    return promises.push(
                        assignBookPage({ page, payload }).unwrap()
                    );
                }
                return Promise.resolve();
            });

        Promise.all(promises)
            .then(() =>
                message.success(t("page.actions.assign.success", { count }))
            )
            .catch((_) =>
                message.error(t("page.actions.assign.error", { count }))
            );
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

    const hasAllPagesGotLink =
        pages && pages.data && pages.data.every((p) => p.links.assign_to_me);

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
                icon={<FaUserAlt />}
            />
            <Modal
                open={open}
                title={t("page.actions.assign.title", { count })}
                onOk={onOk}
                onCancel={() => setOpen(false)}
                closable={false}
                okButtonProps={{ disabled: isAssigning }}
                cancelButtonProps={{ disabled: isAssigning }}
            >
                <Form form={form} layout="vertical" initialValues={data}>
                    <Space>
                        {t("page.actions.assign.message", {
                            sequenceNumber: pages
                                ? pages.map((p) => p.sequenceNumber).join(",")
                                : 0,
                        })}
                    </Space>
                    <Form.Item
                        name="id"
                        label={t("page.user.label")}
                        rules={[
                            {
                                required: true,
                                message: t("page.user.required"),
                            },
                        ]}
                    >
                        <UserSelect
                            libraryId={libraryId}
                            t={t}
                            placeholder={t("page.user.placeholder")}
                            label={data.name}
                            addMeOption={hasAllPagesGotLink}
                        />
                    </Form.Item>
                </Form>
            </Modal>
        </>
    );
}
