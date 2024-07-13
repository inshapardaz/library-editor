import React, { useEffect, useState } from "react";

// Third party libraries
import { Form } from "antd";

// Local imports
import { FaTasks } from "/src/icons";
import { useUpdateChaptersMutation } from "/src/store/slices/booksSlice";
import EditingStatusSelect from "/src/components/editingStatusSelect";
import BatchActionDrawer from "/src/components/batchActionDrawer";
// ------------------------------------------------------

const ChapterStatusButton = ({ chapters, t, type, showIcon = true }) => {
    const [form] = Form.useForm();
    const [updateChapters, { isLoading: isUpdating }] = useUpdateChaptersMutation();
    const [selectedStatus, setSelectedStatus] = useState(null);
    const count = chapters ? chapters.length : 0;

    const onOk = async () => {
        try {
            let values = await form.validateFields();
            return (chapter) => {
                if (chapter && chapter.links && chapter.links.update) {
                    return { ...chapter, status: values.status };
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
        if (chapters && chapters.length === 1) {
            setSelectedStatus(chapters[0]?.status);
        }
    }, [chapters]);

    return (
        <>
            <BatchActionDrawer t={t}
                tooltip={t('chapter.actions.updateStatus.title')}
                buttonType={type}
                disabled={count === 0}
                icon={showIcon && <FaTasks />}
                sliderTitle={t("chapter.actions.updateStatus.title")}
                onOk={onOk}
                closable={!isUpdating}
                onShow={onShow}
                listTitle={t("chapters.title")}
                items={chapters}
                itemTitle={chapter => chapter.title}
                mutation={updateChapters}
                successMessage={t("chapter.actions.updateStatus.success")}
                errorMessage={t("chapter.actions.updateStatus.error")}
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
            </BatchActionDrawer>
        </>
    );
};

export default ChapterStatusButton;
