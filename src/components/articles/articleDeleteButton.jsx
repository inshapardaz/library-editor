import React from 'react';

// Third party libraries
import { App, Button, Modal } from "antd";
import { ExclamationCircleFilled } from '/src/icons';

// Local imports
import { FaTrash } from '/src/icons';
import { useDeleteArticleMutation } from "/src/store/slices/articlesSlice";

// ------------------------------------------------------
const { confirm } = Modal;
// ------------------------------------------------------

const ArticleDeleteButton = ({ children,
    libraryId,
    article,
    t,
    type,
    onDeleted = () => { },
    danger = false,
    block = false,
    size = "middle" }) => {
    const { message } = App.useApp();
    const [deleteArticle, { isLoading: isDeleting }] = useDeleteArticleMutation();

    const showConfirm = () => {
        confirm({
            title: t("article.actions.delete.title"),
            icon: <ExclamationCircleFilled />,
            content: t("article.actions.delete.message", { title: article.title }),
            okButtonProps: { disabled: isDeleting },
            cancelButtonProps: { disabled: isDeleting },
            closable: isDeleting,
            onOk() {
                return deleteArticle({ libraryId, articleId: article.id })
                    .unwrap()
                    .then(() => onDeleted())
                    .then(() => { message.success(t("article.actions.delete.success")) })
                    .catch(() => { message.error(t("article.actions.delete.error")) });
            }
        });
    };

    return (<Button danger={danger} block={block} size={size} type={type} onClick={showConfirm} icon={<FaTrash />}>{children}</Button>);
};

export default ArticleDeleteButton;
