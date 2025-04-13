import PropTypes from 'prop-types';

// Local imports
import { useDeleteSeriesMutation } from '@/store/slices/series.api';
import DeleteButton from "@/components/deleteButton";
//---------------------------------

const SeriesDeleteButton = ({ libraryId, series, t, onDeleted }) => {

    const [deleteSeries, { isLoading: isDeleting }] = useDeleteSeriesMutation();
    return (<DeleteButton
        title={t("series.actions.delete.title")}
        message={t("series.actions.delete.message", { name: series.name })}
        tooltip={t('series.actions.delete.label', { name: series.name })}
        successMessage={t("series.actions.delete.success", { name: series.name })}
        errorMessage={t("book.actions.delete.error", { name: series.name })}
        isDeleting={isDeleting}
        onDelete={() => { return deleteSeries({ libraryId, seriesId: series.id }).unwrap() }}
        onDeleted={onDeleted}
    />)
}

SeriesDeleteButton.propTypes = {
    libraryId: PropTypes.string,
    t: PropTypes.any,
    onDeleted: PropTypes.func,
    series: PropTypes.shape({
        id: PropTypes.number,
        name: PropTypes.string,
    })
};

export default SeriesDeleteButton;