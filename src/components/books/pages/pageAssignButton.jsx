import React from "react";

// Third party libraries
import { Form, Space } from "antd";

// Local imports
import { FaUserAlt } from "/src/icons";
import { useAssignBookPagesMutation } from "/src/store/slices/booksSlice";
import UserSelect from "/src/components/userSelect";
import BatchActionDrawer from "/src/components/batchActionDrawer";

// ------------------------------------------------------

const PageAssignButton = ({ libraryId, pages, t, type, showDetails = false, showIcon = true }) => {
    const [form] = Form.useForm();
    const [assignBookPages, { isLoading: isAssigning }] =
        useAssignBookPagesMutation();
    const count = pages ? pages.length : 0;

    const onOk = async () => {
        try {

            let values = await form.validateFields();
            return {
                accountId: values.id === "none" ? null : values.id,
            };
        }
        catch {
            return false;
        }
    };

    const onShow = () => {
        form.resetFields();
    };

    const hasAllPagesGotLink = true;
    // pages && pages.data && pages.data.every((p) => p.links.assign_to_me);

    let data = {
        id: "",
        name: "",
    };

    return (
        <>
            <BatchActionDrawer t={t}
                tooltip={t('page.actions.assign.title')}
                buttonType={type}
                disabled={count === 0}
                title={showDetails && t('page.actions.assign.title')}
                icon={showIcon && <FaUserAlt />}
                sliderTitle={t("page.actions.assign.title")}
                onOk={onOk}
                closable={!isAssigning}
                onShow={onShow}
                listTitle={t("chapters.title")}
                items={pages}
                itemTitle={page => page.sequenceNumber}
                mutation={assignBookPages}
                successMessage={t("page.actions.assign.success", { count })}
                errorMessage={t("page.actions.assign.error", { count })}
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
            </BatchActionDrawer>
        </>
    );
};

export default PageAssignButton;
