import PropTypes from 'prop-types';

// Local imports
import { useDeleteIssueArticleMutation } from '@/store/slices/issueArticles.api';
import DeleteButton from "@/components/deleteButton";
//---------------------------------

const IssueArticleDeleteButton = ({ issueArticle, t, onDeleted }) => {

    const [deleteIssueArticle, { isLoading: isDeleting }] = useDeleteIssueArticleMutation();
    return (<DeleteButton
        title={t("issueArticle.actions.delete.title")}
        message={t("issueArticle.actions.delete.message", { name: issueArticle.title })}
        tooltip={t('issueArticle.actions.delete.label', { name: issueArticle.title })}
        successMessage={t("issueArticle.actions.delete.success", { name: issueArticle.title })}
        errorMessage={t("issueArticle.actions.delete.error", { name: issueArticle.title })}
        isDeleting={isDeleting}
        onDelete={() => { return deleteIssueArticle({ issueArticle }).unwrap() }}
        onDeleted={onDeleted}
    />)
}

IssueArticleDeleteButton.propTypes = {
    t: PropTypes.any,
    onDeleted: PropTypes.func,
    issueArticle: PropTypes.shape({
        id: PropTypes.number,
        title: PropTypes.string,
    })
};

export default IssueArticleDeleteButton;