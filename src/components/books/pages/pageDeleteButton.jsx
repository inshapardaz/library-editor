import PropTypes from 'prop-types';

// UI Library Imprort

// Local imports
import { useDeleteBookPagesMutation } from "@/store/slices/books.api";
import { IconDelete } from "@/components/icons";
import BatchActionDrawer from '@/components/batchActionDrawer';

// ------------------------------------------------------

const PageDeleteButton = ({ pages = [], t, type, showIcon = true, onDeleted = () => { } }) => {
    const [deletePages, { isLoading: isDeleting }] =
        useDeleteBookPagesMutation();
    const count = pages ? pages.length : 0;
    const onOk = async () => true;
    return (<>
        <BatchActionDrawer t={t}
            tooltip={t('page.actions.delete.title')}
            buttonType={type}
            disabled={count === 0}
            icon={showIcon && <IconDelete />}
            sliderTitle={t("page.actions.delete.title")}
            onOkFunc={onOk}
            busy={isDeleting}
            listTitle={t("page.actions.delete.message")}
            items={[...pages].sort((a, b) => b.sequenceNumber > a.sequenceNumber)}
            itemTitleFunc={page => page.sequenceNumber}
            mutation={deletePages}
            successMessage={t("page.actions.delete.success", { count })}
            errorMessage={t("page.actions.delete.error", { count })}
            onSuccess={onDeleted}
        >

        </BatchActionDrawer >
    </>);
};

PageDeleteButton.propTypes = {
    t: PropTypes.any,
    type: PropTypes.string,
    showIcon: PropTypes.bool,
    pages: PropTypes.arrayOf(
        PropTypes.shape({
            id: PropTypes.number,
            sequenceNumber: PropTypes.number,
            links: PropTypes.shape({
                delete: PropTypes.string,
            }),
        })),
    isLoading: PropTypes.object,
    onDeleted: PropTypes.func
};

export default PageDeleteButton;
