import React from "react";

// Third party libraries
import { Form, Space, Typography } from "antd";

// Local imports
import { EditOutlined, FileDoneOutlined, FaUserAlt } from "/src/icons";
import { useAssignChaptersMutation } from "/src/store/slices/booksSlice";
import UserSelect from "/src/components/userSelect";
import BatchActionDrawer from "/src/components/batchActionDrawer";

// ------------------------------------------------------

const ChapterAssignButton = ({ libraryId, chapters, t, type, showDetails = true, showIcon = true }) => {
    const [form] = Form.useForm();
    const [assignChapters, { isLoading: isAdding }] = useAssignChaptersMutation();
    const count = chapters ? chapters.length : 0;

    let assignment = [];

    if (chapters.length === 1) {
        if (chapters[0].reviewerAccountId) {
            assignment.push(
                <Space.Compact>
                    <FileDoneOutlined />
                    <Typography>{chapters[0].reviewerAccountName}</Typography>
                </Space.Compact>
            );
        }
        if (chapters[0].writerAccountId) {
            assignment.push(
                <Space.Compact>
                    <EditOutlined />
                    <Typography>{chapters[0].writerAccountName}</Typography>
                </Space.Compact>
            );
        }
    }

    const onOk = async () => {
        try {

            let values = await form.validateFields();
            return values.id === "none" ? {
                unassign: true
            } :
                {
                    accountId: values.id === "me" ? null : values.id,
                };
        }
        catch {
            return false;
        }
    };

    const onShow = () => {
        form.resetFields();
    };

    let data = {
        id: "",
        name: "",
    };

    return (
        <>
            <BatchActionDrawer t={t}
                tooltip={t('chapter.actions.assign.label')}
                buttonType={type}
                disabled={count === 0}
                title={showDetails && assignment.length > 0 ? assignment : null}
                icon={showIcon && <FaUserAlt />}
                sliderTitle={t("chapter.actions.assign.label")}
                onOk={onOk}
                closable={!isAdding}
                onShow={onShow}
                listTitle={t("chapters.title")}
                items={chapters}
                itemTitle={chapter => chapter.title}
                mutation={assignChapters}
                successMessage={t("chapter.actions.assign.success", { count })}
                errorMessage={t("chapter.actions.assign.error", { count })}
            >
                <Form form={form} layout="vertical" initialValues={data}>
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
                            addMeOption />
                    </Form.Item>
                </Form>
            </BatchActionDrawer >
        </>
    );
};

export default ChapterAssignButton;
