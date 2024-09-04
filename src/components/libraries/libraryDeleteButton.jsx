import React from 'react';

// Third party libraries
import { App, Button, Modal, Tooltip } from "antd";

// Local imports
import { FaTrash, ExclamationCircleFilled } from '/src/icons';
import { useDeleteLibraryMutation } from "/src/store/slices/librariesSlice";

// ------------------------------------------------------

const { confirm } = Modal;

// ------------------------------------------------------
const LibraryDeleteButton = ({
    children,
    library,
    t,
    type,
    onDeleted = () => { },
    danger = false,
    block = false,
    size = "middle"
}) => {
    const { message } = App.useApp();
    const [deleteLibrary, { isLoading: isDeleting }] = useDeleteLibraryMutation();

    const showConfirm = () => {
        confirm({
            title: t("library.actions.delete.title"),
            icon: <ExclamationCircleFilled />,
            content: t("library.actions.delete.message", { title: library.name }),
            okButtonProps: { disabled: isDeleting },
            cancelButtonProps: { disabled: isDeleting },
            closable: isDeleting,
            onOk() {
                return deleteLibrary({ library })
                    .unwrap()
                    .then(() => onDeleted())
                    .then(() => { message.success(t("library.actions.delete.success")) })
                    .catch(() => { message.error(t("library.actions.delete.error")) });
            }
        });
    };

    if (library?.links?.delete) {
        return (<Tooltip title={t('actions.delete')}>
            <Button danger={danger} block={block} size={size} type={type} onClick={showConfirm} icon={<FaTrash />}>{children}</Button>
        </Tooltip>);
    } else {
        return null;
    }
};

export default LibraryDeleteButton;
