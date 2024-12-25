import PropTypes from 'prop-types';

// Local imports
import { useDeleteBookMutation } from '@/store/slices/books.api';
import DeleteButton from "@/components/deleteButton";

//---------------------------------
const BookDeleteButton = ({ book, t, onDeleted = () => { } }) => {
    const [deleteBook, { isLoading: isDeleting }] = useDeleteBookMutation();

    return (<DeleteButton
        title={t("book.actions.delete.title")}
        message={t("book.actions.delete.message", { title: book.title })}
        tooltip={t('book.actions.delete.label', { title: book.title })}
        successMessage={t("book.actions.delete.success", { title: book.title })}
        errorMessage={t("book.actions.delete.error", { title: book.title })}
        isDeleting={isDeleting}
        onDelete={() => { return deleteBook({ book }).unwrap() }}
        onDeleted={onDeleted}
    />)
}

BookDeleteButton.propTypes = {
    libraryId: PropTypes.string,
    t: PropTypes.any,
    onDeleted: PropTypes.func,
    book: PropTypes.shape({
        id: PropTypes.number,
        title: PropTypes.string,
        description: PropTypes.string,
        authors: PropTypes.array,
        pageCount: PropTypes.number,
        chapterCount: PropTypes.number,
        links: PropTypes.shape({
            image: PropTypes.string,
            udpate: PropTypes.string,
            delete: PropTypes.string,
        })
    })
};

export default BookDeleteButton;