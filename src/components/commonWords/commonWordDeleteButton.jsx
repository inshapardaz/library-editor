import PropTypes from 'prop-types';

// Local imports
import { useDeleteCommonWordMutation } from '@/store/slices/tools.api';
import DeleteButton from "@/components/deleteButton";

//---------------------------------
const CommonWordDeleteButton = ({ word, t, onDeleted = () => { } }) => {
    const [deleteWord, { isLoading: isDeleting }] = useDeleteCommonWordMutation();

    return (<DeleteButton
        title={t("corrections.actions.delete.title")}
        message={t("corrections.actions.delete.message", { title: word.word })}
        tooltip={t('corrections.actions.delete.label', { title: word.word })}
        successMessage={t("corrections.actions.delete.success", { title: word.word })}
        errorMessage={t("corrections.actions.delete.error", { title: word.word })}
        isDeleting={isDeleting}
        onDelete={() => { return deleteWord({ word }).unwrap() }}
        onDeleted={onDeleted}
    />)
}

CommonWordDeleteButton.propTypes = {
    libraryId: PropTypes.string,
    t: PropTypes.any,
    onDeleted: PropTypes.func,
    word: PropTypes.string,
    language: PropTypes.string
};

export default CommonWordDeleteButton;