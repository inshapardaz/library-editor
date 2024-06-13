import React from 'react';

// Third party libraries
import { App, Button, Modal, Tooltip } from "antd";

// Local imports
import { FaTrash, ExclamationCircleFilled } from "/src/icons";
import { useDeleteIssueContentMutation } from "/src/store/slices/issuesSlice";

// ------------------------------------------------------
const { confirm } = Modal;
// ------------------------------------------------------

const FileDeleteButton = ({ content, t, type }) => {
    const { message } = App.useApp();
    const [deleteIssueContent, { isLoading: isDeleting }] = useDeleteIssueContentMutation();

    const showConfirm = () => {
        confirm({
            title: t("issue.actions.deleteFile.title"),
            icon: <ExclamationCircleFilled />,
            content: t("issue.actions.deleteFile.message", {
                title: content.fileName,
            }),
            okButtonProps: { loading: isDeleting },
            okType: "danger",
            cancelButtonProps: { disabled: isDeleting },
            closable: isDeleting,
            onOk() {
                if (content && content.links && content.links.delete) {
                    return deleteIssueContent({ content }).unwrap()
                        .then(() => {
                            message.success(t("issue.actions.deleteFile.success"))
                        })
                        .catch(() => {
                            message.error(t("issues.actions.deleteFile.error"))
                        });
                }
            }
        });
    };

    return (
        <Tooltip title={t('actions.delete')}>
            <Button
                type={type}
                onClick={showConfirm}
                icon={<FaTrash />}
            />
        </Tooltip>
    );
};

export default FileDeleteButton;
