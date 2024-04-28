// Third party libraries
import moment from "moment";
import { App, Button, Modal } from "antd";
import { FaTrash } from 'react-icons/fa';
import { ExclamationCircleFilled } from '@ant-design/icons';

// Local imports
import { useDeleteIssueMutation } from "~/src/store/slices/issuesSlice";
import { getDateFormatFromFrequency } from "~/src/util";
// ------------------------------------------------------
const { confirm } = Modal;
// ------------------------------------------------------

export default IssueDeleteButton = ({
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
                    .then(() => message.success(t("issue.actions.delete.success")))
                    .catch(() => message.error(t("issue.actions.delete.error")));
            }
        });
    };

    return (<Button danger={danger} block={block} size={size} type={type} onClick={showConfirm} icon={<FaTrash />}>{children}</Button>);
}
