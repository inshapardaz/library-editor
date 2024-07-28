import React from 'react';

// Third party libraries
import { FaTrash } from "/src/icons";

// Local imports
import { useDeleteIssueArticlesMutation } from "/src/store/slices/issueArticlesSlice";
import BatchActionDrawer from '/src/components/batchActionDrawer';

// ------------------------------------------------------

const IssueArticleDeleteButton = ({ articles = [], t, type, showIcon = true }) => {
    const [deleteIssueArticles, { isLoading: isDeleting }] =
        useDeleteIssueArticlesMutation();
    const count = articles ? articles.length : 0;

    const onOk = () => (request) => request;

    return (<>
        <BatchActionDrawer t={t}
            tooltip={t('issueArticle.actions.delete.title')}
            buttonType={type}
            disabled={count === 0}
            icon={showIcon && <FaTrash />}
            sliderTitle={t("issueArticle.actions.delete.title")}
            onOk={onOk}
            closable={!isDeleting}
            listTitle={t("issueArticle.actions.delete.message")}
            items={[...articles].sort((a, b) => b.sequenceNumber > a.sequenceNumber)}
            itemTitle={article => article.title}
            mutation={deleteIssueArticles}
            successMessage={t("issueArticle.actions.delete.success", { count })}
            errorMessage={t("issueArticle.actions.delete.error", { count })}
        >

        </BatchActionDrawer >
    </>);
};

export default IssueArticleDeleteButton;
