import PropTypes from 'prop-types';

// Local imports
import { useDeleteArticleMutation } from '@/store/slices/articles.api';
import DeleteButton from "@/components/deleteButton";

//---------------------------------
const WritingDeleteButton = ({ libraryId, writing, t, onDeleted = () => { }, ...props }) => {
    const [deleteArticle, { isLoading: isDeleting }] = useDeleteArticleMutation();

    return (<DeleteButton {...props}
        title={t("writing.actions.delete.title")}
        message={t("writing.actions.delete.message", { title: writing.title })}
        tooltip={t('writing.actions.delete.label', { title: writing.title })}
        successMessage={t("writing.actions.delete.success", { title: writing.title })}
        errorMessage={t("writing.actions.delete.error", { title: writing.title })}
        isDeleting={isDeleting}
        onDelete={() => { return deleteArticle({ libraryId, articleId: writing.id }).unwrap() }}
        onDeleted={onDeleted}
    />)
}

WritingDeleteButton.propTypes = {
    libraryId: PropTypes.string,
    t: PropTypes.any,
    onDeleted: PropTypes.func,
    writing: PropTypes.shape({
        id: PropTypes.number,
        title: PropTypes.string,
        description: PropTypes.string,
        authors: PropTypes.array,
        pageCount: PropTypes.number,
        chapterCount: PropTypes.number,
        links: PropTypes.shape({
            update: PropTypes.string,
            delete: PropTypes.string,
            image: PropTypes.string
        })
    })
};

export default WritingDeleteButton;