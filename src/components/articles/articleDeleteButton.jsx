// Third party libraries
import { App, Button, Modal } from "antd";
import { FaTrash } from 'react-icons/fa';
import { ExclamationCircleFilled } from '@ant-design/icons';

// Local imports
import { useDeleteArticleMutation } from "../../features/api/articlesSlice";

// ------------------------------------------------------

const { confirm } = Modal;

// ------------------------------------------------------
export default function ArticleDeleteButton({ children, libraryId, article, t, type,  onDeleted = () => {}, danger = false, block = false, size= "middle" }) {
    const { message } = App.useApp();
    const [deleteArticle, { isLoading: isDeleting }] = useDeleteArticleMutation();

    const showConfirm = () => {
        confirm({
            title: t("article.actions.delete.title"),
            icon: <ExclamationCircleFilled />,
            content: t("article.actions.delete.message", { title : article.title }),
            okButtonProps: { disabled:  isDeleting },
            cancelButtonProps: { disabled:  isDeleting },
            closable: { isDeleting },
            onOk() {
                deleteArticle({ libraryId, articleId: article.id })
                    .unwrap()
                    .then(() => message.success(t("article.actions.delete.success")))
                    .then(() => onDeleted())
                    .catch((_) => message.error(t("article.actions.delete.error")));
            }
        });
    };

    return (<Button danger={danger} block={block} size={size} type={type} onClick={showConfirm} icon={<FaTrash/>}>{children}</Button>);
}
