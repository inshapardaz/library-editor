// Third party libraries
import { App, Button, Modal } from "antd";
import { FaTrash } from 'react-icons/fa';
import { ExclamationCircleFilled } from '@ant-design/icons';

// Local imports
import { useDeleteCategoryMutation } from "../../features/api/categoriesSlice";

// ------------------------------------------------------

const { confirm } = Modal;

// ------------------------------------------------------
export default function CategoryDeleteButton({ children, libraryId, category, t, type, onDeleted = () => { }, danger = false, block = false, size = "middle" }) {
    const { message } = App.useApp();
    const [deleteCategory, { isLoading: isDeleting }] = useDeleteCategoryMutation();

    const showConfirm = () => {
        confirm({
            title: t("category.actions.delete.title"),
            icon: <ExclamationCircleFilled />,
            content: t("category.actions.delete.message", { name: category.name }),
            okButtonProps: { disabled: isDeleting },
            cancelButtonProps: { disabled: isDeleting },
            closable: isDeleting,
            onOk() {
                return deleteCategory({ libraryId, categoryId: category.id })
                    .unwrap()
                    .then(() => message.success(t("category.actions.delete.success")))
                    .then(() => onDeleted())
                    .catch((_) => message.error(t("category.actions.delete.error")));
            }
        });
    };

    return (<Button danger={danger} block={block} size={size} type={type} onClick={showConfirm} icon={<FaTrash />}>{children}</Button>);
}
