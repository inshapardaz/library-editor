// Third party libraries
import { App, Button, Modal } from "antd";
import { FaTrash } from 'react-icons/fa';
import { ExclamationCircleFilled } from '@ant-design/icons';

// Local imports
import { useDeleteIssueMutation } from "../../../features/api/issuesSlice";
import moment from "moment";
import helpers from "../../../helpers";

// ------------------------------------------------------

const { confirm } = Modal;

// ------------------------------------------------------
export default function IssueDeleteButton({ children, issue, t, type, onDeleted = () => { }, danger = false, block = false, size = "middle" }) {
    const { message } = App.useApp();
    const [deleteIssue, { isLoading: isDeleting }] = useDeleteIssueMutation();

    const title = issue && moment(issue.issueDate).format(helpers.getDateFormatFromFrequency(issue.frequency));

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
                    .then(() => message.success(t("issue.actions.delete.success")))
                    .catch((_) => message.error(t("issue.actions.delete.error")));
            }
        });
    };

    return (<Button danger={danger} block={block} size={size} type={type} onClick={showConfirm} icon={<FaTrash />}>{children}</Button>);
}
