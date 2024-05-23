import React from 'react';

// Third party libraries
import { App, Button, Modal } from "antd";

// Local imports
import { FaTrash, ExclamationCircleFilled } from "/src/icons";
import { useDeleteBookPageMutation } from "/src/store/slices/booksSlice";

// ------------------------------------------------------
const { confirm } = Modal;
// ------------------------------------------------------
const PageDeleteButton = ({
    pages = [],
    t,
    type,
    onDeleted = () => { },
}) => {
    const { message } = App.useApp();
    const [deleteBookPage, { isLoading: isDeleting }] =
        useDeleteBookPageMutation();
    const count = pages ? pages.length : 0;

    const showConfirm = () => {
        confirm({
            title: t("page.actions.delete.title", { count }),
            icon: <ExclamationCircleFilled />,
            content: t("page.actions.delete.message", {
                sequenceNumber: pages.map((p) => p.sequenceNumber).join(","),
            }),
            okButtonProps: { disabled: isDeleting },
            cancelButtonProps: { disabled: isDeleting },
            closable: !isDeleting,
            onOk: () => {
                const promises = pages
                    .map((page) => {
                        if (page && page.links && page.links.delete) {
                            return deleteBookPage({ page }).unwrap();
                        }
                        return Promise.resolve();
                    });

                return Promise.all(promises)
                    .then(() => onDeleted())
                    .then(() => { message.success(t("page.actions.delete.success")) })
                    .catch(() => { message.error(t("page.actions.delete.error")) }
                    );
            },
        });
    };

    return (
        <Button
            type={type}
            disabled={count < 1}
            onClick={showConfirm}
            icon={<FaTrash />}
        ></Button>
    );
};

export default PageDeleteButton;
