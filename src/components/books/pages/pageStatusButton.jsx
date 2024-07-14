import React, { useEffect, useState } from "react";

// Third party libraries
import { Form } from "antd";

// Local imports
import { FaTasks } from "/src/icons";
import { useUpdateBookPagesMutation } from "/src/store/slices/booksSlice";
import EditingStatusSelect from "/src/components/editingStatusSelect";
import BatchActionDrawer from "/src/components/batchActionDrawer";

// ------------------------------------------------------

const PageStatusButton = ({ pages, t, type, showIcon = true }) => {
    const [form] = Form.useForm();
    const [updateBookPages, { isLoading: isUpdating }] = useUpdateBookPagesMutation();
    const count = pages ? pages.length : 0;
    const [selectedStatus, setSelectedStatus] = useState(null);

    const onOk = async () => {
        try {
            let values = await form.validateFields();
            return (page) => {
                if (page && page.links && page.links.update) {
                    return { ...page, status: values.status };
                }
                return null;
            }
        }
        catch {
            return false;
        }
    };
  
    const onShow = () => {
        form.resetFields();
    };

    useEffect(() => {
        if (pages && pages.length === 1) {
            setSelectedStatus(pages[0]?.status);
        }
    }, [pages]);

    return (
        <>
        <BatchActionDrawer t={t}
                tooltip={t("page.actions.updateStatus.title")}
                buttonType={type}
                disabled={count === 0}
                icon={showIcon && <FaTasks />}
                sliderTitle={t("page.actions.updateStatus.title")}
                onOk={onOk}
                closable={!isUpdating}
                onShow={onShow}
                listTitle={t("page.actions.assign.message")}
                items={pages}
                itemTitle={page => page.sequenceNumber}
                mutation={updateBookPages}
                successMessage={t("page.actions.updateStatus.success")}
                errorMessage={t("page.actions.updateStatus.error")}
            >
             <Form
                    form={form}
                    layout="vertical"
                    initialValues={{ status: selectedStatus }}
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
            </BatchActionDrawer>
        </>
    );
};

export default PageStatusButton;
