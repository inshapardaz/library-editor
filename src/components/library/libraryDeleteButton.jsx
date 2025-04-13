import PropTypes from 'prop-types';

// Local imports
import { useDeleteBookMutation } from '@/store/slices/books.api';
import DeleteButton from "@/components/deleteButton";

//---------------------------------
const LibraryDeleteButton = ({ library, t, onDeleted = () => { }, ...props }) => {
    const [deleteBook, { isLoading: isDeleting }] = useDeleteBookMutation();

    return (<DeleteButton {...props}
        title={t("library.actions.delete.title")}
        message={t("library.actions.delete.message", { title: library.name })}
        tooltip={t('library.actions.delete.title', { title: library.name })}
        successMessage={t("library.actions.delete.success", { title: library.name })}
        errorMessage={t("library.actions.delete.error", { title: library.name })}
        isDeleting={isDeleting}
        onDelete={() => { return deleteBook({ book: library }).unwrap() }}
        onDeleted={onDeleted}
    />)
}

LibraryDeleteButton.propTypes = {
    libraryId: PropTypes.string,
    t: PropTypes.any,
    onDeleted: PropTypes.func,
    library: PropTypes.shape({
        id: PropTypes.number,
        name: PropTypes.string,
        description: PropTypes.string,
        links: PropTypes.shape({
            delete: PropTypes.string,
        })
    })
};

export default LibraryDeleteButton;