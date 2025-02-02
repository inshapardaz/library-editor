import PropTypes from 'prop-types';

// Local imports
import { useDeleteBookContentMutation } from '@/store/slices/books.api';
import DeleteButton from "@/components/deleteButton";

//---------------------------------
const FileDeleteButton = ({ content, t, onDeleted = () => { } }) => {
    const [deleteBookContent, { isLoading: isDeleting }] = useDeleteBookContentMutation();

    return (<DeleteButton
        title={t("issue.actions.deleteFile.title")}
        message={t("issue.actions.deleteFile.message", { title: content.fileName })}
        tooltip={t('issue.actions.deleteFile.title', { title: content.fileName })}
        successMessage={t("issue.actions.deleteFile.success", { title: content.fileName })}
        errorMessage={t("issue.actions.deleteFile.error", { title: content.fileName })}
        isDeleting={isDeleting}
        onDelete={() => { return deleteBookContent({ content }).unwrap() }}
        onDeleted={onDeleted}
    />)
}

FileDeleteButton.propTypes = {
    libraryId: PropTypes.string,
    t: PropTypes.any,
    onDeleted: PropTypes.func,
    content: PropTypes.shape({
        id: PropTypes.number,
        fileName: PropTypes.string
    })
};

export default FileDeleteButton;