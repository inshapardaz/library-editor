import React from 'react';

// Third party libraries
import { App, Button, Modal } from "antd";
import { FaTrash } from 'react-icons/fa';
import { ExclamationCircleFilled } from '@ant-design/icons';

// Local imports
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

    return (<Button danger={danger} block={block} size={size} type={type} onClick={showConfirm} icon={<FaTrash />}>{children}</Button>);
};

export default LibraryDeleteButton;
