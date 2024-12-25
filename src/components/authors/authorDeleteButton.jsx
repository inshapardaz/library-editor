import PropTypes from 'prop-types';

// Local imports
import { useDeleteAuthorMutation } from '@/store/slices/authors.api';
import DeleteButton from "@/components/deleteButton";
//---------------------------------

const AuthorDeleteButton = ({ libraryId, author, t, onDeleted }) => {

    const [deleteAuthor, { isLoading: isDeleting }] = useDeleteAuthorMutation();

    return (<DeleteButton
        title={t("author.actions.delete.title")}
        message={t("author.actions.delete.message", { name: author.name })}
        tooltip={t('author.actions.delete.label', { name: author.name })}
        successMessage={t("author.actions.delete.success", { name: author.name })}
        errorMessage={t("author.actions.delete.error", { name: author.name })}
        isDeleting={isDeleting}
        onDelete={() => { return deleteAuthor({ libraryId, authorId: author.id }).unwrap() }}
        onDeleted={onDeleted}
    />)
}

AuthorDeleteButton.propTypes = {
    libraryId: PropTypes.string,
    t: PropTypes.any,
    onDeleted: PropTypes.func,
    author: PropTypes.shape({
        id: PropTypes.number,
        name: PropTypes.string,
    })
};

export default AuthorDeleteButton;