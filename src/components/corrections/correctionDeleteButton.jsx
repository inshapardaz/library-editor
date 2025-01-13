import PropTypes from 'prop-types';

// Local imports
import { useDeleteCorrectionMutation } from '@/store/slices/tools.api';
import DeleteButton from "@/components/deleteButton";

//---------------------------------
const CorrectionDeleteButton = ({ correction, t, onDeleted = () => { } }) => {
    const [deleteCorrection, { isLoading: isDeleting }] = useDeleteCorrectionMutation();

    return (<DeleteButton
        title={t("corrections.actions.delete.title")}
        message={t("corrections.actions.delete.message", { title: correction.incorrectText })}
        tooltip={t('corrections.actions.delete.label', { title: correction.incorrectText })}
        successMessage={t("corrections.actions.delete.success", { title: correction.incorrectText })}
        errorMessage={t("corrections.actions.delete.error", { title: correction.incorrectText })}
        isDeleting={isDeleting}
        onDelete={() => { return deleteCorrection({ correction }).unwrap() }}
        onDeleted={onDeleted}
    />)
}

CorrectionDeleteButton.propTypes = {
    libraryId: PropTypes.string,
    t: PropTypes.any,
    onDeleted: PropTypes.func,
    correction: PropTypes.shape({
        id: PropTypes.number,
        language: PropTypes.string,
        profile: PropTypes.string,
        incorrectText: PropTypes.string,
        correctText: PropTypes.string,
        completeWord: PropTypes.bool,
        links: PropTypes.shape({
            image: PropTypes.string,
            update: PropTypes.string,
            delete: PropTypes.string
        })
    })
};

export default CorrectionDeleteButton;