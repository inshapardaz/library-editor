// Third party libraries
import { App, Button, Modal } from "antd";
import { FaTrash } from 'react-icons/fa';
import { ExclamationCircleFilled } from '@ant-design/icons';

// Local imports
import { useDeleteAuthorMutation } from "~/src/store/slices/authorsSlice";

// ------------------------------------------------------

const { confirm } = Modal;

// ------------------------------------------------------
const AuthorDeleteButton = ({ children, libraryId, author, t, type, onDeleted = () => { }, danger = false, block = false, size = "middle" }) => {
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
                    .then(() => onDeleted())
                    .then(() => message.success(t("author.actions.delete.success")))
                    .catch(() => message.error(t("author.actions.delete.error")));
            }
        });
    };

    return (<Button danger={danger} block={block} size={size} type={type} onClick={showConfirm} icon={<FaTrash />}>{children}</Button>);
};

export default AuthorDeleteButton;
