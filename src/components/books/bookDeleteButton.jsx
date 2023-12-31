// Third party libraries
import { App, Button, Modal } from "antd";
import { FaTrash } from 'react-icons/fa';
import { ExclamationCircleFilled } from '@ant-design/icons';

// Local imports
import { useDeleteBookMutation } from "../../features/api/booksSlice";

// ------------------------------------------------------

const { confirm } = Modal;

// ------------------------------------------------------
export default function BookDeleteButton({ children, libraryId, book, t, type,  onDeleted = () => {}, danger = false, block = false, size= "middle" }) {
    const { message } = App.useApp();
    const [deleteBook, { isLoading: isDeleting }] = useDeleteBookMutation();

    const showConfirm = () => {
        confirm({
            title: t("book.actions.delete.title"),
            icon: <ExclamationCircleFilled />,
            content: t("book.actions.delete.message", { title : book.title }),
            okButtonProps: { disabled:  isDeleting },
            cancelButtonProps: { disabled:  isDeleting },
            closable: { isDeleting },
            onOk() {
                deleteBook({ libraryId, bookId: book.id })
                    .unwrap()
                    .then(() => message.success(t("book.actions.delete.success")))
                    .then(() => onDeleted())
                    .catch((_) => message.error(t("book.actions.delete.error")));
            }
        });
    };

    return (<Button danger={danger} block={block} size={size} type={type} onClick={showConfirm} icon={<FaTrash/>}>{children}</Button>);
}
