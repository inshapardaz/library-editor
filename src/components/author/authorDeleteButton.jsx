// Third party libraries
import { App, Button, Modal } from "antd";
import { FaTrash } from 'react-icons/fa';
import { ExclamationCircleFilled } from '@ant-design/icons';

// Local imports
import { useDeleteAuthorMutation } from "../../features/api/authorsSlice";

// ------------------------------------------------------

const { confirm } = Modal;

// ------------------------------------------------------
export default function AuthorDeleteButton({ children, libraryId, author, t, type, onDeleted = () => { }, danger = false, block = false, size = "middle" }) {
    const { message } = App.useApp();
    const [deleteAuthor, { isLoading: isDeleting }] = useDeleteAuthorMutation();

    const showConfirm = () => {
        confirm({
            title: t("author.actions.delete.title"),
            icon: <ExclamationCircleFilled />,
            content: t("author.actions.delete.message", { name: author.name }),
            okButtonProps: { disabled: isDeleting },
            cancelButtonProps: { disabled: isDeleting },
            closable: isDeleting,
            onOk() {
                return deleteAuthor({ libraryId, authorId: author.id })
                    .unwrap()
                    .then(() => message.success(t("author.actions.delete.success")))
                    .then(() => onDeleted())
                    .catch((_) => message.error(t("author.actions.delete.error")));
            }
        });
    };

    return (<Button danger={danger} block={block} size={size} type={type} onClick={showConfirm} icon={<FaTrash />}>{children}</Button>);
}
