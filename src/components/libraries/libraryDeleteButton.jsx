// Third party libraries
import { App, Button, Modal } from "antd";
import { FaTrash } from 'react-icons/fa';
import { ExclamationCircleFilled } from '@ant-design/icons';

// Local imports
import { useDeleteLibraryMutation } from "../../features/api/librariesSlice";

// ------------------------------------------------------

const { confirm } = Modal;

// ------------------------------------------------------
export default function LibraryDeleteButton({ children, library, t, type,  onDeleted = () => {}, danger = false, block = false, size= "middle" }) {
    const { message } = App.useApp();
    const [deleteLibrary, { isLoading: isDeleting }] = useDeleteLibraryMutation();

    const showConfirm = () => {
        confirm({
            title: t("library.actions.delete.title"),
            icon: <ExclamationCircleFilled />,
            content: t("library.actions.delete.message", { title : library.name }),
            okButtonProps: { disabled:  isDeleting },
            cancelButtonProps: { disabled:  isDeleting },
            closable: { isDeleting },
            onOk() {
                deleteLibrary({ library })
                    .unwrap()
                    .then(() => message.success(t("library.actions.delete.success")))
                    .then(() => onDeleted())
                    .catch((_) => message.error(t("library.actions.delete.error")));
            }
        });
    };

    return (<Button danger={danger} block={block} size={size} type={type} onClick={showConfirm} icon={<FaTrash/>}>{children}</Button>);
}
