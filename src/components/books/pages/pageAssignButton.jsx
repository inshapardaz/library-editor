import React, { useState } from "react";

// Third party libraries
import { App, Button, Modal, Form, Space } from "antd";

// Local imports
import { FaUserAlt } from "/src/icons";
import { useAssignBookPageMutation } from "/src/store/slices/booksSlice";
import UserSelect from "/src/components/userSelect";

// ------------------------------------------------------

const PageAssignButton = ({ libraryId, pages, t, type }) => {
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

        const promises = pages
            .map((page) => {
                if (page && page.links && page.links.assign) {
                    return assignBookPage({ page, payload }).unwrap();
                }
                return Promise.resolve();
            });

        Promise.all(promises)
            .then(() => {
                setOpen(false);
                message.success(t("page.actions.assign.success", { count }));
            })
            .catch(() => {
                setOpen(false);
                message.error(t("page.actions.assign.error", { count }))
            });
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

    const hasAllPagesGotLink = true;
    // pages && pages.data && pages.data.every((p) => p.links.assign_to_me);

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
};

export default PageAssignButton;
