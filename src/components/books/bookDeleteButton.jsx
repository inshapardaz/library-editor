import React from 'react';

// Third party libraries
import { App, Button, Modal } from "antd";
import { ExclamationCircleFilled } from '/src/icons';

// Local imports
import { FaTrash } from '/src/icons';
import { useDeleteBookMutation } from "/src/store/slices/booksSlice";

// ------------------------------------------------------

const { confirm } = Modal;

// ------------------------------------------------------
const BookDeleteButton = ({ children, libraryId, book, t, type, onDeleted = () => { }, danger = false, block = false, size = "middle" }) => {
    const { message } = App.useApp();
    const [deleteBook, { isLoading: isDeleting }] = useDeleteBookMutation();

    const showConfirm = () => {
        confirm({
            title: t("book.actions.delete.title"),
            icon: <ExclamationCircleFilled />,
            content: t("book.actions.delete.message", { title: book.title }),
            okButtonProps: { disabled: isDeleting },
            cancelButtonProps: { disabled: isDeleting },
            closable: isDeleting,
            onOk() {
                return deleteBook({ libraryId, bookId: book.id })
                    .unwrap()
                    .then(() => onDeleted())
                    .then(() => { message.success(t("book.actions.delete.success")) })
                    .catch(() => { message.error(t("book.actions.delete.error")) });
            }
        });
    };

    return (<Button danger={danger} block={block} size={size} type={type} onClick={showConfirm} icon={<FaTrash />}>{children}</Button>);
};

export default BookDeleteButton;
