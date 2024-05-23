import React from 'react';

// Third party libraries
import { App, Button, Modal } from "antd";
import { ExclamationCircleFilled } from '@ant-design/icons';
import { MdPublishedWithChanges } from "react-icons/md";

// Local imports
import { usePublishBookMutation } from "/src/store/slices/booksSlice";

// ------------------------------------------------------

const { confirm } = Modal;

// ------------------------------------------------------
const BookPublishButton = ({ children, book, t, onPublished = () => { }, ...props }) => {
    const { message } = App.useApp();
    const [publishBook, { isLoading: isPublishing }] = usePublishBookMutation();

    const showConfirm = () => {
        confirm({
            title: t("book.actions.publish.title"),
            icon: <ExclamationCircleFilled />,
            content: t("book.actions.publish.message", { title: book.title }),
            okButtonProps: { disabled: isPublishing },
            cancelButtonProps: { disabled: isPublishing },
            closable: isPublishing,
            onOk() {
                return publishBook({ book })
                    .unwrap()
                    .then(() => message.success(t("book.actions.publish.success")))
                    .then(() => onPublished())
                    .catch(() => message.error(t("book.actions.publish.error")));
            }
        });
    };

    return (<Button {...props} onClick={showConfirm} icon={<MdPublishedWithChanges />} disabled={book && book.links && !book.links.publish}>{children}</Button>);
};

export default BookPublishButton;
