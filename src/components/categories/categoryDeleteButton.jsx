import PropTypes from 'prop-types';

// Local imports
import { useDeleteCategoryMutation } from '@/store/slices/categories.api';
import DeleteButton from "@/components/deleteButton";
//---------------------------------

const CategoryDeleteButton = ({ libraryId, category, t, onDeleted }) => {

    const [deleteCategory, { isLoading: isDeleting }] = useDeleteCategoryMutation();

    return (<DeleteButton
        message={t("category.actions.delete.message", { name: category.name })}
        tooltip={t('category.actions.delete.label', { name: category.name })}
        successMessage={t("category.actions.delete.success", { name: category.name })}
        errorMessage={t("category.actions.delete.error", { name: category.name })}
        isDeleting={isDeleting}
        onDelete={() => { return deleteCategory({ libraryId, categoryId: category.id }).unwrap() }}
        onDeleted={onDeleted}
        type="actionIcon"
        variant="transparent" color="gray" size="sm"
    />)
}

CategoryDeleteButton.propTypes = {
    libraryId: PropTypes.string,
    t: PropTypes.any,
    onDeleted: PropTypes.func,
    category: PropTypes.shape({
        id: PropTypes.number,
        name: PropTypes.string,
    })
};

export default CategoryDeleteButton;
