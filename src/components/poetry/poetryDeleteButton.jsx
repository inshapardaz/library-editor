import PropTypes from 'prop-types';

// Local imports
import { useDeleteArticleMutation } from '@/store/slices/articles.api';
import DeleteButton from "@/components/deleteButton";

//---------------------------------
const PoetryDeleteButton = ({ libraryId, poetry, t, onDeleted = () => { }, ...props }) => {
    const [deleteArticle, { isLoading: isDeleting }] = useDeleteArticleMutation();

    return (<DeleteButton {...props}
        title={t("poetry.actions.delete.title")}
        message={t("poetry.actions.delete.message", { title: poetry.title })}
        tooltip={t('poetry.actions.delete.label', { title: poetry.title })}
        successMessage={t("poetry.actions.delete.success", { title: poetry.title })}
        errorMessage={t("poetry.actions.delete.error", { title: poetry.title })}
        isDeleting={isDeleting}
        onDelete={() => { return deleteArticle({ libraryId, articleId: poetry.id }).unwrap() }}
        onDeleted={onDeleted}
    />)
}

PoetryDeleteButton.propTypes = {
    libraryId: PropTypes.string,
    t: PropTypes.any,
    onDeleted: PropTypes.func,
    poetry: PropTypes.shape({
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

export default PoetryDeleteButton;