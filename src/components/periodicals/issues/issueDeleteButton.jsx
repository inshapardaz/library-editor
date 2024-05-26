import React from 'react';
import { useNavigate } from "react-router-dom";

// Third party libraries
import moment from "moment";
import { App, Button, Modal } from "antd";

// Local imports
import { FaTrash, ExclamationCircleFilled } from '/src/icons';
import { useDeleteIssueMutation } from "/src/store/slices/issuesSlice";
import { getDateFormatFromFrequency } from "/src/util";
// ------------------------------------------------------
const { confirm } = Modal;
// ------------------------------------------------------

const IssueDeleteButton = ({
    libraryId,
    children,
    issue,
    t,
    type,
    onDeleted = () => { },
    danger = false,
    block = false,
    size = "middle"
}) => {
    const { message } = App.useApp();
    const navigate = useNavigate();
    const [deleteIssue, { isLoading: isDeleting }] = useDeleteIssueMutation();

    const title = issue && moment(issue.issueDate).format(getDateFormatFromFrequency(issue.frequency));

    const showConfirm = () => {
        confirm({
            title: t("issue.actions.delete.title"),
            icon: <ExclamationCircleFilled />,
            content: t("issue.actions.delete.message", { name: title }),
            okButtonProps: { disabled: isDeleting },
            cancelButtonProps: { disabled: isDeleting },
            closable: isDeleting,
            onOk() {
                return deleteIssue({ issue: issue })
                    .unwrap()
                    .then(() => onDeleted())
                    .then(() => { message.success(t("issue.actions.delete.success")) })
                    .then(() => navigate(`/libraries/${libraryId}/periodicals/${issue.periodicalId}`))
                    .catch((e) => { console.error(e); message.error(t("issue.actions.delete.error")) });
            }
        });
    };

    return (<Button danger={danger} block={block} size={size} type={type} onClick={showConfirm} icon={<FaTrash />}>{children}</Button>);
};

export default IssueDeleteButton;
