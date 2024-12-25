import PropTypes from 'prop-types';

// Local imports
import { useDeletePeriodicalMutation } from '@/store/slices/periodicals.api';
import DeleteButton from "@/components/deleteButton";
//---------------------------------

const PeriodicalDeleteButton = ({ libraryId, periodical, t, onDeleted }) => {

    const [deletePeriodical, { isLoading: isDeleting }] = useDeletePeriodicalMutation();

    return (<DeleteButton
        title={t("periodical.actions.delete.title")}
        message={t("periodical.actions.delete.message", { title: periodical.title })}
        tooltip={t('periodical.actions.delete.label', { title: periodical.title })}
        successMessage={t("periodical.actions.delete.success", { title: periodical.title })}
        errorMessage={t("periodical.actions.delete.error", { title: periodical.title })}
        isDeleting={isDeleting}
        onDelete={() => { return deletePeriodical({ libraryId, periodicalId: periodical.id }).unwrap() }}
        onDeleted={onDeleted}
    />)
}

PeriodicalDeleteButton.propTypes = {
    libraryId: PropTypes.string,
    t: PropTypes.any,
    onDeleted: PropTypes.func,
    periodical: PropTypes.shape({
        id: PropTypes.number,
        title: PropTypes.string,
    })
};

export default PeriodicalDeleteButton;