import PropTypes from 'prop-types';

// Local imports
import { useDeleteBookContentMutation } from '@/store/slices/books.api';
import DeleteButton from "@/components/deleteButton";

//---------------------------------
const FileDeleteButton = ({ content, t, onDeleted = () => { } }) => {
    const [deleteBookContent, { isLoading: isDeleting }] = useDeleteBookContentMutation();

    return (<DeleteButton
        title={t("book.actions.deleteFile.title")}
        message={t("book.actions.deleteFile.message", { title: content.fileName })}
        tooltip={t('book.actions.deleteFile.title', { title: content.fileName })}
        successMessage={t("book.actions.deleteFile.success", { title: content.fileName })}
        errorMessage={t("book.actions.deleteFile.error", { title: content.fileName })}
        isDeleting={isDeleting}
        onDelete={() => { return deleteBookContent({ content }).unwrap() }}
        onDeleted={onDeleted}
    />)
}

FileDeleteButton.propTypes = {
    t: PropTypes.any,
    onDeleted: PropTypes.func,
    content: PropTypes.shape({
        id: PropTypes.number,
        fileName: PropTypes.string
    })
};

export default FileDeleteButton;
